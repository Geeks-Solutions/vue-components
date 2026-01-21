<template>
  <div ref="lottieContainer" :style="{ width, height }" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from '#imports'

const props = defineProps({
  src: { type: String, required: true },
  type: { type: String, default: 'lottie' },
  loop: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  width: { type: String, default: '200px' },
  height: { type: String, default: '200px' },
})

const lottieContainer = ref(null)
const animation = ref(null)

const loadScript = inject('loadScript')

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

defineExpose({ play, pause, stop, setSpeed })

const initLottieAnimation = () => {
  if (!window.lottie || !lottieContainer.value) return

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
    const dataUriMatch = props.src.match(/^data:.*?;base64,(.*)$/)
    if (dataUriMatch) {
      const base64Content = dataUriMatch[1]
      try {
        const binaryString = atob(base64Content)
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))
        options.animationData = JSON.parse(new TextDecoder().decode(bytes))
      } catch (parseError) {
        console.error('LottieAnimation: Failed to decode/parse Data URI lottie.', parseError)
        return
      }
    } else if (
      props.src.length > 512 ||
      (!props.src.startsWith('http') && !props.src.startsWith('/') && !props.src.startsWith('.'))
    ) {
      try {
        const binaryString = atob(props.src)
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))
        options.animationData = JSON.parse(new TextDecoder().decode(bytes))
      } catch (e) {
        if (props.src.length < 512) {
          options.path = props.src
        } else {
          console.warn(
            'LottieAnimation: Source looked like base64 (length/format) but failed to parse. Ignoring.',
            e
          )
          return
        }
      }
    } else {
      options.path = props.src
    }

    animation.value = window.lottie.loadAnimation(options)
  } catch (err) {
    console.error('LottieAnimation: Unexpected error initializing animation.', err)
  }
}

const initDotLottieAnimation = () => {
  if (!window.DotLottiePlayer || !lottieContainer.value) return

  lottieContainer.value.innerHTML = ''

  const player = new window.DotLottiePlayer()
  player.load(props.src)
  player.loop = props.loop
  player.autoplay = props.autoplay
  lottieContainer.value.appendChild(player)

  animation.value = player
}

onMounted(async () => {
  if (!loadScript) return

  if (props.type === 'dotlottie') {
    await loadScript(
      'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-player@4.0.1/dist/dotlottie-player.js',
      true
    )
    if (window.DotLottiePlayer) {
      initDotLottieAnimation()
    }
  } else {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js', true)
    if (window.lottie) {
      initLottieAnimation()
    }
  }
})

watch(
  () => props.src,
  () => {
    if (props.type === 'dotlottie') {
      if (window.DotLottiePlayer) initDotLottieAnimation()
    } else {
      if (window.lottie) initLottieAnimation()
    }
  }
)

onBeforeUnmount(() => {
  if (animation.value) {
    if (props.type === 'dotlottie') {
      if (animation.value.destroy) animation.value.destroy()
    } else {
      animation.value.destroy()
    }
  }
})
</script>
