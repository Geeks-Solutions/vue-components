<template>
  <div class="max-w-max">
    <div :class="props.containerStyle">
      <div class="flex p-3 justify-between items-center w-full">
        <div class="flex">
          <div
            :class="
              props.locked
                ? 'rounded-full bg-mediaLocked flex items-center justify-center'
                : 'rounded-full bg-mediaUnLocked flex items-center justify-center'
            "
          >
            <span v-if="props.locked" :class="props.iconLocked"/>
            <span v-else :class="props.iconUnlocked"/>
          </div>

          <div class="pl-4">
            <span v-if="props.hidden" :class="props.iconHidden"/>
            <span v-else :class="props.iconSeen"/>
          </div>
        </div>

        <div class="flex items-center cursor-pointer" @click="props.copyLink">
          <span :class="props.iconAttach"/>
          <div :class="props.copyLinkStyle">
            {{ props.copyLinkLabel }}
          </div>
        </div>
      </div>

      <div
        v-if="!props.hidden || (props.hidden && props.isAuthor)"
        class="md:w-[350px] cursor-pointer card-image-wrapper"
        @click="props.openMedia"
      >
        <div v-if="props.mediaType === 'document' && props.mediaMetadataType !== 'lottie'">
          <div
            class="flex w-full h-[200px] justify-center items-center object-cover"
            :style="props.hiddenContainerStyle"
          >
            <div class="flex flex-col items-center gap-4">
              <span class="icon-mediaDocument text-6xl"/>
            </div>
          </div>
        </div>
        <div v-else-if="props.hidden &amp;&amp; props.isAuthor">
          <div
            class="flex w-full h-[200px] justify-center items-center object-cover"
            :style="props.hiddenContainerStyle"
          >
            <div class="flex flex-col items-center gap-4">
              <span class="icon-photograpg text-8xl"/>
              <!-- Assuming icon-photograph is correct -->
            </div>
          </div>
        </div>
        <div v-else>
          <LazyGUniversalViewer
            :src="props.mediaSrc"
            :type="props.mediaMetadataType"
            class="w-full h-[200px] object-cover"
          />
        </div>
      </div>
      <div
        v-else
        class="w-[350px] cursor-pointer card-hidden-message-wrapper"
        :style="props.hiddenContainerStyle"
        @click="props.openMedia"
      >
        <div class="flex w-full h-[200px] justify-center items-center object-cover">
          <div class="flex flex-col items-center gap-4">
            <span :class="props.hiddenMediaSrc"/>
            <div class="text-center font-light">
              {{ props.hiddenMessage }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap w-[350px] items-center pt-3 pr-3 pl-3 card-details-wrapper">
        <div :class="props.mediaTitleStyle">
          {{ props.mediaTitle }}
        </div>
        <div :class="props.mediaAuthorStyle">
          {{ props.mediaAuthor }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3">
        <div :class="props.contentStyle">
          {{ props.contentvalue }}
        </div>
        <div :class="props.contentStyle">
          {{ props.contentLabel }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3" :class="props.withDuration ? '' : 'pb-3'">
        <div :class="props.sizeStyle">
          {{ props.sizeLabel }}
        </div>
        <div :class="props.sizeValueStyle">
          {{ props.sizeValue }}
        </div>
      </div>

      <div v-if="props.withDuration" class="flex items-center pt-1 pl-3 pr-3 pb-3">
        <div :class="props.durationStyle">
          {{ props.durationLabel }}
        </div>
        <div :class="props.mobileDesktopLabelStyle">
          {{ props.mobileLabel }}
        </div>
        <div :class="props.mobileDesktopValueStyle">
          {{ props.mobileValue }}
        </div>
        <div :class="props.mobileDesktopLabelStyle">
          {{ props.desktopLabel }}
        </div>
        <div :class="props.mobileDesktopValueStyle">
          {{ props.desktopValue }}
        </div>

        <div :class="props.seeMoreStyle" @click="props.seeMoreClicked">
          {{ props.seeMoreLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import asset
import defaultMediaSvg from '../../assets/images/temp2.svg'

const props = defineProps({
  locked: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  isAuthor: {
    type: Boolean,
    default: false,
  },
  iconLocked: {
    type: String,
    default: 'icon-locked pl-2.5 pr-2.5 pt-2 pb-2',
  },
  iconUnlocked: {
    type: String,
    default: 'icon-unlocked pl-2.5 pr-2.5 pt-2 pb-2',
  },
  iconHidden: {
    type: String,
    default: 'icon-hidden text-2xl',
  },
  iconSeen: {
    type: String,
    default: 'icon-seen text-2xl',
  },
  iconAttach: {
    type: String,
    default: 'icon-attach',
  },
  copyLinkLabel: {
    type: String,
    default: 'Copy link',
  },
  copyLinkStyle: {
    type: String,
    default: 'pl-1 text-Blue font-light',
  },
  containerStyle: {
    type: String,
    default: 'shadow rounded-xl h-[380px]',
  },
  mediaSrc: {
    type: String,
    default: defaultMediaSvg, // Use imported asset
  },
  mediaMetadataType: {
    type: String,
    default: '',
  },
  hiddenMediaSrc: {
    type: String,
    default: '',
  },
  hiddenMessage: {
    type: String,
    default: '',
  },
  mediaTitle: {
    type: String,
    default: 'Nametest.jpeg',
  },
  mediaTitleStyle: {
    type: String,
    default: '',
  },
  hiddenContainerStyle: {
    type: String,
    default: '',
  },
  mediaAuthorStyle: {
    type: String,
    default: 'pl-1 italic text-sm font-extralight',
  },
  mediaAuthor: {
    type: String,
    default: '- By Lorem ipsum',
  },
  contentStyle: {
    type: String,
    default: 'text-sm font-extralight pr-1',
  },
  contentvalue: {
    type: String,
    default: '0',
  },
  contentLabel: {
    type: String,
    default: 'content using this media',
  },
  sizeStyle: {
    type: String,
    default: 'text-sm font-extralight pr-1',
  },
  sizeLabel: {
    type: String,
    default: 'Size: ',
  },
  sizeValueStyle: {
    type: String,
    default: 'text-xs text-grayText font-extralight pr-1',
  },
  sizeValue: {
    type: String,
    default: '38MB - 40MB',
  },
  withDuration: {
    type: Boolean,
    default: true,
  },
  durationStyle: {
    type: String,
    default: 'text-sm font-extralight pr-2',
  },
  durationLabel: {
    type: String,
    default: 'Duration:',
  },
  mobileLabel: {
    type: String,
    default: 'Mobile',
  },
  mobileDesktopValueStyle: {
    type: String,
    default: 'text-xs text-grayText font-extralight pr-3',
  },
  mobileDesktopLabelStyle: {
    type: String,
    default: 'text-sm font-light pr-1',
  },
  desktopLabel: {
    type: String,
    default: 'Desktop',
  },
  mobileValue: {
    type: String,
    default: '30min',
  },
  desktopValue: {
    type: String,
    default: '20min',
  },
  seeMoreStyle: {
    type: String,
    default: 'text-sm text-Blue italic font-extralight cursor-pointer',
  },
  seeMoreLabel: {
    type: String,
    default: 'see more',
  },
  mediaType: {
    type: String,
    default: '',
  },
  seeMoreClicked: {
    type: Function as PropType<(item?: any) => void>,
    default: () => {},
  },
  copyLink: {
    type: Function as PropType<(link?: any) => void>,
    default: () => {},
  },
  openMedia: {
    type: Function as PropType<(item?: any) => void>,
    default: () => {},
  },
})
</script>

<style scoped>
.bg-mediaUnLocked {
  background-color: #ddebff;
}
.bg-mediaLocked {
  background-color: #ffe5dd;
}
@media screen and (max-width: 768px) {
  .card-hidden-message-wrapper,
  .card-details-wrapper,
  .card-image-wrapper {
    width: auto !important;
  }
}
</style>
