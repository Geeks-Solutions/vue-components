<template>
  <div v-show="props.loading || nuxtLoading">
    <div
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-Dark bg-opacity-50 flex flex-col items-center justify-center"
    >
      <img :src="props.animatedLoadingIcon" width="80" alt="" class="opacity-100" >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

// Import the asset directly for better handling in Nuxt 3/Vite
import loadingSvg from '../assets/images/loading_animated.svg'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  animatedLoadingIcon: {
    type: String,
    // Use the imported asset as the default value
    default: loadingSvg,
  },
})

const nuxtLoading = ref(false)

const start = () => {
  nuxtLoading.value = true
}

const finish = () => {
  nuxtLoading.value = false
}

// Exposer les méthodes pour une utilisation programmatique potentielle (similaire à l'ancien comportement)
defineExpose({
  start,
  finish,
})
</script>

<style scoped></style>
