<template>
  <div id="app">
    <Component
      :is="getCurrentComponent"
      :auth="auth"
      :endpoints="endpoints"
      :player="player"
      @spotifyTrackUpdated="updateCurrentTrack"
      @requestRefreshToken="requestRefreshTokens"
    ></Component>
  </div>
</template>

<script>
import Authorise from '@/components/Authorise'
import NowPlaying from '@/components/NowPlaying'

import { getStoredAuth, setStoredAuth } from '@/utils/utils.js'

export default {
  name: 'App',

  components: {
    Authorise,
    NowPlaying
  },

  props: {},

  data() {
    const storedAuth = getStoredAuth()

    return {
      storedAuth: '',
      test: 'hello, world',
      isDevelopment: process.env.NODE_ENV === 'development',
      auth: {
        status: Boolean(storedAuth.status),
        clientId: process.env.VUE_APP_SP_CLIENT_ID,
        clientSecret: process.env.VUE_APP_SP_CLIENT_SECRET,
        authCode: storedAuth.authCode || '',
        accessToken: storedAuth.accessToken || '',
        refreshToken: storedAuth.refreshToken || ''
      },
      endpoints: {
        auth: 'https://accounts.spotify.com/authorize',
        token: 'https://accounts.spotify.com/api/token',
        base: 'https://api.spotify.com/v1',
        nowPlaying: 'me/player/currently-playing'
      },
      player: {
        playing: false,
        trackArtists: [],
        trackTitle: '',
        trackAlbum: {}
      },
      storedId: ''
    }
  },

  computed: {
    /**
     * Check for the existence of a stored access token and
     * return the correct Component to be displayed.
     * @return {String}
     */
    getCurrentComponent() {
      if (this.isDevelopment) {
        return 'NowPlaying'
      }

      return this.auth.status || this.auth.accessToken || this.auth.refreshToken
        ? 'NowPlaying'
        : 'Authorise'
    }
  },

  mounted() {
  console.log("Client ID:", this.auth.clientId)
  console.log("Client Secret exists:", !!this.auth.clientSecret)

  if (!this.isDevelopment) {
    return
  }

  this.player = {
    playing: true,
    trackArtists: ["Fleetwood Mac"],
    trackTitle: "Dreams",
    trackAlbum: {
      title: "Rumours",
      image: "https://picsum.photos/600"
    }
  }

  this.auth.status = true
},

  methods: {
    /**
     * Store
     */
    storeAccessToken() {
      this.getAccessToken()
    },

    /**
     * Request a refresh token from Spotify.
     */
    requestRefreshTokens() {
      this.auth.accessToken = ''
      this.auth.authCode = ''
      this.auth.status = false

      this.player = {
        playing: false,
        trackArtists: [],
        trackTitle: '',
        trackAlbum: {}
      }
    },

    /**
     * Update the player object.
     * @param {Object} value - Spotify playr object.
     */
    updateCurrentTrack(value) {
      this.player = value
    }
  },

  watch: {
    /**
     * Watch the authorisation status.
     */
    'auth.status': function() {
      setStoredAuth(this.auth)
    }
  }
}
</script>
