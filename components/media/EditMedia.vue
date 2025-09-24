<template>
  <div class="flex flex-col h-full justify-start">

    <div class="cursor-pointer text-4xl text-Blue" :class="nuxtSections ? 'fixed top-3 left-12' : 'pl-8'" @click="backClicked">
      {{ backLabel }}
    </div>

    <div v-if="privateStatus === 'public' && lockedStatus === 'unlocked'">
    </div>
    <div v-else-if="(privateStatus === 'private' || lockedStatus === 'locked') && media.author !== sectionsUserIdProp" class="flex justify-center items-start bg-purpleInfo py-2 my-4 mx-4">
      <span class="icon-iconInfo2 pt-1 pr-2"></span>
      <div class="flex flex-col text-white font-light">
        <div class="flex gap-1">
          <span>
            {{ $t(mediaTranslationPrefix + 'noPermission') }}
          </span>
          <span class="font-bold">
            {{ allowedPermission }}
          </span>
        </div>
        <div class="flex gap-1">
          <span>
            {{ $t(mediaTranslationPrefix + 'becauseMedia') }}
          </span>
          <span class="font-bold">
            {{ statusAvailable }}
          </span>
          <span>
            {{ $t(mediaTranslationPrefix + 'byCreator') }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row mt-4 w-full gap-4 md:gap-0" :class="nuxtSections ? '' : 'md:pl-6'">

      <div class="flex flex-col md:w-300px py-8 px-6 shadow rounded-xl">

        <label class="text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.mediaTitle') }}</label>
        <div v-if="!(lockedStatus === 'locked' && media.author !== sectionsUserIdProp)">
          <input v-model="media.title" class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16" />
        </div>
        <div v-else>
          {{ media.title }}
        </div>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.tag') }}</label>
        <div v-if="!(lockedStatus === 'locked' && media.author !== sectionsUserIdProp)">
          <input v-model="media.seo_tag" class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16" />
        </div>
        <div v-else>
          {{ media.seo_tag }}
        </div>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.type') }}</label>
        <div class="mt-3 flex">
          <div class="w-7px h-6px bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">
            {{ $t(mediaTranslationPrefix + 'EditMedia.privateDesc') }}
          </div>
        </div>
        <div class="mt-3 flex">
          <div class="w-7px h-6px bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">
            {{ $t(mediaTranslationPrefix + 'EditMedia.publicDesc') }}
          </div>
        </div>
<!--    :disabled="(lockedStatus === 'locked' && media.author !== sectionsUserIdProp)"  -->
        <select v-model="media.private_status" :disabled="nuxtSections ? isCreateMedia !== true : $route.query.isCreate !== 'true'" class="border border-SmallTextGray shadow rounded-md outline-none py-1 px-2 mt-3 mr-16">
          <option value="none" disabled selected>{{ $t(mediaTranslationPrefix + 'EditMedia.selectOption') }}</option>
          <option value="public">{{ $t(mediaTranslationPrefix + 'EditMedia.public') }}</option>
          <option value="private">{{ $t(mediaTranslationPrefix + 'EditMedia.private') }}</option>
        </select>

        <label class="mt-8 text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.state') }}</label>
        <div class="mt-3 flex">
          <div class="w-7px h-6px bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">
            {{ $t(mediaTranslationPrefix + 'EditMedia.lockedDesc') }}
          </div>
        </div>
        <div class="mt-3 flex">
          <div class="w-7px h-6px bg-Blue rounded-full mt-2.5 mr-2"></div>
          <div class="text-md text-mediaTextGray">
            {{ $t(mediaTranslationPrefix + 'EditMedia.unlockedDesc') }}
          </div>
        </div>

        <div class="mt-4" :class="media.locked_status === 'locked' ? 'w-48px h-48px rounded-full bg-mediaLocked flex items-center justify-center cursor-pointer' : 'w-48px h-48px rounded-full bg-mediaUnLocked flex items-center justify-center cursor-pointer'" @click="lockedStatus === 'locked' && media.author !== sectionsUserIdProp ? null : media.locked_status === 'locked' ? media.locked_status = 'unlocked' : media.locked_status = 'locked'">
          <span v-if="media.locked_status === 'locked'" class="icon-locked text-xl"></span>
          <span v-else class="icon-unlocked text-xl"></span>
        </div>

      </div>

      <div class="w-full pl-2 pr-4 md:pr-0 md:mx-4">

        <HeaderContainer :items="headerItems" @itemClicked="itemClicked" />

        <div v-show="showPopupCode" class="fixed z-20 overflow-hidden bg-FieldGray bg-opacity-25 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="false"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="false">&#8203;</span>

            <div class="inline-block shadow-lg shadow ring-black ring-opacity-5 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-max">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:items-start">
                  <div class="mt-3 flex justify-between pt-1 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div></div>
                    <div class="sticky">
                      <span class="icon-cross cursor-pointer" @click="showPopupCode = false"></span>
                    </div>
                  </div>
                  <div v-if="popupContent && popupContent.content" class="mt-2" style="overflow: auto !important; max-height: 450px;">
                    <div v-for="content in popupContent.content" :key="content.id" class="flex flex-row items-center p-1">
                      <div class="w-2.5 h-2.5 mr-3 rounded-full bg-darkBlue"></div>
                      <div class="content-used font-medium text-lg pr-3">
                        {{ `${contentUsedKey ? content[contentUsedKey] : content.name} (${content.id}) ${$t(mediaTranslationPrefix + 'by')}${popupContent.author}` }}
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
<!--            <span class="icon-trashCan2 text-lg cursor-pointer"></span>-->
          </div>

          <div class="text-xs text-mediaTextGray flex pl-2 pt-2">
            <div class="font-light">{{ $t(mediaTranslationPrefix + 'EditMedia.sizeRec') }}</div>
            <div class="pl-1 font-bold">{{ $t(mediaTranslationPrefix + `EditMedia.${media.files[0].platform.name}`) }}</div>
            <div class="font-light">{{ `: W ${media.files[0].platform.width}px H ${media.files[0].platform.height}px)` }}</div>
          </div>
        </div>

        <div v-if="media.files && media.type === 'video'" class="text-xs text-SmallTextGray font-light pl-2 pt-5 flex flex-col md:flex-row">
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.fileName')}  ${handleFileName(media.files[0].filename)}` }}</div>
          <div class="px-6 text-Dark">|</div>
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.fileSize')}  ${media.files[0].size > Math.pow(10, 6) ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB` : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`}` }}</div>
          <div class="px-6 text-Dark">|</div>
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.duration')}  ${media.files[0].size}min` }}</div>
        </div>
        <div v-else-if="media.files" class="text-xs text-SmallTextGray font-light pl-2 pt-5 flex flex-col md:flex-row">
          <div class="flex gap-2">
            <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.fileName')}` }}</div>
            <div class="w-min">{{ `${handleFileName(media.files[0].filename)}` }}</div>
          </div>
          <div class="px-6 text-Dark">|</div>
          <div>{{ `${$t(mediaTranslationPrefix + 'EditMedia.fileSize')} ${media.files[0].size > Math.pow(10, 6) ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB` : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`}` }}</div>
        </div>

        <div v-if="privateStatus !== 'private' || (privateStatus === 'private' && media.author === sectionsUserIdProp)">
          <div class="my-8 p-2 px-2 cursor-pointer flex rounded-md shadow text-sm text-SmallTextGray font-light w-max" @click="downloadMedia">
            <img src="../../assets/images/downloadMedia.svg" alt="" class="pr-2">
            <div>{{ $t(mediaTranslationPrefix + 'EditMedia.downloadMedia') }}</div>
          </div>

          <div v-if="media.type === 'document' && media.metadata?.type !== 'lottie'">
            <div class="flex w-350px h-200px justify-center items-center object-cover relative" :style="hiddenContainerStyle">
              <div class="flex flex-col items-center gap-4">
                <span class="icon-mediaDocument text-6xl"></span>
              </div>
              <div class="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3" @click="$refs.imagePick.click()">
                <span class="icon-reload text-8xl cursor-pointer"></span>
                <input
                  ref="imagePick"
                  type="file"
                  class="hidden"
                  :accept="fileTypes"
                  @change="onFileSelected"
                />
              </div>
            </div>
          </div>
          <div v-else-if="!(lockedStatus === 'locked' && media.author !== sectionsUserIdProp)">
            <div v-if="media.files && media.files[0].url !== ''" class="relative w-max">
              <UniversalViewer :src="media.files[0].url" :type="media.metadata?.type || 'image'" alt="" class="rounded-md md:w-400px w-300px" />
              <div class="absolute top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3" @click="$refs.imagePick.click()">
                <span class="icon-reload text-8xl cursor-pointer"></span>
                <input
                  ref="imagePick"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onFileSelected"
                />
              </div>
            </div>
          </div>
          <div v-else-if="media.files">
            <div v-if="media.files[0].url !== ''" class="relative w-max">
              <UniversalViewer :src="mediaPreview ? mediaPreview : media.files[0].url" :type="media.metadata?.type || 'image'" alt="" class="rounded-md w-400px" />
            </div>
          </div>

        </div>

        <div v-else class="w-400px cursor-pointer rounded-xl mt-8" style="background: #EDEDED">
          <div class="flex w-full h-200px justify-center items-center object-cover">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-alert text-4xl"></span>
              <div class="text-center font-light">
                {{ $t(mediaTranslationPrefix + 'previewNotAvailable') }}
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>

    <div v-if="!((privateStatus === 'private' || privateStatus === 'public') && lockedStatus === 'locked' && media.author !== sectionsUserIdProp)" class="sticky bottom-0 py-2 m-4 rounded-md shadow bg-white">

      <div class="flex w-full items-center justify-end">
        <div v-if="privateStatus !== 'private' || (privateStatus === 'private' && media.author === sectionsUserIdProp)" class="cursor-pointer flex items-center" @click="showPopup = true">
          <div class="text-error text-sm md:text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.deleteMedia') }}</div>
          <span class="icon-trashCan2 text-md pb-1 px-2"></span>
        </div>
        <div @click.stop.prevent="mediaByIdUri !== '' ? updateMediaByID() : () => {}">
          <Buttons :button-text="$t(mediaTranslationPrefix + 'save')" :button-style="saveButtonStyle" :with-icon="false" />
        </div>
        <div @click.stop.prevent="(privateStatus === 'private' && media.author !== sectionsUserIdProp) ? null : $emit('onMediaSelected', media)">
          <Buttons v-if="withSelectMediaButton" :active="!(privateStatus === 'private' && media.author !== sectionsUserIdProp)" :button-text="$t(mediaTranslationPrefix + 'selectMedia')" :button-style="selectMediaButtonStyle" :with-icon="false" />
        </div>
      </div>

    </div>

    <AlertPopup :errors-container-style="'mt-10 mb-14 self-center h-auto max-h-72 overflow-y-auto'" :apply-button-text="$t(mediaTranslationPrefix + 'EditMedia.deleteMedia')" :cancel-button-text="$t(mediaTranslationPrefix + 'EditMedia.cancel')" :title-delete="$t(mediaTranslationPrefix + 'EditMedia.deleteMediaMsg')" :title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDelete')" :sub-title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDeleteExtra')" :show-popup-code="showPopup" :can-be-deleted="media.meta ? !(media.meta.content && media.meta.content.length > 0) : false" :errors="noDeleteErrors" @cancel="showPopup = false" @apply="deleteMediaByID" />

    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />

  </div>
