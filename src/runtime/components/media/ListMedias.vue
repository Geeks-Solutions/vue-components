<template>
  <div class="mt-4" :class="nuxtSections ? 'ml-4' : ''">
    <div
      class="flex flex-col md:flex-row items-start md:items-start w-full justify-between md:pr-4 pl-2 md:pl-0"
    >
      <div class="flex" :class="nuxtSections ? '' : 'md:pl-16'">
        <ClientOnly>
          <LazyGMainFilter
            :filters-query="filtersQuery"
            :add-filter-label="$t(mediaTranslationPrefix + 'table.addFilter')"
            :clear-filters-label="$t(mediaTranslationPrefix + 'table.clearFilters')"
            :apply-filter-label="$t(mediaTranslationPrefix + 'table.applyFilters')"
            :filtered-values-style="'color: white; background: #03B1C7; padding: 5px 15px; margin: 15px 5px 0 0; border-radius: 10px; position: relative; display: flex; width: fit-content;'"
            :filter-icon-icomoon="'icon-filterIcon'"
            :filter-icon-style="''"
            :main-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-284px focus:outline-none'"
            :select-style="'h-[35px] w-[220px] ml-8'"
            :filter-select-default="$t(mediaTranslationPrefix + 'selectFilter')"
            :filter-by-text="$t(mediaTranslationPrefix + 'filterMedias')"
            :clear-filters="filterClear"
            :sub-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-244px focus:outline-none'"
            :input-style="'py-4 pl-6 ml-2 pr-3.5 border border-FieldGray rounded-xl h-48px w-220px focus:outline-none'"
            :filter-options="filterOptions"
            :filter_map="filterMap"
            :emit-all="false"
            :alter-value="updateFilterValues"
            :main-filter-options="mainFilterOptions"
            :multi-select-placeholder="multiSelectPlaceholder"
            :single-select-filter-options="singleSelectFilterOptions"
            :multi-select-filter-options="multiSelectFilterOptions"
            @get-filter="getFilter"
            @remove_filter="removeFilter"
            @clear-filters="clearFilters"
            @apply_filter="filterMedias"
          />
        </ClientOnly>
      </div>

      <LazyGButtons
        v-show="showCreateMediaButton === true"
        :button-text="$t(mediaTranslationPrefix + 'createNew')"
        :button-style="createButtonsStyle"
        :with-icon="false"
        :submit-function="openCreateMedia"
      />
    </div>

    <div>
      <div
        class="flex flex-row pt-8 gap-16 overflow-x-scroll"
        :class="nuxtSections ? '' : 'md:pl-16'"
      >
        <div v-show="mediaCategory !== 'document'" class="self-center md:self-start">
          <LazyGMediaFolder
            :is-selected="selectedFolder === 'all'"
            :all="true"
            :medias="allMedias"
            :total-label="$t(mediaTranslationPrefix + 'total')"
            :category-label="$t(mediaTranslationPrefix + 'category')"
            :category-value="$t(mediaTranslationPrefix + 'all')"
            :all-text="$t(mediaTranslationPrefix + 'all')"
            :total-value="allMediasLength.toString()"
            folder-style="font-size: 185px"
            :media-style="'rounded-full ml-2 h-[40px] w-[40px]'"
            :folder-clicked="
              () => {
                selectedFolder = 'all'
                getAllMedias('all')
              }
            "
          />
          <div v-if="selectedFolder === 'all'" class="h-10px bg-Blue flex mt-6"/>
        </div>

        <div v-show="mediaCategory !== 'document'" class="self-center md:self-start">
          <LazyGMediaFolder
            :is-selected="selectedFolder === 'image'"
            :medias="imageMedias"
            :total-label="$t(mediaTranslationPrefix + 'total')"
            :category-label="$t(mediaTranslationPrefix + 'category')"
            :category-value="$t(mediaTranslationPrefix + 'images')"
            :total-value="imageMediasLength.toString()"
            folder-style="font-size: 185px"
            :media-style="'rounded-full ml-2 h-[40px] w-[40px]'"
            :folder-clicked="
              () => {
                selectedFolder = 'image'
                getAllMedias('image')
              }
            "
          />
          <div v-if="selectedFolder === 'image'" class="h-10px bg-Blue flex mt-6"/>
        </div>

        <div
          v-show="videoMedias.length !== 0 && mediaCategory !== 'document'"
          class="self-center md:self-start"
        >
          <LazyGMediaFolder
            :is-selected="selectedFolder === 'video'"
            :medias="videoMedias"
            :total-label="$t(mediaTranslationPrefix + 'total')"
            :category-label="$t(mediaTranslationPrefix + 'category')"
            :category-value="$t(mediaTranslationPrefix + 'videos')"
            :total-value="videoMediasLength.toString()"
            :category-icon="'icon-play pr-2'"
            folder-style="font-size: 185px"
            :media-style="'rounded-full ml-2 h-[40px] w-[40px]'"
            :folder-clicked="
              () => {
                selectedFolder = 'video'
                getAllMedias('video')
              }
            "
          />
          <div v-if="selectedFolder === 'video'" class="h-10px bg-Blue flex mt-6"/>
        </div>

        <div class="self-center md:self-start">
          <LazyGMediaFolder
            :is-selected="selectedFolder === 'document'"
            :medias="documentMedias"
            :total-label="$t(mediaTranslationPrefix + 'total')"
            :category-label="$t(mediaTranslationPrefix + 'category')"
            :category-value="$t(mediaTranslationPrefix + 'documents')"
            :total-value="documentMediasLength.toString()"
            :category-icon="'icon-mediaDocumentBlue pr-2'"
            folder-style="font-size: 185px"
            :media-style="'rounded-full ml-2 h-[40px] w-[40px]'"
            :folder-clicked="
              () => {
                selectedFolder = 'document'
                getAllMedias('document')
              }
            "
          />
          <div v-if="selectedFolder === 'document'" class="h-10px bg-Blue flex mt-6"/>
        </div>
      </div>

      <div class="h-10px flex mx-16 mb-8 mobileHidden" :style="lineSeparatorStyle"/>

      <div v-show="mediaResponse.length !== 0">
        <div
          class="flex justify-center md:justify-start text-FieldGray pt-2"
          :class="nuxtSections ? 'pl-4' : 'md:pl-16'"
        >
          {{
            mediaResponse.length +
            ` ${$t(mediaTranslationPrefix + 'of')} ` +
            totalMedias +
            ` ${$t(mediaTranslationPrefix + 'medias')} `
          }}
        </div>
        <div class="py-8 flex flex-wrap" :class="nuxtSections ? '' : 'md:pl-16'">
          <div v-for="media in mediaResponse" :key="`media--${media.id}`" class="m-2">
            <LazyGMediaCard
              :copy-link-label="$t(mediaTranslationPrefix + 'copyLink')"
              :size-label="$t(mediaTranslationPrefix + 'size')"
              :content-label="$t(mediaTranslationPrefix + 'contentUsing')"
              :locked="media.locked_status !== 'unlocked'"
              :hidden="media.private_status !== 'public'"
              :media-src="media.files[0].url"
              :media-metadata-type="media.metadata?.type || 'image'"
              :media-title="
                media.title && media.title !== '' && media.title !== 'null'
                  ? media.title
                  : media.files[0].filename
              "
              :media-title-style="'w-200px overflow-hidden text-ellipsis white whitespace-nowrap'"
              :media-author="
                media.meta && (media.meta.author_name || media.meta.author)
                  ? media.meta.author
                    ? $t(mediaTranslationPrefix + 'by') + media.meta.author
                    : $t(mediaTranslationPrefix + 'by') + media.meta.author_name
                  : ''
              "
              :contentvalue="media.number_of_contents.toString()"
              :hidden-media-src="'icon-alert text-4xl'"
              :hidden-container-style="
                media.type === 'document' ? 'background: #61035B' : 'background: #EDEDED'
              "
              :hidden-message="$t(mediaTranslationPrefix + 'previewNotAvailable')"
              :is-author="media.author === sectionsUserId"
              :size-value="
                media.files[0].size > Math.pow(10, 6)
                  ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB`
                  : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`
              "
              :with-duration="media.type === 'video'"
              :media-type="media.type"
              :copy-link="() => copyMediaLink(media.files[0].url)"
              :open-media="() => openMedia(media.id)"
            />
          </div>
        </div>
        <a
          v-if="mediaResponse.length !== totalMedias"
          class="flex justify-center text-Blue underline mb-16 cursor-pointer"
          @click="seeMoreMedias"
          >{{ $t(mediaTranslationPrefix + 'seeMore') }}</a
        >
      </div>

      <div v-show="mediaResponse.length === 0 && loading === false" class="text-FieldGray p-16">
        {{ $t(mediaTranslationPrefix + 'noMediasFound') }}
      </div>
      <LazyGAnimatedLoading :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import {
  useFetch,
  useI18n,
  ref,
  computed,
  useNuxtApp,
  useRoute,
  useRouter,
  navigateTo,
  useHead,
  useLocalePath,
  watch,
} from '#imports'

