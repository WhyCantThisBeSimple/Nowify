<template>
  <div class="track-info">
    <h1 class="track-info__title">
      {{ player.trackTitle }}
    </h1>

    <h2 class="track-info__artist">
      {{ player.trackArtists.join(", ") }}
    </h2>

    <p class="track-info__album">
      {{ player.trackAlbum.title }}
    </p>
  </div>
</template>

<script>
export default {
  name: "TrackInfo",

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.track-info {
  text-align: left;
}

.track-info__title {
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 700;
  line-height: 1;
  margin-bottom: .75rem;
}

.track-info__artist {
  font-size: clamp(1.6rem, 2vw, 2.4rem);
  margin-bottom: .5rem;
  opacity: .9;
}

.track-info__album {
  font-size: 1.25rem;
  opacity: .65;
  letter-spacing: .08em;
}
</style>