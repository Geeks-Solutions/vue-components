<template>
  <LazyGLottieAnimation
      v-if="computedType === 'lottie'"
      ref="lottieRef"
      v-bind="$attrs"
      :src="computedSrc"
  />
  <NuxtImg
      v-else
      v-bind="$attrs"
      :src="computedSrc"
  />
</template>

<script setup>
import { computed, ref, watch, inject, useAttrs } from "#imports"

const props = defineProps({
  type: {
    type: String,
    required: true, // "image" | "lottie"
  },
  src: {
    type: String,
    default: ''
  },
  transformer: {
    type: Function,
    required: false
  }
})

const attrs = useAttrs()
const injectedTransformer = inject(Symbol.for('mediaURLTransformer'), null)
const transformedSrc = ref(null)

const computedType = computed(() => {
  return props.type
})

const computedSrc = computed(() => {
  return transformedSrc.value || props.src || attrs.src
})

const resolveSrc = async () => {
  const src = props.src || attrs.src
  if (!src) return

  const transformer = props.transformer || injectedTransformer
  
  if (transformer && typeof transformer === 'function') {
    try {
      transformedSrc.value = await transformer(src)
    } catch (e) {
      console.error('Error transforming media URL:', e)
      transformedSrc.value = src
    }
  } else {
    transformedSrc.value = src
  }
}

watch(
  () => [props.src, attrs.src],
  () => {
    resolveSrc()
  },
  { immediate: true }
)

</script>