import { mediaHeader, showToast } from './medias'

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

const props = defineProps({
  appliedFilters: {
    type: String,
    default: '',
  },
  folderType: {
    type: String,
    default: '',
  },
  mediaUriProp: {
    type: String,
    default: '',
  },
  authorsUriProp: {
    type: String,
    default: '',
  },
  projectIdProp: {
    type: String,
    default: '',
  },
  authToken: {
    type: String,
    default: '',
  },
  sectionsUserIdProp: {
    type: String,
    default: '',
  },
  mediaTranslationPrefix: {
    type: String,
    default: '',
  },
  createMediaPath: {
    type: String,
    default: '',
  },
  editMediaPath: {
    type: String,
    default: '',
  },
  mediasPath: {
    type: String,
    default: '',
  },
  multiSelectPlaceholder: {
    type: String,
    default: '',
  },
  lineSeparatorStyle: {
    type: String,
    default: 'background: #EDEDED',
  },
  mediaCategory: {
    type: String,
    default: '',
  },
  showCreateMediaButton: {
    type: Boolean,
    default: false,
  },
  accessLimited: {
    type: Boolean,
    default: false,
  },
  nuxtSections: {
    type: Boolean,
    default: false,
  },
  mediaResponseProp: {
    type: Object,
    default: () => ({}),
  },
  mainFilterOptions: {
    type: Object,
    default: () => ({
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle:
        'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
      labelPaddingWithIcon: 'left-12',
      labelPadding: 'left-3',
      selectErrorClass: 'select-error-class',
      selectIconClass: 'select-icon-class',
      labelInsideClass: 'label-inside-class',
      trackBy: '',
      focused: false,
      filterDisabled: false,
      multiple: false,
      closeOnSelect: true,
      preserveSearch: false,
      preselectFirst: false,
      clearOnSelect: false,
      multipleSelection: false,
      labelOutside: true,
      mainFilter: '',
      selectPlaceholder: '',
      filterLabelProp: 'value',
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: false,
      filterSearchable: false,
      errorOccurred: false,
      withIcon: true,
    }),
  },
  singleSelectFilterOptions: {
    type: Object,
    default: () => ({
      selectLabel: '',
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle:
        'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
      labelPaddingWithIcon: 'left-12',
      labelPadding: 'left-3',
      selectErrorClass: 'select-error-class',
      selectIconClass: 'select-icon-class',
      labelInsideClass: 'label-inside-class',
      trackBy: '',
      focused: false,
      filterDisabled: false,
      multiple: false,
      closeOnSelect: true,
      preserveSearch: false,
      preselectFirst: false,
      clearOnSelect: false,
      multipleSelection: false,
      labelOutside: true,
      mainFilter: '',
      selectPlaceholder: '',
      filterLabelProp: 'translation',
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: false,
      filterSearchable: false,
      errorOccurred: false,
      withIcon: false,
    }),
  },
  multiSelectFilterOptions: {
    type: Object,
    default: () => ({
      selectLabel: '',
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle:
        'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
      labelPaddingWithIcon: 'left-12',
      labelPadding: 'left-3',
      selectErrorClass: 'select-error-class',
      selectIconClass: 'select-icon-class',
      labelInsideClass: 'label-inside-class',
      trackBy: '',
      focused: false,
      filterDisabled: false,
      multiple: false,
      closeOnSelect: true,
      preserveSearch: true,
      preselectFirst: true,
      clearOnSelect: false,
      multipleSelection: false,
      labelOutside: true,
      mainFilter: '',
      selectPlaceholder: '',
      filterLabelProp: 'value',
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: true,
      filterSearchable: true,
      errorOccurred: false,
      withIcon: false,
    }),
  },
  responseReceived: {
    type: Function,
    default: () => {},
  },
  requestPreSent: {
    type: Function,
    default: () => {},
  },
  forwardRequest: {
    type: Function,
    default: null,
  },
})

