<template>
  <component :is="componentsPrefix + componentName" :content-used-key="contentUsedKey" :media-category="mediaCategory" :media-uri-prop="mediaUriProp" :authors-uri-prop="authorsUriProp" :project-id-prop="projectIdProp" :auth-token="authToken" :sections-user-id-prop="sectionsUserIdProp" :media-translation-prefix="mediaTranslationPrefix" :show-create-media-button="showCreateMediaButton" :media-response-prop="mediaResponseProp" :media-by-id-uri-prop="mediaByIdUriProp" :media-by-id-response-prop="mediaByIdResponseProp" :media-id-prop="mediaId" :create-media-path="createMediaPath" :edit-media-path="editMediaPath" :medias-path="mediasPath" :bo-usage="boUsage" :access-limited="accessLimited" @updateMediaComponent="onMediaComponentUpdate" :with-select-media-button="withSelectMediaButton" :nuxt-sections="nuxtSections" :is-create-media="isCreateMedia" :media-id-editing="mediaIdEditing" :applied-filters="appliedFilters" :folder-type="folderType" @onMediaSelected="(media) => $emit('getSelectedMedia', media)"  />
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Define props
const props = defineProps({
  componentsPrefix: {
    type: String,
    default: ""
  },
  mediaUriProp: {
    type: String,
    default: ""
  },
  mediaByIdUriProp: {
    type: String,
    default: ""
  },
  authorsUriProp: {
    type: String,
    default: ""
  },
  projectIdProp: {
    type: String,
    default: ""
  },
  authToken: {
    type: String,
    default: ""
  },
  sectionsUserIdProp: {
    type: String,
    default: ""
  },
  mediaIdProp: {
    type: String,
    default: ""
  },
  mediaTranslationPrefix: {
    type: String,
    default: "mediaT."
  },
  createMediaPath: {
    type: String,
    default: ""
  },
  editMediaPath: {
    type: String,
    default: ""
  },
  mediasPath: {
    type: String,
    default: ""
  },
  mediaCategory: {
    type: String,
    default: ""
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
    default: ""
  },
  contentUsedKey: {
    type: String,
    default: ""
  }
})

// Define emits
const emit = defineEmits(['mediaComponentUpdated', 'getSelectedMedia'])

// Reactive state
const componentName = ref('MediaListMedias')
const mediaId = ref('')
const isCreateMedia = ref(false)
const appliedFilters = ref('')
const folderType = ref('')

// Get route
const route = useRoute()

// Computed properties
const isMediasPath = computed(() => {
  if (route.params && route.params.pathMatch) {
    return route.params.pathMatch.includes('medias')
  } else return false
})

const isEditMediaPath = computed(() => {
  if (route.params && route.params.pathMatch) {
    return route.params.pathMatch.includes('EditMedia')
  } else return false
})

const isCreateMediaPath = computed(() => {
  if (route.params && route.params.pathMatch) {
    return route.params.pathMatch.includes('CreateMedia')
  } else return false
})

// Initialize component
onMounted(() => {
  if (isMediasPath.value) {
    componentName.value = 'MediaListMedias'
  } else if (isEditMediaPath.value) {
    mediaId.value = route.query.id
    componentName.value = 'MediaEditMedia'
  } else if (isCreateMediaPath.value) {
    componentName.value = 'MediaCreateMedia'
  }
  
  if (props.nuxtSections) {
    if (props.mediaIdEditing && props.mediaIdEditing !== '') {
      componentName.value = 'MediaEditMedia'
      mediaId.value = props.mediaIdEditing
    }
  }
})

// Methods
const onMediaComponentUpdate = (component) => {
  emit('mediaComponentUpdated', component)
  componentName.value = component.name
  mediaId.value = component.mediaId ? component.mediaId.toString() : component.mediaId
  isCreateMedia.value = component.isCreateMedia
  appliedFilters.value = component.appliedFilters
  folderType.value = component.folderType
}
</script>

<style scoped>

</style>
