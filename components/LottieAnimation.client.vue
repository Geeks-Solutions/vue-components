<template>
  <div ref="lottieContainer" :style="{ width, height }"></div>
</template>

<script>
export default {
  props: {
    src: { type: String, required: true }, // JSON path
    type: { type: String, default: 'lottie' },
    loop: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: true },
    width: { type: String, default: '200px' },
    height: { type: String, default: '200px' }
  },
  data() {
    return {
      animation: null
    }
  },
  methods: {
    play() {
      this.animation?.play()
    },
    pause() {
      this.animation?.pause()
    },
    stop() {
      this.animation?.stop()
    },
    setSpeed(speed = 1) {
      this.animation?.setSpeed(speed)
    }
  },
  async mounted() {
    if (!this.$loadScript || this.type !== 'lottie') return
    await this.$loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js',
        true
    )
    if (window.lottie) {
      this.animation = window.lottie.loadAnimation({
        container: this.$refs.lottieContainer,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoplay,
        path: this.src
      })
    }
  },
  beforeDestroy() {
    this.animation?.destroy()
  }
}
</script>