// Reactive data
const loading = ref(false)
const mediaUri = ref(props.mediaUriProp)
const authorsUri = ref(props.authorsUriProp)
const projectId = ref(props.projectIdProp)
const token = ref(props.authToken)
const mediaResponse = ref([])
const allMedias = ref([])
const imageMedias = ref([])
const videoMedias = ref([])
const documentMedias = ref([])
const allMediasLength = ref('')
const imageMediasLength = ref('')
const videoMediasLength = ref('')
const documentMediasLength = ref('')
const showMoreIndex = ref(0)
const filterClear = ref(false)
const filtersQuery = ref('')
const selectedFolder = ref(useRoute().query.folder || props.folderType || 'all')

const payloadData = ref({
  filters: [],
  sort: {
    inserted_at: 'desc',
  },
  page: 1,
  per_page: 9,
})

const totalMedias = ref(0)
const currentPage = ref(1)
const pageNumber = ref(1)
const sectionsUserId = ref(props.sectionsUserIdProp)
const accessLimitedVal = ref(props.accessLimited)

const createButtonsStyle =
  'h-53px py-3.5 px-8 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue'

const filterOptions = [
  {
    key: 'All',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'selectFilter')
      : 'Select Filter',
  },
  {
    key: 'title',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.title')
      : 'Title',
  },
  {
    key: 'author',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.createdBy')
      : 'Created By',
  },
  {
    key: 'number_of_contents',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.contentsNumber')
      : 'Contents Number',
  },
  {
    key: 'private_status',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.privateStatus')
      : 'Private Status',
  },
  {
    key: 'locked_status',
    value: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.lockedStatus')
      : 'Locked Status',
  },
]

