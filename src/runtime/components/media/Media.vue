<template>
  <div>
    <component
        :is="componentsPrefix + componentName"
        :key="componentKey"
        :content-used-key="contentUsedKey"
        :media-category="mediaCategory"
        :media-uri-prop="mediaUriProp"
        :authors-uri-prop="authorsUriProp"
        :project-id-prop="projectIdProp"
        :auth-token="authToken"
        :sections-user-id-prop="sectionsUserIdProp"
        :media-translation-prefix="mediaTranslationPrefix"
        :show-create-media-button="showCreateMediaButton"
        :media-response-prop="mediaResponseProp"
        :media-by-id-uri-prop="mediaByIdUriProp"
        :media-by-id-response-prop="mediaByIdResponseProp"
        :media-id-prop="mediaId"
        :create-media-path="createMediaPath"
        :edit-media-path="editMediaPath"
        :medias-path="mediasPath"
        :bo-usage="boUsage"
        :access-limited="accessLimited"
        :with-select-media-button="withSelectMediaButton"
        :nuxt-sections="nuxtSections"
        :is-create-media="isCreateMedia"
        :media-id-editing="mediaIdEditing"
        :applied-filters="appliedFilters"
        :folder-type="folderType"
        :response-received="responseReceived"
        :request-pre-sent="requestPreSent"
        :alter-error-received="alterErrorReceived"
        :accepted-file-types="acceptedFileTypes"
        @updateMediaComponent="onMediaComponentUpdate"
        @onMediaSelected="(media) => $emit('getSelectedMedia', media)"
    />
  </div>
</template>

<script setup>
import { useI18n, ref, computed, useRoute, useRouter, onMounted } from '#imports'

const props = defineProps({
  componentsPrefix: {
    type: String,
    default: ''
  },
  mediaUriProp: {
    type: String,
    default: ''
  },
  mediaByIdUriProp: {
    type: String,
    default: ''
  },
  authorsUriProp: {
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
  sectionsUserIdProp: {
    type: String,
    default: ''
  },
  mediaIdProp: {
    type: String,
    default: ''
  },
  mediaTranslationPrefix: {
    type: String,
    default: 'mediaT.'
  },
  createMediaPath: {
    type: String,
    default: ''
  },
  editMediaPath: {
    type: String,
    default: ''
  },
  mediasPath: {
    type: String,
    default: ''
  },
  mediaCategory: {
    type: String,
    default: ''
  },
  showCreateMediaButton: {
    type: Boolean,
    default: false
  },
  accessLimited: {
    type: Boolean,
    default: false
  },
  mediaResponseProp: {
    type: Object,
    default: () => ({})
  },
  mediaByIdResponseProp: {
    type: Object,
    default: () => ({})
  },
  boUsage: {
    type: Boolean,
    default: true
  },
  withSelectMediaButton: {
    type: Boolean,
    default: false
  },
  selectedMedia: {
    type: Object,
    default: () => ({})
  },
  nuxtSections: {
    type: Boolean,
    default: false
  },
  mediaIdEditing: {
    type: String,
    default: ''
  },
  contentUsedKey: {
    type: String,
    default: ''
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
  acceptedFileTypes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['mediaComponentUpdated', 'getSelectedMedia'])

// Reactive state
const componentKey = ref(0)
const componentName = ref('MediaListMedias')
const mediaId = ref('')
const isCreateMedia = ref(false)
const appliedFilters = ref('')
const folderType = ref('')

// Computed
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const pathMatch = Array.isArray(route.params.pathMatch)
    ? route.params.pathMatch.join('/')
    : route.params.pathMatch || []

const isMediasPath = computed(() => {
  return Array.isArray(pathMatch) ? pathMatch.includes('medias') : false
})

const isEditMediaPath = computed(() => {
  return Array.isArray(pathMatch) ? pathMatch.includes('EditMedia') : false
})

const isCreateMediaPath = computed(() => {
  return Array.isArray(pathMatch) ? pathMatch.includes('CreateMedia') : false
})

// Lifecycle
onMounted(() => {
  if (isMediasPath.value) {
    componentName.value = 'MediaListMedias'
  } else if (isEditMediaPath.value) {
    mediaId.value = route.query.id
    componentName.value = 'MediaEditMedia'
  } else if (isCreateMediaPath.value) {
    componentName.value = 'MediaCreateMedia'
  }

  if (props.nuxtSections && props.mediaIdEditing && props.mediaIdEditing !== '') {
    componentName.value = 'MediaEditMedia'
    mediaId.value = props.mediaIdEditing
  }
})

// Methods
const onMediaComponentUpdate = (component) => {
  emit('mediaComponentUpdated', component)
  if (componentName.value !== component.name) {
    componentKey.value++
    componentName.value = component.name
  }
  mediaId.value = component.mediaId ? component.mediaId.toString() : component.mediaId
  isCreateMedia.value = component.isCreateMedia
  appliedFilters.value = component.appliedFilters
  folderType.value = component.folderType
}
</script>

<style scoped>
/* Keep as-is */
</style>