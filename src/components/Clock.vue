<template>
  <div class="clock">
    {{ currentTime }}
  </div>
</template>

<script>
export default {
  name: "Clock",

  data() {
    return {
      currentTime: "",
      timer: null
    }
  },

  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    updateTime() {
      const now = new Date()

      this.currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  }
}
</script>

<style scoped>
.clock {
  align-self: flex-end;

  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 200;
  letter-spacing: -.04em;
  line-height: 1;
}
</style>