const filterMap = {
  All: { key: 'All', size: 3 },
  title: {
    title: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.title')
      : 'Title',
    key: 'title',
    size: 5,
    type: 'text',
  },
  author: {
    title: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.createdBy')
      : 'Created By',
    key: 'author',
    size: 5,
    type: 'multiSelect',
    multiSelectLabel: 'translation',
    multiSelectKey: 'key',
    multipleSelect: false,
    selectPlaceholder: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'selectUser')
      : 'Select User',
    filterOptions: [],
  },
  number_of_contents: {
    title: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.contentsNumber')
      : 'Contents Number',
    key: 'number_of_contents',
    size: 5,
    type: 'text',
  },
  private_status: {
    title: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.privateStatus')
      : 'Private Status',
    key: 'private_status',
    size: 5,
    type: 'select',
    selectPlaceholder: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.selectStatus')
      : 'Select Status',
    options: [
      {
        key: 'public',
        translation: props.mediaTranslationPrefix
          ? useI18n().t(props.mediaTranslationPrefix + 'public')
          : 'Public',
      },
      {
        key: 'private',
        translation: props.mediaTranslationPrefix
          ? useI18n().t(props.mediaTranslationPrefix + 'private')
          : 'Private',
      },
    ],
  },
  locked_status: {
    title: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.lockedStatus')
      : 'Locked Status',
    key: 'locked_status',
    size: 5,
    type: 'select',
    selectPlaceholder: props.mediaTranslationPrefix
      ? useI18n().t(props.mediaTranslationPrefix + 'filterOptions.selectStatus')
      : 'Select Status',
    options: [
      {
        key: 'locked',
        translation: props.mediaTranslationPrefix
          ? useI18n().t(props.mediaTranslationPrefix + 'locked')
          : 'Locked',
      },
      {
        key: 'unlocked',
        translation: props.mediaTranslationPrefix
          ? useI18n().t(props.mediaTranslationPrefix + 'unlocked')
          : 'Unlocked',
      },
    ],
  },
}

