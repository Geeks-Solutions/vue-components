<template>
  <div class="flex flex-col h-full justify-start">
    <div
      class="cursor-pointer text-4xl text-Blue"
      :class="nuxtSections ? 'fixed top-3 left-12' : 'pl-8'"
      @click="backClicked"
    >
      {{ backLabel }}
    </div>

    <div v-if="privateStatus === 'public' && lockedStatus === 'unlocked'"></div>

    <div
      v-else-if="(privateStatus === 'private' || lockedStatus === 'locked') && media.author !== sectionsUserId"
      class="flex justify-center items-start bg-purpleInfo py-2 my-4 mx-4"
    >
      <span class="icon-iconInfo2 pt-1 pr-2"></span>
      <div class="flex flex-col text-white font-light">
        <div class="flex gap-1">
          <span>{{ $t(mediaTranslationPrefix + 'noPermission') }}</span>
          <span class="font-bold">{{ allowedPermission }}</span>
        </div>
        <div class="flex gap-1">
          <span>{{ $t(mediaTranslationPrefix + 'becauseMedia') }}</span>
          <span class="font-bold">{{ statusAvailable }}</span>
          <span>{{ $t(mediaTranslationPrefix + 'byCreator') }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row mt-4 w-full gap-4 md:gap-0" :class="nuxtSections ? '' : 'md:pl-6'">
      <div class="flex flex-col md:w-[300px] py-8 px-6 shadow rounded-xl">
        <label class="text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.mediaTitle') }}</label>
        <div v-if="!(lockedStatus === 'locked' && media.author !== sectionsUserId)">
          <input
            v-model="media.title"
            class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16"
          />
        </div>
        <div v-else>{{ media.title }}</div>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.tag') }}</label>
        <div v-if="!(lockedStatus === 'locked' && media.author !== sectionsUserId)">
          <input
            v-model="media.seo_tag"
            class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16"
          />
        </div>
        <div v-else>{{ media.seo_tag }}</div>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.type') }}</label>
        <div class="mt-3 flex">
          <div class="w-[7px] [h-6px] bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">{{ $t(mediaTranslationPrefix + 'EditMedia.privateDesc') }}</div>
        </div>
        <div class="mt-3 flex">
          <div class="w-[7px] [h-6px] bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">{{ $t(mediaTranslationPrefix + 'EditMedia.publicDesc') }}</div>
        </div>

        <select
          v-model="media.private_status"
          :disabled="nuxtSections ? isCreateMedia !== true : useRoute().query.isCreate !== 'true'"
          class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16"
        >
          <option value="none" disabled selected>{{ $t(mediaTranslationPrefix + 'EditMedia.selectOption') }}</option>
          <option value="public">{{ $t(mediaTranslationPrefix + 'EditMedia.public') }}</option>
          <option value="private">{{ $t(mediaTranslationPrefix + 'EditMedia.private') }}</option>
        </select>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.state') }}</label>
        <div class="mt-3 flex">
          <div class="w-[7px] [h-6px] bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">{{ $t(mediaTranslationPrefix + 'EditMedia.lockedDesc') }}</div>
        </div>
        <div class="mt-3 flex">
          <div class="w-[7px] [h-6px] bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">{{ $t(mediaTranslationPrefix + 'EditMedia.unlockedDesc') }}</div>
        </div>

        <div
          class="mt-4 flex items-center justify-center cursor-pointer"
          :class="
            media.locked_status === 'locked'
              ? 'w-[48px] h-[48px] rounded-full bg-mediaLocked'
              : 'w-[48px] h-[48px] rounded-full bg-mediaUnLocked'
          "
          @click="toggleLockStatus"
        >
          <span v-if="media.locked_status === 'locked'" class="icon-locked text-xl"></span>
          <span v-else class="icon-unlocked text-xl"></span>
        </div>
      </div>

      <div class="w-full pl-2 pr-4 md:pr-0 md:mx-4">
        <LazyGHeaderContainer :items="headerItems" @item-clicked="itemClicked" />

        <div v-show="showPopupCode" class="fixed z-20 overflow-hidden bg-FieldGray bg-opacity-25 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="false">&#8203;</span>
            <div
              class="inline-block shadow-lg shadow ring-black ring-opacity-5 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-max"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div class="flex justify-between pt-1">
                      <div></div>
                      <div class="sticky">
                        <span class="icon-cross cursor-pointer" @click="showPopupCode = false"></span>
                      </div>
                    </div>
                    <div v-if="popupContent && popupContent.content" class="mt-2" style="overflow: auto !important; max-height: 450px">
                      <div v-for="content in popupContent.content" :key="content.id" class="flex flex-row items-center p-1">
                        <div class="w-[2.5] h-[2.5] mr-3 rounded-full bg-darkBlue"></div>
                        <div class="content-used font-medium text-lg pr-3">
                          {{
                            `${contentUsedKey ? content[contentUsedKey] : content.name} (${content.id}) ${$t(
                              mediaTranslationPrefix + 'by'
                            )}${popupContent.author}`
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="media.files" class="w-max">
          <div class="flex pt-10 pl-2 justify-between">
            <div class="text-grayText text-lg pt-0.5">
              {{ $t(mediaTranslationPrefix + `EditMedia.${media.files[0].platform.name}`) }}
            </div>
          </div>
          <div class="text-xs text-mediaTextGray flex pl-2 pt-2">
            <div class="font-light">{{ $t(mediaTranslationPrefix + 'EditMedia.sizeRec') }}</div>
            <div class="pl-1 font-bold">
              {{ $t(mediaTranslationPrefix + `EditMedia.${media.files[0].platform.name}`) }}
            </div>
            <div class="font-light">
              {{ `: W ${media.files[0].platform.width}px H ${media.files[0].platform.height}px)` }}
            </div>
          </div>
        </div>

        <div
          v-if="media.files && media.type === 'video'"
          class="text-xs text-SmallTextGray font-light pl-2 pt-5 flex flex-col md:flex-row"
        >
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.fileName')}  ${handleFileName(media.files[0].filename)}` }}</div>
          <div class="px-6 text-Dark">|</div>
          <div>
            {{
              `${$t(mediaTranslationPrefix + 'EditMedia.fileSize')}  ${
                media.files[0].size > Math.pow(10, 6)
                  ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB`
                  : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`
              }`
            }}
          </div>
          <div class="px-6 text-Dark">|</div>
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.duration')}  ${media.files[0].size}min` }}</div>
        </div>

        <div v-else-if="media.files" class="text-xs text-SmallTextGray font-light pl-2 pt-5 flex flex-col md:flex-row">
          <div class="flex gap-2">
            <div>{{ $t(mediaTranslationPrefix + 'EditMedia.fileName') }}</div>
            <div class="w-min">{{ handleFileName(media.files[0].filename) }}</div>
          </div>
          <div class="px-6 text-Dark">|</div>
          <div>
            {{ $t(mediaTranslationPrefix + 'EditMedia.fileSize') }}
            {{
              media.files[0].size > Math.pow(10, 6)
                ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB`
                : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`
            }}
          </div>
        </div>

        <div v-if="privateStatus !== 'private' || (privateStatus === 'private' && media.author === sectionsUserId)">
          <div
            class="my-8 p-2 px-2 cursor-pointer flex rounded-md shadow text-sm text-SmallTextGray font-light w-max"
            @click="downloadMedia"
          >
            <img src="../../assets/images/downloadMedia.svg" alt="" class="pr-2" />
            <div>{{ $t(mediaTranslationPrefix + 'EditMedia.downloadMedia') }}</div>
          </div>

          <div v-if="media.type === 'document' && media.metadata?.type !== 'lottie'">
            <div class="flex w-[350px] h-[200px] justify-center items-center object-cover relative" :style="hiddenContainerStyle">
              <div class="flex flex-col items-center gap-4">
                <span class="icon-mediaDocument text-6xl"></span>
              </div>
              <div class="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3" @click="imagePick.click()">
                <span class="icon-reload text-8xl cursor-pointer"></span>
                <input ref="imagePick" type="file" class="hidden" :accept="acceptedFileTypes" @change="onFileSelected" />
              </div>
            </div>
          </div>

          <div v-else-if="!(lockedStatus === 'locked' && media.author !== sectionsUserId)">
            <div v-if="media.files && media.files[0].url !== ''" class="relative w-max">
              <LazyGUniversalViewer :src="media.files[0].url" :type="media.metadata?.type || 'image'" alt="" class="rounded-md md:w-[400px] w-[300px]" />
              <div class="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3" @click="imagePick.click()">
                <span class="icon-reload text-8xl cursor-pointer"></span>
                <input ref="imagePick" type="file" class="hidden" :accept="acceptedFileTypes" @change="onFileSelected" />
              </div>
            </div>
          </div>

          <div v-else-if="media.files">
            <div v-if="media.files[0].url !== ''" class="relative w-max">
              <LazyGUniversalViewer :src="mediaPreview || media.files[0].url" :type="media.metadata?.type || 'image'" alt="" class="rounded-md w-[400px]" />
            </div>
          </div>
        </div>

        <div v-else class="w-[400px] cursor-pointer rounded-xl mt-8" style="background: #EDEDED">
          <div class="flex w-full h-[200px] justify-center items-center object-cover">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-alert text-4xl"></span>
              <div class="text-center font-light">{{ $t(mediaTranslationPrefix + 'previewNotAvailable') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="
        !((privateStatus === 'private' || privateStatus === 'public') &&
        lockedStatus === 'locked' &&
        media.author !== sectionsUserId)
      "
      class="sticky bottom-0 py-2 m-4 rounded-md shadow bg-white"
    >
      <div class="flex w-full items-center justify-end btns-row">
        <div
          v-if="privateStatus !== 'private' || (privateStatus === 'private' && media.author === sectionsUserId)"
          class="cursor-pointer flex items-center"
          @click="showPopup = true"
        >
          <div class="text-error text-sm md:text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.deleteMedia') }}</div>
          <span class="icon-trashCan2 text-md pb-1 px-2"></span>
        </div>

        <div @click.stop.prevent="updateMediaByID">
          <LazyGButtons
            :button-text="$t(mediaTranslationPrefix + 'save')"
            :button-style="saveButtonStyle"
            :with-icon="false"
          />
        </div>

        <div
          @click.stop.prevent="
            privateStatus === 'private' && media.author !== sectionsUserId ? null : $emit('onMediaSelected', media)
          "
        >
          <LazyGButtons
            v-if="withSelectMediaButton"
            :active="!(privateStatus === 'private' && media.author !== sectionsUserId)"
            :button-text="$t(mediaTranslationPrefix + 'selectMedia')"
            :button-style="selectMediaButtonStyle"
            :with-icon="false"
          />
        </div>
      </div>
    </div>

    <LazyGAlertPopup
      :errors-container-style="'mt-10 mb-14 self-center h-auto max-h-72 overflow-y-auto'"
      :apply-button-text="$t(mediaTranslationPrefix + 'EditMedia.deleteMedia')"
      :cancel-button-text="$t(mediaTranslationPrefix + 'EditMedia.cancel')"
      :title-delete="$t(mediaTranslationPrefix + 'EditMedia.deleteMediaMsg')"
      :title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDelete')"
      :sub-title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDeleteExtra')"
      :show-popup-code="showPopup"
      :can-be-deleted="noDeleteErrors.length === 0"
      :errors="noDeleteErrors"
      @cancel="showPopup = false"
      @apply="deleteMediaByID"
    />

    <LazyGAnimatedLoading :loading="loading" />
  </div>
</template>

<script setup>
import {
  useFetch,
  useI18n,
  ref,
  computed,
  useRoute,
  navigateTo,
  useLocalePath,
  onMounted,
  watch, useNuxtApp,
} from '#imports'

import {isLottieAnimation, mediaHeader, showToast} from './medias.js'
import {isFileTypeSupported} from "../../utils/constants.js";

const { t } = useI18n()
const nuxtApp = useNuxtApp()

const props = defineProps({
  contentUsedKey: {
    type: String,
    default: ''
  },
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
  mediasPath: {
    type: String,
    default: ''
  },
  hiddenContainerStyle: {
    type: String,
    default: "background: #61035B"
  },
  mediaByIdResponseProp: {
    type: Object,
    default: () => ({})
  },
  boUsage: {
    type: Boolean,
    default: true
  },
  isCreateMedia: {
    type: Boolean,
    default: false
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

// Reactive state
const loading = ref(false)
const saveButtonStyle = "py-2.5 px-12 ml-12 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue"
const selectMediaButtonStyle = "py-2.5 px-12 ml-2 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue"

const mediaId = ref('')
const mediaByIdUri = ref('')
const projectId = ref('')
const token = ref('')
const privateStatus = ref('public')
const lockedStatus = ref('unlocked')

const headerItems = ref([
  { label: '', value: '', headerStyle: 'text-sm' },
  { label: '', value: '', headerStyle: 'text-sm' },
  { label: '', value: '', headerStyle: 'text-sm' },
  { label: '', value: '', headerStyle: 'text-sm' },
  { label: '', value: '', headerStyle: 'text-sm text-Blue underline cursor-pointer', clickable: true }
])

headerItems.value[0].label = t(props.mediaTranslationPrefix + 'headerItems.id')
headerItems.value[1].label = t(props.mediaTranslationPrefix + 'headerItems.creationDate')
headerItems.value[2].label = t(props.mediaTranslationPrefix + 'headerItems.createdBy')
headerItems.value[3].label = t(props.mediaTranslationPrefix + 'headerItems.mediaType')
headerItems.value[4].label = t(props.mediaTranslationPrefix + 'headerItems.contents')

const imagePick = ref(null)

const media = ref({
  type: '',
  title: '',
  tags: '',
  seo_tag: '',
  private_status: 'public',
  number_of_contents: 0,
  namespace: '',
  locked_status: 'unlocked',
  id: '',
  files: [
    {
      url: '',
      type: '',
      thumbnail_url: '',
      size: 0,
      platform_id: '',
      platform: {
        width: 0,
        updated_at: 0,
        number_of_medias: 0,
        namespace: '',
        name: '',
        inserted_at: 0,
        id: '',
        height: 0,
        description: ''
      },
      metadata: {
        width: 0,
        height: 0
      },
      filename: '',
      file_id: ''
    }
  ],
  meta: {
    author: '',
    content: []
  },
  metadata: {
    type: ''
  }
})

const mediaPreview = ref('')
const sectionsUserId = ref('')
const showPopup = ref(false)
const file = ref(null)
const showPopupCode = ref(false)
const popupContent = ref('')
const backLabel = '<'
const isEditingMedia = ref(false)

// Computed
const allowedPermission = computed(() => {
  if (lockedStatus.value === 'locked' && privateStatus.value === 'private') {
    return t(props.mediaTranslationPrefix + 'previewOrEditMediaLabel')
  } else if (privateStatus.value === 'private') {
    return t(props.mediaTranslationPrefix + 'previewMediaLabel')
  } else if (lockedStatus.value === 'locked') {
    return t(props.mediaTranslationPrefix + 'editMediaLabel')
  }
})

const statusAvailable = computed(() => {
  if (lockedStatus.value === 'locked' && privateStatus.value === 'private') {
    return t(props.mediaTranslationPrefix + 'privateAndLocked')
  } else if (privateStatus.value === 'private') {
    return t(props.mediaTranslationPrefix + 'private')
  } else if (lockedStatus.value === 'locked') {
    return t(props.mediaTranslationPrefix + 'locked')
  }
})

const noDeleteErrors = computed(() => {
  const errorsArray = []
  if (media.value.meta && media.value.meta.content && media.value.meta.content.length > 0) {
    media.value.meta.content.forEach(m => {
      errorsArray.push({
        authorName: t(props.mediaTranslationPrefix + 'by') + media.value.meta.author,
        errorTitle: props.contentUsedKey ? `${m[props.contentUsedKey]} (${m.id})` : `${m.name} (${m.id})`
      })
    })
  }
  return errorsArray
})

// Watchers
watch(
  () => props.mediaIdProp,
  (val) => {
    mediaId.value = val
  },
  { immediate: true }
)

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

watch(
  () => props.sectionsUserIdProp,
  (val) => {
    sectionsUserId.value = val
  },
  { immediate: true }
)

watch(
  () => props.mediaByIdResponseProp,
  (res) => {
    if (res) {
      media.value = res
      if (media.value.title === 'null') media.value.title = ''
      if (media.value.seo_tag === 'null') media.value.seo_tag = ''
      privateStatus.value = media.value.private_status
      lockedStatus.value = media.value.locked_status
      popupContent.value = media.value.meta
    }
  },
  { deep: true, immediate: true }
)

watch(
    media,
    () => {
      if(Object.keys(media.value).length > 0) {
        headerItems.value[0].value = media.value.id
        headerItems.value[1].value = media.value.creation_date ? new Date(media.value.creation_date * 1000).toLocaleDateString() : new Date(media.value.inserted_at).toLocaleDateString()
        headerItems.value[2].value = media.value.meta.author
        headerItems.value[3].value = media.value.type[0].toUpperCase() + media.value.type.substring(1)
        headerItems.value[4].value = media.value.number_of_contents
      }
    },
    { deep: true }
)

// Lifecycle
onMounted(() => {
  if (mediaByIdUri.value !== '') getMediaByID()
})

// Methods
async function getMediaByID() {
  try {
    loading.value = true
    let response
    const payload = {
      method: 'GET',
      headers: mediaHeader({ token: token.value }, projectId.value)
    }
    if (props.forwardRequest) {
      response = await props.forwardRequest(mediaByIdUri.value + mediaId.value, payload)
    } else {
      response = await useFetch(mediaByIdUri.value + mediaId.value, payload)
    }

    if (response.error && response.error.value) throw response.error.value

    let responseReceivedData
    try {
      responseReceivedData = await props.responseReceived('GET', mediaByIdUri.value + mediaId.value, {}, response.data.value)
    } catch {}
    if (responseReceivedData) {
      response.data.value = responseReceivedData
    }

    media.value = response.data.value
    if (media.value.title === 'null') media.value.title = ''
    if (media.value.seo_tag === 'null') media.value.seo_tag = ''
    privateStatus.value = media.value.private_status
    lockedStatus.value = media.value.locked_status
    popupContent.value = media.value.meta

    if (props.nuxtSections && props.mediaIdEditing && props.mediaIdEditing !== '' && props.mediaIdEditing === media.value.id) {
      isEditingMedia.value = true
    }

    if (privateStatus.value === 'private' && media.value.author === props.sectionsUserIdProp) {
      getMediaImage(media.value.files[0].url)
    }
  } catch (e) {
    loading.value = false
    if (props.nuxtSections) {
      showToast('Error', 'error', e.data?.message || e.message)
    }
    backClicked()
  } finally {
    loading.value = false
  }
}

async function updateMediaByID() {
  if (mediaByIdUri.value === '') return
  try {
    loading.value = true
    const data = new FormData()

    if (file.value) {
      data.append('files[1][platform_id]', '1')
      data.append('files[1][file]', file.value)
      data.append('type', file.value.type.includes('image') ? 'image' : 'document')
    }

    if (media.value.title) data.append('title', media.value.title)
    if (media.value.seo_tag) data.append('seo_tag', media.value.seo_tag)
    data.append('private_status', media.value.private_status)
    data.append('locked_status', media.value.locked_status)

    function readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    }

    try {
      const fileText = await readFileAsText(file.value)
      const isLottie = isLottieAnimation(JSON.parse(fileText))
      if (isLottie) {
        data.append('metadata[type]', 'lottie')
      }
    } catch {}

    try {
      const res = await props.requestPreSent('PUT', mediaByIdUri.value + mediaId.value, data)
      if (res && res.proceed === false) {
        loading.value = false
        return
      }
    } catch {}

    let response
    const payload = {
      method: 'PUT',
      headers: mediaHeader({ token: token.value }, projectId.value),
      body: data
    }
    if (props.forwardRequest) {
      response = await props.forwardRequest(mediaByIdUri.value + mediaId.value, payload)
    } else {
      response = await useFetch(mediaByIdUri.value + mediaId.value, payload)
    }

    let responseReceivedData
    try {
      responseReceivedData = await props.responseReceived('PUT', mediaByIdUri.value + mediaId.value, data, response?.data)
    } catch {}

    if (response.error && response.error.value) throw response.error.value

    if (props.nuxtSections) {
      if (!responseReceivedData) {
        await getMediaByID()
      }
      if (isEditingMedia.value) emit('onMediaSelected', media.value)
      showToast('', 'success', t(props.mediaTranslationPrefix + 'mediaUpdated'))
    }
  } catch (e) {
    let errorMessage = ''

    let updatedError
    try {
      updatedError = props.alterErrorReceived(e)
    } catch {}

    if (updatedError) {
      errorMessage = updatedError
    } else if ((e && e.request && e.response === undefined) || (e && e.message && e.message.includes('<no response>'))) {
      errorMessage = t('mediaTooLarge')
    } else if (e.data?.options) {
      errorMessage = `${e.data.error}, ${e.data.message}`
    } else if (e.data?.errors) {
      errorMessage = e.data.errors.files[0]
    } else if (e.data?.message) {
      errorMessage = e.data?.message
    } else {
      errorMessage = e.message
    }

    if (props.nuxtSections) {
      showToast('Error', 'error', errorMessage, e.data?.options)
    }
  } finally {
    loading.value = false
  }
}

async function deleteMediaByID() {
  if (mediaByIdUri.value === '') return
  try {
    loading.value = true
    let response
    const payload = {
      method: 'DELETE',
      headers: mediaHeader({ token: token.value }, projectId.value)
    }
    if (props.forwardRequest) {
      response = await props.forwardRequest(mediaByIdUri.value + mediaId.value, payload)
    } else {
      response = await useFetch(mediaByIdUri.value + mediaId.value, payload)
    }

    try {
      await props.responseReceived('DELETE', mediaByIdUri.value, mediaId.value, response?.data)
    } catch {}

    if (response.error && response.error.value) throw response.error.value

    if (props.nuxtSections) {
      showToast('', 'success', response.data.value.message)
    }

    if (props.mediasPath) {
      navigateTo(useLocalePath({ path: props.mediasPath }))
    } else {
      emit('updateMediaComponent', { name: 'MediaListMedias', appliedFilters: props.appliedFilters, folderType: props.folderType })
    }
  } catch (e) {
    showToast('Error', 'error', e.data?.message || e.message)
  } finally {
    loading.value = false
  }
}

function onFileSelected(e) {

  if (props.acceptedFileTypes && props.acceptedFileTypes !== '' && !isFileTypeSupported(e.target.files[0], props.acceptedFileTypes)) {
    showToast('Error', 'error', t(props.mediaTranslationPrefix + 'unsupportedFileType'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e) media.value.files[0].url = e.target.result
  }

  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0])
    file.value = e.target.files[0]
  }
}

function downloadMedia() {
  const fileLink = document.createElement('a')
  fileLink.href = media.value.files[0].url
  fileLink.target = '_blank'
  fileLink.setAttribute('download', media.value.files[0].filename)
  document.body.appendChild(fileLink)
  fileLink.click()
  fileLink.remove()
  window.URL.revokeObjectURL(media.value.files[0].url)
}

function itemClicked(item) {
  if (item.value !== 0) showPopupCode.value = true
}

function getMediaImage(url) {
  fetch(url, { headers: media.value.files[0].headers, mode: 'cors' }).then(r => r.blob()).then(d => {
    mediaPreview.value = window.URL.createObjectURL(d)
  })
}

function backClicked() {
  isEditingMedia.value = false
  if (props.mediasPath) {
    navigateTo(useLocalePath({ path: props.mediasPath, query: { filters: useRoute().query.filters, folder: useRoute().query.folder } }))
  } else {
    emit('updateMediaComponent', { name: 'MediaListMedias', appliedFilters: props.appliedFilters, folderType: props.folderType })
  }
}

function toggleLockStatus() {
  if (lockedStatus.value === 'locked' && media.value.author !== sectionsUserId.value) return
  media.value.locked_status = media.value.locked_status === 'locked' ? 'unlocked' : 'locked'
}

function handleFileName(fileName) {
  if (fileName.length > 50) {
    const len = fileName.length
    const partLength = Math.ceil(len / 3)
    const part1 = fileName.substring(0, partLength)
    const part2 = fileName.substring(partLength, partLength * 2)
    const part3 = fileName.substring(partLength * 2)
    return [part1, part2, part3].join(' ')
  }
  return fileName
}

const emit = defineEmits(['updateMediaComponent', 'onMediaSelected'])

</script>

<style scoped>
.bg-mediaUnLocked {
  background-color: #ddebff;
}
.bg-mediaLocked {
  background-color: #ffe5dd;
}
@media screen and (max-width: 768px) {
  .btns-row {
    flex-wrap: wrap;
  }
}
</style>