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
      <h1 class="now-playing__idle-message">
        No music is playing 😔
      </h1>
    </div>
  </div>
</template>

<script>
import TrackInfo from "./TrackInfo.vue"
import AlbumArt from "./AlbumArt.vue"
import Clock from "./Clock.vue"
import * as Vibrant from "node-vibrant"

import props from "@/utils/props.js"

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
      playerResponse: {},
      playerData: this.getEmptyPlayer(),
      colourPalette: "",
      swatches: []
    }
  },

  mounted() {
    // this.setDataInterval()
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
  },

  methods: {
    async getNowPlaying() {
      let data = {}

      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
          {
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.status}`)
        }

        if (response.status === 204) {
          data = this.getEmptyPlayer()
          this.playerData = data

          this.$nextTick(() => {
            this.$emit("spotifyTrackUpdated", data)
          })

          return
        }

        data = await response.json()
        this.playerResponse = data
      } catch (error) {
        this.handleExpiredToken()

        data = this.getEmptyPlayer()
        this.playerData = data

        this.$nextTick(() => {
          this.$emit("spotifyTrackUpdated", data)
        })
      }
    },

    getNowPlayingClass() {
      return this.player.playing
        ? "now-playing--active"
        : "now-playing--idle"
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

    getEmptyPlayer() {
      return {
        playing: false,
        trackAlbum: {},
        trackArtists: [],
        trackId: "",
        trackTitle: ""
      }
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

    handleNowPlaying() {
      if (
        this.playerResponse.error?.status === 401 ||
        this.playerResponse.error?.status === 400
      ) {
        this.handleExpiredToken()
        return
      }

      if (this.playerResponse.is_playing === false) {
        this.playerData = this.getEmptyPlayer()
        return
      }

      if (this.playerResponse.item?.id === this.playerData.trackId) {
        return
      }

      this.playerData = {
        playing: this.playerResponse.is_playing,
        trackArtists: this.playerResponse.item.artists.map(
          artist => artist.name
        ),
        trackTitle: this.playerResponse.item.name,
        trackId: this.playerResponse.item.id,
        trackAlbum: {
          title: this.playerResponse.item.album.name,
          image: this.playerResponse.item.album.images[0].url
        }
      }
    },

    handleAlbumPalette(palette) {
      const albumColours = Object.keys(palette)
        .filter(key => palette[key])
        .map(key => ({
          text: palette[key].getTitleTextColor(),
          background: palette[key].getHex()
        }))

      this.swatches = albumColours

      this.colourPalette =
        albumColours[Math.floor(Math.random() * albumColours.length)]

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
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },

    playerResponse() {
      this.handleNowPlaying()
    },

    playerData() {
      this.$emit("spotifyTrackUpdated", this.playerData)

      this.$nextTick(() => {
        this.getAlbumColours()
      })
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>