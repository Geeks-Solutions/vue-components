<template>
  <div v-show="props.loading || nuxtLoading">
    <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-Dark bg-opacity-50 flex flex-col items-center justify-center">
      <img :src="props.animatedLoadingIcon" width="80" alt="" class="opacity-100">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  animatedLoadingIcon: {
    type: String,
    // Note: Il est préférable d'importer l'image ou d'utiliser un chemin absolu/alias
    // si ce composant est utilisé dans différents contextes.
    // Pour l'instant, je garde le chemin relatif par défaut.
    default: "../../assets/images/loading_animated.svg"
  },
});

const nuxtLoading = ref(false);

const start = () => {
  nuxtLoading.value = true;
};

const finish = () => {
  nuxtLoading.value = false;
};

// Exposer les méthodes pour une utilisation programmatique potentielle (similaire à l'ancien comportement)
defineExpose({
  start,
  finish
});
</script>

<style scoped>

</style>
