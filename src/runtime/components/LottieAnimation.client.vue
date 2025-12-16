<template>
  <div ref="lottieContainer" :style="{ width, height }" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from '#imports'

const props = defineProps({
  src: { type: String, required: true }, // JSON path (public folder or remote URL)
  type: { type: String, default: 'lottie' },
  loop: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  width: { type: String, default: '200px' },
  height: { type: String, default: '200px' },
})

const lottieContainer = ref(null)
const animation = ref(null)

/** Public methods for parent components */
function play() {
  animation.value?.play()
}

function pause() {
  animation.value?.pause()
}

function stop() {
  animation.value?.stop()
}

function setSpeed(speed = 1) {
  animation.value?.setSpeed(speed)
}

// Expose methods to parent via ref
defineExpose({ play, pause, stop, setSpeed })

const loadScript = inject('loadScript')
const initAnimation = () => {
  if (!window.lottie || !lottieContainer.value) return

  // Cleanup previous animation
  if (animation.value) {
    animation.value.destroy()
    animation.value = null
  }

  const options = {
    container: lottieContainer.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
  }

  try {
    // 1. Data URI detection (Strict)
    const dataUriMatch = props.src.match(/^data:.*?;base64,(.*)$/)
    if (dataUriMatch) {
      const base64Content = dataUriMatch[1]
      try {
        const binaryString = atob(base64Content)
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))
        options.animationData = JSON.parse(new TextDecoder().decode(bytes))
      } catch (parseError) {
        console.error('LottieAnimation: Failed to decode/parse Data URI lottie.', parseError)
        return // Do NOT fallback to path for Data URIs to avoid XHR errors
      }
    }
    // 2. Raw Base64 Heuristic (Check for explicit non-path chars, or large length)
    // If it's very long, assume it's data. If it looks like a path, use path.
    else if (
      props.src.length > 512 ||
      (!props.src.startsWith('http') && !props.src.startsWith('/') && !props.src.startsWith('.'))
    ) {
      try {
        const binaryString = atob(props.src)
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))
        options.animationData = JSON.parse(new TextDecoder().decode(bytes))
      } catch (e) {
        // If parsing as base64 fails, and it was short, it might be a weird path.
        // If it was huge, it was probably broken base64.
        if (props.src.length < 512) {
          options.path = props.src
        } else {
          console.warn(
            'LottieAnimation: Source looked like base64 (length/format) but failed to parse. Ignoring.',
            e
          )
          // Do not fallback to path for huge strings
          return
        }
      }
    } else {
      // 3. Standard Path/URL
      options.path = props.src
    }

    animation.value = window.lottie.loadAnimation(options)
  } catch (err) {
    console.error('LottieAnimation: Unexpected error initializing animation.', err)
  }
}

onMounted(async () => {
  if (!loadScript || props.type !== 'lottie') return
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js', true)
  if (window.lottie) {
    initAnimation()
  }
})

// Reactivity support
watch(
  () => props.src,
  () => {
    if (window.lottie) initAnimation()
  }
)

onBeforeUnmount(() => {
  animation.value?.destroy()
})
</script>