</template>

<script>
import AlertPopup from "../AlertPopup";
import Buttons from "../Buttons";
import AnimatedLoading from "../AnimatedLoading";
import HeaderContainer from "../HeaderContainer";
import UniversalViewer from "../UniversalViewer";
import {acceptedFileTypes, isLottieAnimation, mediaHeader, showSectionsToast} from "./medias";

/* eslint-disable vue/return-in-computed-property */
export default {
  name: "EditMedia",
  head() {
    return {
      title: "bo - EditMedia",
    }
  },
  components: {
    HeaderContainer,
    Buttons,
    AlertPopup,
    AnimatedLoading,
    UniversalViewer
  },
  props: {
    contentUsedKey: {
      type: String,
      default: ""
    },
    appliedFilters: {
      type: String,
      default: ""
    },
    folderType: {
      type: String,
      default: ""
    },
    mediaByIdUriProp: {
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
    mediasPath: {
      type: String,
      default: ""
    },
    hiddenContainerStyle: {
      type: String,
      default: "background: #61035B"
    },
    mediaByIdResponseProp: {
      type: Object,
      default() {
        return {}
      }
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
      default() {
        return {}
      }
    },
    nuxtSections: {
      type: Boolean,
      default: false
    },
    mediaIdEditing: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      saveButtonStyle: "py-2.5 px-12 ml-12 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
      selectMediaButtonStyle: "py-2.5 px-12 ml-2 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
      mediaId: '',
      mediaByIdUri: '',
      projectId: '',
      token: '',
      title: "",
      seoTag: "",
      privateStatus: "public",
      lockedStatus: "unlocked",
      headerItems: [
        {
          label: this.$t(this.mediaTranslationPrefix + 'headerItems.id'),
          value: '',
          headerStyle: 'text-sm'
        },
        {
          label: this.$t(this.mediaTranslationPrefix + 'headerItems.creationDate'),
          value: '',
          headerStyle: 'text-sm'
        },
        {
          label: this.$t(this.mediaTranslationPrefix + 'headerItems.createdBy'),
          value: '',
          headerStyle: 'text-sm'
        },
        {
          label: this.$t(this.mediaTranslationPrefix + 'headerItems.mediaType'),
          value: '',
          headerStyle: 'text-sm'
        },
        {
          label: this.$t(this.mediaTranslationPrefix + 'headerItems.contents'),
          value: '',
          headerStyle: 'text-sm text-Blue underline cursor-pointer',
          clickable: true
        }
      ],
      media: {
        type: "",
        title: "",
        tags: "",
        seo_tag: "",
        private_status: "public",
        number_of_contents: 0,
        namespace: "",
        locked_status: "unlocked",
        id: "",
        files: [
          {
            url: "",
            type: "",
            thumbnail_url: "",
            size: 0,
            platform_id: "",
            platform: {
              width: 0,
              updated_at: 0,
              number_of_medias: 0,
              namespace: "",
              name: "",
              inserted_at: 0,
              id: "",
              height: 0,
              description: ""
            },
            metadata: {
              width: 0,
              height: 0
            },
            filename: "",
            file_id: ""
          }
        ],
        meta: {
          author: "",
          content: []
        }
      },
      mediaPreview: '',
      showPopup: false,
      file: null,
      showPopupCode: false,
      popupContent: '',
      backLabel: '<',
      isEditingMedia: false,
      fileTypes: acceptedFileTypes
    }
  },
  computed: {
    allowedPermission() {
      if(this.lockedStatus === 'locked' && this.privateStatus === 'private') {
        return this.$t(this.mediaTranslationPrefix + 'previewOrEditMediaLabel')
      } else if(this.privateStatus === 'private') {
        return this.$t(this.mediaTranslationPrefix + 'previewMediaLabel')
      } else if(this.lockedStatus === 'locked') {
        return this.$t(this.mediaTranslationPrefix + 'editMediaLabel')
      }
    },
    statusAvailable() {
      if(this.lockedStatus === 'locked' && this.privateStatus === 'private') {
        return this.$t(this.mediaTranslationPrefix + 'privateAndLocked')
      } else if(this.privateStatus === 'private') {
        return this.$t(this.mediaTranslationPrefix + 'private')
      } else if(this.lockedStatus === 'locked') {
        return this.$t(this.mediaTranslationPrefix + 'locked')
      }
    },
    noDeleteErrors() {
      const errorsArray = []
      if (this.media.meta && this.media.meta.content && this.media.meta.content.length > 0) {
        this.media.meta.content.forEach(m => {
          errorsArray.push(
            {
              authorName: this.$t(this.mediaTranslationPrefix + 'by') + this.media.meta.author,
              errorTitle: this.contentUsedKey ? `${m[this.contentUsedKey]} (${m.id})` : `${m.name} (${m.id})`
            }
          )
        })
      }
      return errorsArray
    }
  },
  watch: {
    media() {
      if(Object.keys(this.media).length > 0) {
        this.headerItems[0].value = this.media.id
        this.headerItems[1].value = this.media.creation_date ? new Date(this.media.creation_date * 1000).toLocaleDateString() : new Date(this.media.inserted_at).toLocaleDateString()
        this.headerItems[2].value = this.media.meta.author
        this.headerItems[3].value = this.media.type[0].toUpperCase() + this.media.type.substring(1)
        this.headerItems[4].value = this.media.number_of_contents
      }
    },
    mediaIdProp: {
      handler(val) {
        this.mediaId = val
      },
      deep: true,
      immediate: true
    },
    projectIdProp: {
      handler(val) {
        this.projectId = val
      },
      deep: true,
      immediate: true
    },
    authToken: {
      handler(val) {
        this.token = val
      },
      deep: true,
      immediate: true
    },
    mediaByIdUriProp: {
      handler(val) {
        this.mediaByIdUri = val
      },
      deep: true,
      immediate: true
    },
    sectionsUserIdProp: {
      handler(val) {
        this.sectionsUserId = val
      },
      deep: true,
      immediate: true
    },
    mediaByIdResponseProp: {
      handler(res) {
        if (res) {
          this.media = res
          if(this.media.title === "null") this.media.title = ""
          if(this.media.seo_tag === "null") this.media.seo_tag = ""
          this.privateStatus = this.media.private_status
          this.lockedStatus = this.media.locked_status
          this.popupContent = this.media.meta
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if(this.mediaByIdUri !== '') {
      this.getMediaByID()
    }
  },
  methods: {
    async getMediaByID() {
      this.loading = true
      const token = this.token
      const response = await this.$axios.get(this.mediaByIdUri + this.mediaId,
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', e.response.data.message)
        } else {
          this.$toast.show(
            {
              message: e.response.data.message,
              timeout: 5,
              classToast: 'bg-error',
              classMessage: 'text-white',
            }
          )
        }
        this.backClicked()
      })
      if(response && response.data) {
        this.media = response.data
        if(this.media.title === "null") this.media.title = ""
        if(this.media.seo_tag === "null") this.media.seo_tag = ""
        this.privateStatus = this.media.private_status
        this.lockedStatus = this.media.locked_status
        this.popupContent = this.media.meta
        if (this.privateStatus === 'private' && this.media.author === this.sectionsUserIdProp) {
          this.getMediaImage(this.media.files[0].url)
        }
        if (this.nuxtSections && this.mediaIdEditing && this.mediaIdEditing !== '' && this.mediaIdEditing === this.media.id) {
          this.isEditingMedia = true
        }
      }
      this.loading = false
    },
    async updateMediaByID() {
      this.loading = true
      const token = this.token

      const data = new FormData();
      if(this.file) {
        data.append('files[1][platform_id]', '1');
        data.append('files[1][file]', this.file);
        data.append('type', this.file.type && this.file.type.includes('image') ? 'image' : 'document');
      }
      if(this.media.title && this.media.title !== '') data.append('title', this.media.title);
      if(this.media.seo_tag && this.media.seo_tag !== '') data.append('seo_tag', this.media.seo_tag);
      data.append('private_status', this.media.private_status);
      data.append('locked_status', this.media.locked_status);

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

      const response = await this.$axios.put(this.mediaByIdUri + this.mediaId,
        data,
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        let errorMessage = ''
        if (e.request && e.response === undefined) {
          errorMessage = this.$t('mediaTooLarge');
        } else if (e.response.data.options) {
          if (this.boUsage === true) {
            errorMessage = `<a href='/admin${e.response.data.options.link.path}' >${e.response.data.error}, ${e.response.data.message}</a>`
          } else {
            errorMessage = `<a href='${e.response.data.options.link.root}${e.response.data.options.link.path}' target=\\'_blank\\'>${e.response.data.error}, ${e.response.data.message}</a>`
          }
        } else if (e.response.data.errors) {
          errorMessage = e.response.data.errors.files[0]
        } else {
          errorMessage = e.response.data.error ? `${e.response.data.error}, ${e.response.data.message}` : e.response.data.message
        }
          if (this.nuxtSections) {
            if (e.request && e.response === undefined) {
              showSectionsToast(this.$toast, 'error', errorMessage, '', errorMessage)
            } else {
              showSectionsToast(this.$toast, 'error', `${e.response.data.error}, ${e.response.data.message}`, e.response.data.options, errorMessage)
            }
          } else {
            this.$toast.show(
              {
                message: errorMessage,
                timeout: 5,
                classToast: 'bg-error',
                classMessage: 'text-white',
              }
            )
          }
      })
      if(response && response.data) {
        if (this.nuxtSections) {
          await this.getMediaByID()
          if (this.isEditingMedia) {
            this.$emit('onMediaSelected', this.media)
          }
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'mediaUpdated'))
        } else {
          this.$toast.show(
            {
              message: this.$t(this.mediaTranslationPrefix + 'mediaUpdated'),
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
      }
      this.loading = false
    },
    async deleteMediaByID() {
      if(this.mediaByIdUri !== '') {
        this.loading = true
        const token = this.token
        const response = await this.$axios.delete(this.mediaByIdUri + this.mediaId,
          {
            headers: mediaHeader({token}, this.projectId)
          }).catch(e => {
          let errorMessage = e.response.data.error
          if (this.nuxtSections) {
            showSectionsToast(this.$toast, 'error', `${e.response.data.error}`, e.response.data.options, errorMessage)
          } else {
            this.$toast.show(
              {
                message: errorMessage,
                timeout: 5,
                classToast: 'bg-error',
                classMessage: 'text-white',
              }
            )
          }
        })
        if (this.nuxtSections && response && response.data) {
          showSectionsToast(this.$toast, 'success', response.data.message)
        } else if (response && response.data) {
          this.$toast.show(
            {
              message: response.data.message,
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
        this.loading = false
        if (response && response.data) {
          if (this.mediasPath) {
            this.$router.push(this.localePath({path: this.mediasPath}))
          } else this.$emit('updateMediaComponent', {name: 'MediaListMedias', appliedFilters: this.appliedFilters, folderType: this.folderType})
        }
      }
    },
    onFileSelected(e) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e) this.media.files[0].url = e.target.result
      }
      if (this.$refs.imagePick.files[0]) {
        reader.readAsDataURL(this.$refs.imagePick.files[0])
        this.file = this.$refs.imagePick.files[0]
      }
    },
    downloadMedia(){
      const fileLink = document.createElement('a')
      fileLink.href = this.media.files[0].url
      fileLink.target = '_blank'
      fileLink.setAttribute('download', this.media.files[0].filename)
      document.body.appendChild(fileLink)

      fileLink.click()
      fileLink.remove()
      window.URL.revokeObjectURL(this.media.files[0].url)
    },
    itemClicked(item) {
      if(item.value !== 0) this.showPopupCode = true
    },
    getMediaImage(url) {
      fetch(url, { headers: this.media.files[0].headers, mode: "cors"}).then(r=>r.blob()).then(d => {
        this.mediaPreview = window.URL.createObjectURL(d)
      });
    },
    backClicked() {
      this.isEditingMedia = false
      if (this.mediasPath) {
        this.$router.push(this.localePath({path: this.mediasPath, query: {filters: this.$route.query.filters, folder: this.$route.query.folder}}))
      } else this.$emit('updateMediaComponent', {name: 'MediaListMedias', appliedFilters: this.appliedFilters, folderType: this.folderType})
    },
    // The below function is used to split the media fileName string into 3 parts separated with space, it was done for design purpose as the fileName of media can be very long and cause design problems
    handleFileName(fileName) {
      if (fileName.length > 50) {
        const len = fileName.length;
        const partLength = Math.ceil(len / 3);

        const part1 = fileName.substring(0, partLength);
        const part2 = fileName.substring(partLength, partLength * 2);
        const part3 = fileName.substring(partLength * 2);

        return [part1, part2, part3].join(' ');
      }
    }
  }
}
</script>

<style scoped>
.bg-mediaUnLocked {
  background-color: #DDEBFF;
}
.bg-mediaLocked {
  background-color: #FFE5DD;
}
</style>
