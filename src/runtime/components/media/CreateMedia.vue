<template>
  <div class="mr-8" :class="nuxtSections ? '' : 'ml-4'">
    <div
      class="cursor-pointer text-4xl text-Blue"
      :class="nuxtSections ? 'fixed top-3 left-12' : 'md:pl-8'"
      @click="backClicked"
    >
      {{ backLabel }}
    </div>

    <div class="text-mediaTextGray mt-8" :class="nuxtSections ? '' : 'md:ml-8'">
      {{ $t(mediaTranslationPrefix + 'dragDropMedia') }}
    </div>

    <div
      class="flex justify-center w-full md:w-auto items-center w-2/3 mt-8 md:ml-8"
      :class="nuxtSections ? '' : 'md:ml-8'"
      @drop.prevent="onFileSelected"
      @dragenter.prevent
      @dragover.prevent
    >
      <label
        for="dropzone-file"
        class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-BorderGray border-dashed cursor-pointer bg-mediaUploadGray"
      >
        <div class="flex flex-col justify-center items-center pt-5 pb-6">
          <img src="../../assets/images/upload.svg" alt="" class="pb-4" width="100" />
          <div class="text-grayText">
            {{ $t(mediaTranslationPrefix + 'dragDrop') }}
            <a class="text-Blue underline">{{ $t(mediaTranslationPrefix + 'browse') }}</a>
            {{ $t(mediaTranslationPrefix + 'yourMedia') }}
          </div>
        </div>
        <input
          id="dropzone-file"
          ref="imageUploaded"
          type="file"
          :accept="acceptedFileTypes"
          class="hidden"
          @change="onFileSelected"
        />
      </label>
    </div>

    <LazyGAnimatedLoading :loading="loading" />
  </div>
</template>

<script setup>
import {useI18n, ref, useRoute, navigateTo, useLocalePath, watch, useFetch, useNuxtApp} from '#imports'

import {isLottieAnimation, mediaHeader, showToast} from './medias'
import {isFileTypeSupported} from "../../utils/constants.js";

const { t } = useI18n()

const props = defineProps({
  appliedFilters: {
    type: String,
    default: ''
  },
  folderType: {
    type: String,
    default: ''
  },
  mediaByIdUriProp: {
    type: String,
    default: ''
  },
  projectIdProp: {
    type: String,
    default: ''
  },
  authToken: {
    type: String,
    default: ''
  },
  mediaTranslationPrefix: {
    type: String,
    default: 'mediaT.'
  },
  editMediaPath: {
    type: String,
    default: ''
  },
  mediasPath: {
    type: String,
    default: ''
  },
  boUsage: {
    type: Boolean,
    default: true
  },
  nuxtSections: {
    type: Boolean,
    default: false
  },
  mediaCategory: {
    type: String,
    default: ''
  },
  responseReceived: {
    type: Function,
    default: () => {}
  },
  requestPreSent: {
    type: Function,
    default: () => {}
  },
  forwardRequest: {
    type: Function,
    default: null
  },
  acceptedFileTypes: {
    type: String,
    default: ''
  }
})

const nuxtApp = useNuxtApp()

const emit = defineEmits(['updateMediaComponent'])

// Reactive state
const loading = ref(false)
const mediaByIdUri = ref('')
const projectId = ref('')
const token = ref('')
const backLabel = '<'

// File input reference
const imageUploaded = ref(null)

// Watchers
watch(
  () => props.projectIdProp,
  (val) => {
    projectId.value = val
  },
  { immediate: true }
)

watch(
  () => props.authToken,
  (val) => {
    token.value = val
  },
  { immediate: true }
)

watch(
  () => props.mediaByIdUriProp,
  (val) => {
    mediaByIdUri.value = val
  },
  { immediate: true }
)

// Methods
async function onFileSelected(e) {
  let fileData = imageUploaded.value?.files[0]

  if (e.dataTransfer && e.dataTransfer.files) {
    fileData = e.dataTransfer.files[0]
  }

  if (!fileData) return

  if (props.acceptedFileTypes && props.acceptedFileTypes !== '' && !isFileTypeSupported(fileData, props.acceptedFileTypes)) {
    showToast('Error', 'error', t(props.mediaTranslationPrefix + 'unsupportedFileType'))
    return
  }

  loading.value = true
  const data = new FormData()

  data.append('files[1][platform_id]', '1')
  data.append('files[1][file]', fileData)
  data.append('type', fileData.type.includes('image') ? 'image' : 'document')
  data.append('private_status', 'public')
  data.append('locked_status', 'unlocked')

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  try {
    const fileText = await readFileAsText(fileData)
    const isLottie = isLottieAnimation(JSON.parse(fileText))
    if (isLottie) {
      data.append('metadata[type]', 'lottie')
    }
  } catch {}

  try {
    const res = await props.requestPreSent('POST', mediaByIdUri.value, data)
    if (res && res.proceed === false) {
      loading.value = false
      return
    }
  } catch {}

  try {
    let response
    const payload = {
      method: 'POST',
      headers: mediaHeader({ token: token.value }, projectId.value),
      body: data
    }
    if (props.forwardRequest) {
      response = await props.forwardRequest(mediaByIdUri.value, payload)
    } else {
      response = await useFetch(mediaByIdUri.value, payload)
      console.log('got here 2', response)
    }

    if (response.error && response.error.value) throw response.error.value

    try {
      await props.responseReceived('POST', mediaByIdUri.value, data, response?.data)
    } catch {}

    // Direct handling of successful response
    if (props.nuxtSections) {
      showToast('', 'success', t(props.mediaTranslationPrefix + 'mediaCreated'))
    }

    if (props.editMediaPath) {
      navigateTo(useLocalePath({ path: props.editMediaPath, query: { id: response.data.value.id, isCreate: true } }))
    } else {
      emit('updateMediaComponent', {
        name: 'MediaEditMedia',
        mediaId: response.data.value.id,
        isCreateMedia: true,
        appliedFilters: props.appliedFilters,
        folderType: props.folderType
      })
    }
  } catch (e) {
    let errorMessage = ''
    // Comprehensive error handling
    if ((e && e.request && !e.response) || (e && e.message && e.message.includes('<no response>'))) {
      // Network error or request couldn't be sent
      errorMessage = t('mediaTooLarge')
    } else if (e && e.data) {
      // Server responded with an error
      if (e.data?.options?.link) {
        errorMessage = `${e.data.error}, ${e.data.message}`
      } else if (e.data?.errors?.files) {
        errorMessage = e.data.errors.files[0]
      } else if (e.data?.message) {
        errorMessage = e.data.message
      } else if (e.data?.message) {
        errorMessage = e.data?.message
      } else {
        errorMessage = e.message
      }
    } else {
      // Fallback error message
      errorMessage = e.message || 'An unexpected error occurred'
    }

    if (props.nuxtSections) {
      showToast('Error', 'error', errorMessage, e.data?.options)
    }
  } finally {
    loading.value = false
  }
}

function backClicked() {
  if (props.mediasPath) {
    navigateTo(useLocalePath({ path: props.mediasPath, query: { filters: useRoute().query.filters } }))
  } else {
    emit('updateMediaComponent', {
      name: 'MediaListMedias',
      appliedFilters: props.appliedFilters,
      folderType: props.folderType
    })
  }
}
</script>

<style scoped>
/* Keep as-is */
</style>