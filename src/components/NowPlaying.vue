<template>
  <div id="app">
    <!-- Playing -->
    <div
      v-if="player.playing"
      class="now-playing"
      :class="getNowPlayingClass()"
    >
      <!-- Blurred Background -->
      <div
        class="now-playing__background"
        :style="{ backgroundImage: `url(${player.trackAlbum.image})` }"
      ></div>

      <!-- Main Content -->
      <div class="now-playing__content">
        <!-- Left -->
        <div class="now-playing__left">
          <AlbumArt :player="player" />
        </div>

        <!-- Right -->
        <div class="now-playing__right">
          <div class="now-playing__track-info">
            <TrackInfo :player="player" />
          </div>

          <Clock />
        </div>
      </div>
    </div>

    <!-- Not Playing -->
    <div
      v-else
      class="now-playing now-playing--idle"
    >
      <div class="now-playing__idle-background"></div>

      <div class="now-playing__idle-content">
        <Clock />

        <p class="now-playing__idle-message">
          Waiting for music…
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TrackInfo from "./TrackInfo.vue"
import AlbumArt from "./AlbumArt.vue"
import Clock from "./Clock.vue"
import * as Vibrant from "node-vibrant"

import props from "@/utils/props.js"
import {
  fetchCurrentlyPlaying,
  getEmptyPlayer,
  normalizeCurrentlyPlaying
} from "@/services/spotify.js"

export default {
  name: "NowPlaying",

  components: {
    TrackInfo,
    AlbumArt,
    Clock
  },

  props: {
    auth: props.auth,
    endpoints: props.endpoints,
    player: props.player
  },

  data() {
    return {
      pollPlaying: "",
      colourPalette: "",
      swatches: [],
      lastTrackSignature: ""
    }
  },

  mounted() {
    if (this.auth.status && this.auth.accessToken) {
      this.getNowPlaying()
      this.setDataInterval()
    }
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
  },

  methods: {
    async getNowPlaying() {
      try {
        const response = await fetchCurrentlyPlaying(
          this.auth.accessToken,
          this.endpoints
        )

        const data = normalizeCurrentlyPlaying(response)
        const trackSignature = this.getTrackSignature(data)
        const shouldRefreshPalette = trackSignature !== this.lastTrackSignature

        this.$emit("spotifyTrackUpdated", data)

        if (shouldRefreshPalette) {
          this.lastTrackSignature = trackSignature
          this.$nextTick(() => {
            this.getAlbumColours()
          })
        }
      } catch (error) {
        this.handleExpiredToken()

        const data = getEmptyPlayer()

        this.$emit("spotifyTrackUpdated", data)
      }
    },

    getNowPlayingClass() {
      return this.player.playing
        ? "now-playing--active"
        : "now-playing--idle"
    },

    getTrackSignature(player = {}) {
      const album = player.trackAlbum || {}
      const artists = Array.isArray(player.trackArtists)
        ? player.trackArtists.join("|")
        : ""

      return [player.trackTitle || "", artists, album.title || "", album.image || ""]
        .join("|")
    },

    getAlbumColours() {
      if (!this.player.trackAlbum?.image) {
        return
      }

      Vibrant.from(this.player.trackAlbum.image)
        .quality(1)
        .clearFilters()
        .getPalette()
        .then(palette => {
          this.handleAlbumPalette(palette)
        })
    },

    setDataInterval() {
      clearInterval(this.pollPlaying)

      this.pollPlaying = setInterval(() => {
        this.getNowPlaying()
      }, 2500)
    },

    setAppColours() {
      document.documentElement.style.setProperty(
        "--color-text-primary",
        this.colourPalette.text
      )

      document.documentElement.style.setProperty(
        "--colour-background-now-playing",
        this.colourPalette.background
      )
    },

    handleAlbumPalette(palette) {
      const albumColours = Object.keys(palette)
        .filter(key => palette[key])
        .map(key => ({
          text: palette[key].getTitleTextColor(),
          background: palette[key].getHex()
        }))

      this.swatches = albumColours
      this.colourPalette = albumColours[0] || {
        text: "#ffffff",
        background: "#1e1e1e"
      }

      this.$nextTick(() => {
        this.setAppColours()
      })
    },

    handleExpiredToken() {
      clearInterval(this.pollPlaying)
      this.$emit("requestRefreshToken")
    }
  },

  watch: {
    auth(newVal) {
      if (newVal.status === true && newVal.accessToken) {
        this.getNowPlaying()
        this.setDataInterval()
        return
      }

      clearInterval(this.pollPlaying)
    },

    player: {
      handler(newVal, oldVal) {
        const oldSignature = this.getTrackSignature(oldVal)
        const newSignature = this.getTrackSignature(newVal)

        if (newSignature && newSignature !== oldSignature) {
          this.lastTrackSignature = newSignature
          this.$nextTick(() => {
            this.getAlbumColours()
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>