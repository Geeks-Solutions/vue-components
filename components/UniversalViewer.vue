<template>
  <LottieAnimation
      v-if="computedType === 'lottie'"
      ref="lottieRef"
      v-bind="$attrs"
  />
  <img
      v-else
      v-bind="$attrs"
  />
</template>

<script>
import LottieAnimation from './LottieAnimation.client.vue' // adjust path

export default {
  components: { LottieAnimation },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      required: true // "image" | "lottie"
    }
  },
  computed: {
    computedType() {
      return this.type
    }
  }
}
</script>
