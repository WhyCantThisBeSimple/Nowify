<template>
  <div class="clock">
    <div class="clock__time">
      {{ currentTime }}
    </div>

    <div class="clock__date">
      {{ currentDate }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Clock",

  data() {
    return {
      currentTime: "",
      currentDate: "",
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

      const weekday = now.toLocaleDateString([], {
        weekday: "long"
      })
      const month = now.toLocaleDateString([], {
        month: "long"
      })
      const day = now.getDate()
      const ordinalDay = this.getOrdinalSuffix(day)

      this.currentDate = `${weekday[0].toUpperCase()}${weekday.slice(1)} ${ordinalDay} ${month[0].toUpperCase()}${month.slice(1)}`
    },

    getOrdinalSuffix(day) {
      const remainder10 = day % 10
      const remainder100 = day % 100

      if (remainder10 === 1 && remainder100 !== 11) {
        return `${day}st`
      }

      if (remainder10 === 2 && remainder100 !== 12) {
        return `${day}nd`
      }

      if (remainder10 === 3 && remainder100 !== 13) {
        return `${day}rd`
      }

      return `${day}th`
    }
  }
}
</script>

<style scoped>
.clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .35rem;

  text-align: center;
}

.clock__time {
  font-size: clamp(5rem, 10vw, 9rem);
  font-weight: 200;
  letter-spacing: -.04em;
  line-height: 1;
}

.clock__date {
  font-size: 1.1rem;
  letter-spacing: .04em;
  opacity: .72;
}
</style>