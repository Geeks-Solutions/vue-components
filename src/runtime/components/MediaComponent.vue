<template>
  <div v-if="isOpen" class="section-module-modal-overlay" @click="handleOverlayClick">
    <div class="section-module-modal">
      <div class="section-module-modal-close-icon" @click="isOpen = false">
        <IconsClose />
      </div>
      <div class="section-module-modal-content">
        <div>
          <Media
              :components-prefix="'g'"
              :content-used-key="contentUsedKey"
              :show-create-media-button="true"
              :media-category="mediaCategory"
              :media-translation-prefix="mediaTranslationPrefix"
              :media-uri-prop="mediasUri"
              :authors-uri-prop="authorsUri"
              :project-id-prop="projectId"
              :auth-token="authToken"
              :media-by-id-uri-prop="mediaByIdUri"
              :media-id-prop="selectedMediaId"
              :sections-user-id-prop="sectionsUserId"
              :with-select-media-button="true"
              :nuxt-sections="true"
              :media-id-editing="mediaIdEditing"
              :alter-error-received="alterErrorReceived"
              :response-received="responseReceived"
              :request-pre-sent="requestPreSent"
              :forward-request="forwardRequest"
              :accepted-file-types="acceptedFileTypes"
              @get-selected-media="emitMedia"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from '#imports'

import Media from './media/Media.vue'
import IconsClose from './icons/close.vue'

// Props
const props = defineProps({
  authToken: {
    type: String,
    default: ''
  },
  sectionsUserId: {
    type: String,
    default: ''
  },
  projectId: {
    type: String,
    default: ''
  },
  serverUrl: {
    type: String,
    default: ''
  },
  selectedMediaId: {
    type: String,
    default: ''
  },
  contentUsedKey: {
    type: String,
    default: ''
  },
  mediaTranslationPrefix: {
    type: String,
    default: 'mediaT.'
  },
  alterErrorReceived: {
    type: Function,
    default: () => {}
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

// Emits
const emit = defineEmits(['emittedMedia'])

// Reactive data
const authorsUri = ref('')
const mediasUri = ref('')
const mediaByIdUri = ref('')
const loading = ref(false)
const isOpen = ref(false)
const mediaIdEditing = ref('')
const mediaCategory = ref('')

// Computed properties (if needed in future)
// const someComputed = computed(() => {})

// Watchers or lifecycle hooks can be used via onMounted/onBeforeMount etc.

// Lifecycle: created()
authorsUri.value = `${props.serverUrl}/project/${props.projectId}/users`
mediasUri.value = `${props.serverUrl}/project/${props.projectId}/medias`
mediaByIdUri.value = `${props.serverUrl}/project/${props.projectId}/media/`

// Methods

function emitMedia(media) {
  emit('emittedMedia', media)
}

function openModal(mediaId, category) {
  if (mediaId && mediaId !== '') {
    mediaIdEditing.value = mediaId.toString()
  } else {
    mediaIdEditing.value = null
  }
  mediaCategory.value = category
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}

function handleOverlayClick(event) {
  if (event.target.classList.contains('section-module-modal-overlay')) {
    isOpen.value = false
  }
}

// Expose methods for usage from parent components
defineExpose({
  openModal,
  closeModal
})
</script>

<style>
.text-ellipsis {
  text-overflow: ellipsis !important;
}
.section-module-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.section-module-modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  height: 98%;
  width: 96%;
  max-width: 96%;
  max-height: 98%;
  overflow-y: auto;
  position: relative;
}

.section-module-modal-content {
  margin: 10px;
  text-align: start;
}

.section-module-modal-close-icon {
  position: fixed;
  top: 20px;
  right: 60px;
  height: 20px;
  width: 20px;
  margin: 4px;
  cursor: pointer;
  z-index: 1;
}

.section-module-modal-close-icon svg {
  color: #03b1c7;
}

/* Scrollbar Styles */
.section-module-modal::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
  border-radius: 12px;
}

.section-module-modal::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.section-module-modal::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.section-module-modal::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>