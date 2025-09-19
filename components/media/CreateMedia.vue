<template>
  <div class="mr-8" :class="nuxtSections ? '' : 'ml-4'">
    <div class="cursor-pointer text-4xl text-Blue" :class="nuxtSections ? 'fixed top-3 left-12' : 'md:pl-8'" @click="backClicked">
      {{ backLabel }}
    </div>
    <div class="text-mediaTextGray mt-8" :class="nuxtSections ? '' : 'md:ml-8'">
      {{ $t(mediaTranslationPrefix + 'dragDropMedia') }}
    </div>
    <div class="flex justify-center w-full md:w-auto items-center w-2/3 mt-8 md:ml-8" :class="nuxtSections ? '' : 'md:ml-8'" @drop.prevent="onFileSelected" @dragenter.prevent @dragover.prevent>
      <label for="dropzone-file" class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-BorderGray border-dashed cursor-pointer bg-mediaUploadGray">
        <div class="flex flex-col justify-center items-center pt-5 pb-6">
          <img src="../../assets/images/upload.svg" alt="" class="pb-4" width="100">
          <div class="text-grayText">
            {{ $t(mediaTranslationPrefix + 'dragDrop') }} <a class="text-Blue underline">{{ $t(mediaTranslationPrefix + 'browse') }}</a> {{ $t(mediaTranslationPrefix + 'yourMedia') }}
          </div>
        </div>
        <input id="dropzone-file" ref="imageUploaded" type="file" :accept="mediaCategory === 'document' ? fileTypes : null" class="hidden" @change="onFileSelected" />
      </label>
    </div>

    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />

  </div>
</template>

<script>
import {acceptedFileTypes, isLottieAnimation, mediaHeader, showSectionsToast} from "./medias";
import AnimatedLoading from "../AnimatedLoading";

export default {
  name: "CreateMedia",
  components: {
    AnimatedLoading
  },
  head() {
    return {
      title: "bo - CreateMedia",
    }
  },
  props: {
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
    mediaTranslationPrefix: {
      type: String,
      default: "mediaT."
    },
    editMediaPath: {
      type: String,
      default: ""
    },
    mediasPath: {
      type: String,
      default: ""
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
      default: ""
    }
  },
  data() {
    return {
      mediaByIdUri: '',
      projectId: '',
      token: '',
      loading: false,
      backLabel: '<',
      fileTypes: acceptedFileTypes
    }
  },
  watch: {
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
  },
  methods: {
    async onFileSelected(e) {
      let fileData = this.$refs.imageUploaded.files[0]
      if(e.dataTransfer && e.dataTransfer.files) {
        fileData = e.dataTransfer.files[0]
      }
      if (fileData) {
        this.loading = true
        const token = this.token

        const data = new FormData();
        data.append('files[1][platform_id]', '1');
        data.append('files[1][file]', fileData);
        data.append('type', fileData.type && fileData.type.includes('image') ? 'image' : 'document');
        data.append('private_status', 'public');
        data.append('locked_status', 'unlocked');

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

        if(this.mediaByIdUri !== '') {
          const response = await this.$axios.post(this.mediaByIdUri,
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
              showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'mediaCreated'))
            } else {
              this.$toast.show(
                {
                  message: this.$t(this.mediaTranslationPrefix + 'mediaCreated'),
                  classToast: 'bg-Blue',
                  classMessage: 'text-white',
                }
              )
            }
            if(this.editMediaPath) {
              this.$router.push(this.localePath({path: this.editMediaPath, query: {id: response.data.id, isCreate: true}}))
            } else this.$emit('updateMediaComponent', {name: 'MediaEditMedia', mediaId: response.data.id, isCreateMedia: true, appliedFilters: this.appliedFilters, folderType: this.folderType})
          }
        }
        this.loading = false
      }
    },
    backClicked() {
      if (this.mediasPath) {
        this.$router.push(this.localePath({path: this.mediasPath, query: {filters: this.$route.query.filters}}))
      } else this.$emit('updateMediaComponent', {name: 'MediaListMedias', appliedFilters: this.appliedFilters, folderType: this.folderType})
    }
  }
}
</script>

<style scoped>

</style>
