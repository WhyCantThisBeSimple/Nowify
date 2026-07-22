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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .45rem;

  width: min(100%, 620px);
  padding: 1.25rem 1.5rem;

  text-align: left;

  border-radius: 20px;
  background: rgba(0, 0, 0, .24);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, .22);
}

.track-info__title,
.track-info__artist,
.track-info__album {
  margin: 0;
}

.track-info__title {
  font-size: clamp(2.3rem, 4vw, 4.5rem);
  font-weight: 700;
  line-height: 1.02;
}

.track-info__artist {
  font-size: clamp(1.4rem, 1.8vw, 2.1rem);
  opacity: .9;
}

.track-info__album {
  font-size: 1.1rem;
  opacity: .65;
  letter-spacing: .08em;
  text-transform: uppercase;
}
</style>