// Computed
const totalPages = computed(() => {
  return totalMedias.value === 0 ? 1 : Math.ceil(totalMedias.value / payloadData.value.per_page)
})

// Watchers
watch(
  () => props.accessLimited,
  (newVal) => {
    accessLimitedVal.value = newVal
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
  () => props.mediaUriProp,
  async (val) => {
    mediaUri.value = val
    if (useRoute().query.filters && useRoute().query.filters !== '') {
      filterMedias(JSON.parse(useRoute().query.filters))
    } else if (props.nuxtSections && props.appliedFilters) {
      filterMedias(JSON.parse(props.appliedFilters))
    } else if (val && import.meta.client) {
      await getAllMedias()
    }
  },
  { immediate: true }
)

watch(
  () => props.authorsUriProp,
  async (val) => {
    authorsUri.value = val
    if (val && import.meta.client) {
      await getAuthors()
    }
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
  () => props.mediaResponseProp,
  (res) => {
    if (res.result) {
      mediaResponse.value = []
      totalMedias.value = 0
      mediaResponse.value = res.result
      totalMedias.value = res.total

      allMedias.value = []
      imageMedias.value = []
      videoMedias.value = []
      documentMedias.value = []

      res.result.forEach((media) => {
        allMedias.value.push(media.files[0])
        if (media.type === 'image') {
          imageMedias.value.push(media.files[0])
        } else if (media.type === 'video') {
          videoMedias.value.push(media.files[0])
        } else if (media.type === 'document') {
          documentMedias.value.push(media.files[0])
        }
      })
    }
  },
  { deep: true, immediate: true }
)

// Methods
function hasObjectWithKey(arr, key, value) {
  return arr.some((item) => item.hasOwnProperty(key) && item[key] === value)
}

// getAllMedias function using Composition API for Nuxt 3
async function getAllMedias(folderMediaType, filtered) {
  try {
    if (props.nuxtSections && props.mediaCategory === 'document') {
      selectedFolder.value = 'document'
    }
    loading.value = true

    // First API call to get all media counts
    let allMediaResponse
    const payload = {
      method: 'POST',
      body: {
        sort: {
          inserted_at: payloadData.value.sort.inserted_at,
        },
      },
      headers: mediaHeader({ token: token.value }, projectId.value),
    }
    if (props.forwardRequest) {
      ;({ data: allMediaResponse } = await props.forwardRequest(mediaUri.value, payload))
    } else {
      ;({ data: allMediaResponse } = await useFetch(mediaUri.value, payload))
    }

    let responseReceivedData
    try {
      responseReceivedData = await props.responseReceived(
        'POST',
        mediaUri.value,
        {
          sort: {
            inserted_at: payloadData.value.sort.inserted_at,
          },
        },
        allMediaResponse.value
      )
    } catch {}
    if (responseReceivedData) {
      allMediaResponse.value = responseReceivedData
    }

    if (allMediaResponse && allMediaResponse.value) {
      // Process the response to categorize media files
      allMedias.value = []
      imageMedias.value = []
      videoMedias.value = []
      documentMedias.value = []

      allMediaResponse.value.result.forEach((media) => {
        allMedias.value.push(media.files[0])
        if (media.type === 'image') {
          imageMedias.value.push(media.files[0])
        } else if (media.type === 'video') {
          videoMedias.value.push(media.files[0])
        } else if (media.type === 'document') {
          documentMedias.value.push(media.files[0])
        }
      })

      allMediasLength.value = allMedias.value.length
      imageMediasLength.value = imageMedias.value.length
      videoMediasLength.value = videoMedias.value.length
      documentMediasLength.value = documentMedias.value.length

      // Handle route updates if not in nuxtSections and not filtered
      if (!props.nuxtSections && filtered !== true) {
        if (route.query.filters && route.query.filters !== '') {
          router.push(
            localePath({
              path: props.mediasPath,
              query: { filters: route.query.filters, folder: folderMediaType },
            })
          )
        } else {
          router.push(
            localePath({ path: props.mediasPath, query: { folder: selectedFolder.value } })
          )
        }
      }

      // Update filters based on selected folder
      if (selectedFolder.value) {
        if (selectedFolder.value === 'document') {
          if (hasObjectWithKey(payloadData.value.filters, 'key', 'type')) {
            payloadData.value.filters.find((filter) => filter.key === 'type').value = 'document'
          } else {
            payloadData.value.filters.push({
              key: 'type',
              value: 'document',
            })
          }
        } else if (selectedFolder.value === 'image') {
          if (hasObjectWithKey(payloadData.value.filters, 'key', 'type')) {
            payloadData.value.filters.find((filter) => filter.key === 'type').value = 'image'
          } else {
            payloadData.value.filters.push({
              key: 'type',
              value: 'image',
            })
          }
        } else {
          payloadData.value.filters = payloadData.value.filters.filter(
            (filter) => filter.key !== 'type'
          )
        }
      }
    }

    // Second API call with updated filters
    let filteredResponse
    const filteredPayload = {
      method: 'POST',
      body: payloadData.value,
      headers: mediaHeader({ token: token.value }, projectId.value),
    }
    if (props.forwardRequest) {
      ;({ data: filteredResponse } = await props.forwardRequest(mediaUri.value, filteredPayload))
    } else {
      ;({ data: filteredResponse } = await useFetch(mediaUri.value, filteredPayload))
    }

    if (mediaResponse.value && mediaResponse.value) {
      let responseReceivedData
      try {
        responseReceivedData = await props.responseReceived(
          'POST',
          mediaUri.value,
          {
            ...payloadData.value,
            filteredFetch: true,
          },
          filteredResponse.value
        )
      } catch {}
      if (responseReceivedData) {
        filteredResponse.value = responseReceivedData
      }

      mediaResponse.value = filteredResponse.value.result
      totalMedias.value = filteredResponse.value.total

      // Process filtered results based on selected folder
      if (!selectedFolder.value || selectedFolder.value === 'all') {
        allMedias.value = []
        imageMedias.value = []
        videoMedias.value = []

        filteredResponse.value.result.forEach((media) => {
          allMedias.value.push(media.files[0])
          if (media.type === 'image') {
            imageMedias.value.push(media.files[0])
          } else if (media.type === 'video') {
            videoMedias.value.push(media.files[0])
          } else if (media.type === 'document') {
            documentMedias.value.push(media.files[0])
          }
        })
      } else if (selectedFolder.value === 'document') {
        documentMedias.value = []
        filteredResponse.value.result.forEach((media) => {
          if (media.type === 'document') {
            documentMedias.value.push(media.files[0])
          }
        })
      } else if (selectedFolder.value === 'image') {
        imageMedias.value = []
        filteredResponse.value.result.forEach((media) => {
          if (media.type === 'image') {
            imageMedias.value.push(media.files[0])
          }
        })
      }
    }

    loading.value = false
  } catch (e) {
    loading.value = false
    if (props.nuxtSections) {
      showToast('Error', 'error', e.response.data.message)
    }
  }
}

function seeMoreMedias() {
  if (mediaUri.value !== '') {
    payloadData.value.per_page += 9
    getAllMedias(selectedFolder.value)
  }
}

async function getAuthors() {
  try {
    loading.value = true
    let response
    const payload = {
      method: 'GET',
      headers: mediaHeader({ token: token.value }, projectId.value),
    }
    if (props.forwardRequest) {
      response = await props.forwardRequest(authorsUri.value, payload)
    } else {
      response = await $fetch(authorsUri.value, payload)
    }
    response.data.forEach((project) => {
      filterMap.author.filterOptions.push({
        key: project.id,
        translation: project.full_name ? `${project.full_name} (${project.id})` : `(${project.id})`,
      })
    })
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

function copyMediaLink(link) {
  if (props.nuxtSections) {
    navigator.clipboard.writeText(link)
  } else {
    navigator.clipboard.writeText(link).catch(() => {})
  }
}

function getFilter(filter) {}

function filterMedias(filter) {
  filtersQuery.value = JSON.stringify(filter)
  if (!props.nuxtSections) {
    navigateTo(
      useLocalePath({
        path: props.mediasPath,
        query: { filters: filtersQuery.value, folder: selectedFolder.value },
      })
    )
  }

  for (const i in filter) {
    const index = payloadData.value.filters.findIndex((x) => x.key === filter[i].key)
    const value =
      filter[i].key === 'number_of_contents'
        ? Number.parseInt(filter[i].value)
        : filter[i].key === 'author'
          ? filter[i].value.substring(
              filter[i].value.indexOf('(') + 1,
              filter[i].value.lastIndexOf(')')
            )
          : filter[i].value

    if (index === -1) {
      payloadData.value.filters.push({ key: filter[i].key, value })
    } else {
      payloadData.value.filters[index].value = value
    }
  }

  if (mediaUri.value !== '') {
    getAllMedias(selectedFolder.value, true)
  }
}

function removeFilter(i, item) {
  if (payloadData.value.filters.length !== 1) {
    payloadData.value.filters = payloadData.value.filters.filter(
      (object) => object.key !== payloadData.value.filters[i].key
    )
    if (mediaUri.value !== '') {
      getAllMedias(selectedFolder.value, true)
    }
  }

  if (!props.nuxtSections) {
    try {
      const newFilters = JSON.stringify(
        JSON.parse(filtersQuery.value).filter((f) => f.key !== item.key)
      )
      navigateTo(
        useLocalePath({
          path: props.mediasPath,
          query: { filters: newFilters, folder: selectedFolder.value },
        })
      )
    } catch {}
  }
}

function clearFilters() {
  payloadData.value.filters.splice(0)
  filterClear.value = !filterClear.value
  if (mediaUri.value !== '') {
    getAllMedias(selectedFolder.value, true)
    if (!props.nuxtSections) {
      navigateTo(useLocalePath({ path: props.mediasPath, query: { folder: selectedFolder.value } }))
    } else {
      filtersQuery.value = ''
    }
  }
}

function openMedia(mediaID) {
  if (props.editMediaPath) {
    const query = { id: mediaID, folder: selectedFolder.value }
    if (useRoute().query.filters) query.filters = useRoute().query.filters
    navigateTo(useLocalePath({ path: props.editMediaPath, query }))
  } else {
    emit('updateMediaComponent', {
      name: 'MediaEditMedia',
      mediaId: mediaID,
      appliedFilters: filtersQuery.value,
      folderType: selectedFolder.value,
    })
  }
}

function setPage(pageNumber) {
  currentPage.value = pageNumber
  pageNumber.value = pageNumber
  payloadData.value.page = (pageNumber - 1) * payloadData.value.per_page
  getAllMedias(selectedFolder.value)
}

function handlePageChange(e) {
  if (e.key === 'Enter') {
    if (pageNumber.value >= 1 && pageNumber.value <= totalPages.value) {
      currentPage.value = pageNumber.value
      payloadData.value.page = (pageNumber.value - 1) * payloadData.value.per_page
      getAllMedias(selectedFolder.value)
    }
  }
}

function openCreateMedia() {
  if (props.createMediaPath) {
    const query = { folder: selectedFolder.value }
    if (useRoute().query.filters) query.filters = useRoute().query.filters
    navigateTo(useLocalePath({ path: props.createMediaPath, query }))
  } else {
    emit('updateMediaComponent', {
      name: 'MediaCreateMedia',
      appliedFilters: filtersQuery.value,
      folderType: selectedFolder.value,
    })
  }
}

function updateFilterValues(value) {
  if (['public', 'private', 'locked', 'unlocked'].includes(value)) {
    return useI18n().t(value)
  }
  return value
}

useHead({
  title: 'bo - Medias',
})

const emit = defineEmits(['updateMediaComponent'])
</script>

<style scoped>
.text-ellipsis {
  text-overflow: ellipsis !important;
}
@media only screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
