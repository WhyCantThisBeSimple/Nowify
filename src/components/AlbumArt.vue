<template>
  <div class="album-art">
    <img
      :src="player.trackAlbum.image"
      :alt="player.trackTitle"
      class="album-art__image"
    />
  </div>
</template>

<script>
export default {
  name: "AlbumArt",

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.album-art {
  display: flex;
  justify-content: center;
  align-items: center;
}

.album-art__image {
  width: min(100%, 420px);
  aspect-ratio: 1;
  object-fit: cover;

  border-radius: 24px;

  box-shadow:
    0 30px 80px rgba(0, 0, 0, .45);
}
</style>