<template>
  <div class="max-w-max">
    <div :class="containerStyle">

      <div class="flex p-3 justify-between items-center w-full">

        <div class="flex">
          <div :class="locked ? 'rounded-full bg-mediaLocked flex items-center justify-center' : 'rounded-full bg-mediaUnLocked flex items-center justify-center'">
            <span v-if="locked" :class="iconLocked"></span>
            <span v-else :class="iconUnlocked"></span>
          </div>

          <div class="pl-4">
            <span v-if="hidden" :class="iconHidden"></span>
            <span v-else :class="iconSeen"></span>
          </div>
        </div>

        <div class="flex items-center cursor-pointer" @click="copyLink">
          <span :class="iconAttach"></span>
          <div :class="copyLinkStyle">
            {{ copyLinkLabel }}
          </div>
        </div>


      </div>

      <div v-if="!hidden || (hidden && isAuthor)" class="w-350px cursor-pointer" @click="openMedia">
        <div v-if="mediaType === 'document' && mediaMetadataType !== 'lottie'">
          <div class="flex w-full h-200px justify-center items-center object-cover" :style="hiddenContainerStyle">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-mediaDocument text-6xl"></span>
            </div>
          </div>
        </div>
        <div v-else-if="hidden && isAuthor">
          <div class="flex w-full h-200px justify-center items-center object-cover" :style="hiddenContainerStyle">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-photograpg text-8xl"></span>
            </div>
          </div>
        </div>
        <div v-else>
          <UniversalViewer :src="mediaSrc" :type="mediaMetadataType" class="w-full h-200px object-cover" />
        </div>
      </div>
      <div v-else class="w-350px cursor-pointer" :style="hiddenContainerStyle" @click="openMedia">
        <div class="flex w-full h-200px justify-center items-center object-cover">
          <div class="flex flex-col items-center gap-4">
            <span :class="hiddenMediaSrc"></span>
            <div class="text-center font-light">
              {{ hiddenMessage }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap w-350px items-center pt-3 pr-3 pl-3">
        <div :class="mediaTitleStyle">
          {{ mediaTitle }}
        </div>
        <div :class="mediaAuthorStyle">
          {{ mediaAuthor }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3">
        <div :class="contentStyle">
          {{ contentvalue }}
        </div>
        <div :class="contentStyle">
          {{ contentLabel }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3" :class="withDuration ? '' : 'pb-3'">
        <div :class="sizeStyle">
          {{ sizeLabel }}
        </div>
        <div :class="sizeValueStyle">
          {{ sizeValue }}
        </div>
      </div>

      <div v-if="withDuration" class="flex items-center pt-1 pl-3 pr-3 pb-3">
        <div :class="durationStyle">
          {{ durationLabel }}
        </div>
        <div :class="mobileDesktopLabelStyle">
          {{ mobileLabel }}
        </div>
        <div :class="mobileDesktopValueStyle">
          {{ mobileValue }}
        </div>
        <div :class="mobileDesktopLabelStyle">
          {{ desktopLabel }}
        </div>
        <div :class="mobileDesktopValueStyle">
          {{ desktopValue }}
        </div>

        <div :class="seeMoreStyle" @click="seeMoreClicked">
          {{ seeMoreLabel }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import UniversalViewer from "../UniversalViewer.vue"

export default {
  name: "Card",
  components: {
    UniversalViewer
  },
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    isAuthor: {
      type: Boolean,
      default: false
    },
    iconLocked: {
      type: String,
      default: 'icon-locked pl-2.5 pr-2.5 pt-2 pb-2'
    },
    iconUnlocked: {
      type: String,
      default: 'icon-unlocked pl-2.5 pr-2.5 pt-2 pb-2'
    },
    iconHidden: {
      type: String,
      default: 'icon-hidden text-2xl'
    },
    iconSeen: {
      type: String,
      default: 'icon-seen text-2xl'
    },
    iconAttach: {
      type: String,
      default: 'icon-attach'
    },
    copyLinkLabel: {
      type: String,
      default: 'Copy link'
    },
    copyLinkStyle: {
      type: String,
      default: 'pl-1 text-Blue font-light'
    },
    containerStyle: {
      type: String,
      default: 'shadow rounded-xl h-380px'
    },
    mediaSrc: {
      type: String,
      default: '../assets/images/temp2.svg'
    },
    mediaMetadataType: {
      type: String,
      default: ''
    },
    hiddenMediaSrc: {
      type: String,
      default: ''
    },
    hiddenMessage: {
      type: String,
      default: ''
    },
    mediaTitle: {
      type: String,
      default: 'Nametest.jpeg'
    },
    mediaTitleStyle: {
      type: String,
      default: ''
    },
    hiddenContainerStyle: {
      type: String,
      default: ''
    },
    mediaAuthorStyle: {
      type: String,
      default: 'pl-1 italic text-sm font-extralight'
    },
    mediaAuthor: {
      type: String,
      default: '- By Lorem ipsum'
    },
    contentStyle: {
      type: String,
      default: 'text-sm font-extralight pr-1'
    },
    contentvalue: {
      type: String,
      default: '0'
    },
    contentLabel: {
      type: String,
      default: 'content using this media'
    },
    sizeStyle: {
      type: String,
      default: 'text-sm font-extralight pr-1'
    },
    sizeLabel: {
      type: String,
      default: 'Size: '
    },
    sizeValueStyle: {
      type: String,
      default: 'text-xs text-grayText font-extralight pr-1'
    },
    sizeValue: {
      type: String,
      default: '38MB - 40MB'
    },
    withDuration: {
      type: Boolean,
      default: true
    },
    durationStyle: {
      type: String,
      default: 'text-sm font-extralight pr-2'
    },
    durationLabel: {
      type: String,
      default: 'Duration:'
    },
    mobileLabel: {
      type: String,
      default: 'Mobile'
    },
    mobileDesktopValueStyle: {
      type: String,
      default: 'text-xs text-grayText font-extralight pr-3'
    },
    mobileDesktopLabelStyle: {
      type: String,
      default: 'text-sm font-light pr-1'
    },
    desktopLabel: {
      type: String,
      default: 'Desktop'
    },
    mobileValue: {
      type: String,
      default: '30min'
    },
    desktopValue: {
      type: String,
      default: '20min'
    },
    seeMoreStyle: {
      type: String,
      default: 'text-sm text-Blue italic font-extralight cursor-pointer'
    },
    seeMoreLabel: {
      type: String,
      default: 'see more'
    },
    mediaType: {
      type: String,
      default: ''
    },
    seeMoreClicked: {
      type: Function,
      default: (item) => {}
    },
    copyLink: {
      type: Function,
      default: (link) => {}
    },
    openMedia: {
      type: Function,
      default: (item) => {}
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
