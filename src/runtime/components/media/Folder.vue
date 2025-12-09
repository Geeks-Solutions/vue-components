<template>
  <div class="cursor-pointer max-w-max" @click="props.folderClicked">
    <div class="relative">
      <div>
        <span :class="props.isSelected ? 'icon-folder' : 'icon-folderGrey'" :style="props.folderStyle"></span>
      </div>
      <div :class="props.containerStyle">
        <div class="flex">
          <!-- Iterate over a slice of the medias array -->
          <div v-for="(media, i) in props.medias.slice(0, props.mediasNumber)" :key="i">
            <!-- Display document icon if media type is not image -->
            <div v-if="media.type && !media.type.includes('image')" :class="[props.mediaStyle, props.documentClass]" :style="props.documentStyle">
              <span class="icon-mediaDocument text-xl"></span>
            </div>
            <!-- Display image otherwise -->
            <div v-else>
              <LazyGUniversalViewer :src="media.url" :width="props.mediasWidth" :height="props.mediasHeight" :type="media.type" :class="props.mediaStyle" />
            </div>
          </div>
          <div class="self-end">...</div>
        </div>

        <div :class="props.categoryStyle">
          {{ props.categoryLabel }}
        </div>

        <div class="flex items-center pt-2 pl-3">
          <span v-if="!props.all" :class="props.categoryIcon"></span>
          <div :class="!props.all ? props.categoryValueStyle : props.allStyle">
            {{ !props.all ? props.categoryValue : props.allText }}
          </div>
        </div>

        <div :class="props.totalStyle">
          <div>
            {{ props.totalLabel }}
          </div>
          <div class="pl-1">
            {{ props.totalValue }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the default asset
import defaultMediaImage from '../../assets/images/temp1.png';

// Define the structure for a media item within the medias array prop
interface MediaItem {
  url: string;
  type?: string; // Optional type property
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  medias: {
    type: Array as PropType<MediaItem[]>,
    // Use the imported asset in the default value factory function
    default: () => [
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
    ]
  },
  mediasNumber: {
    type: Number,
    default: 5
  },
  categoryLabel: {
    type: String,
    default: 'CATEGORY:'
  },
  categoryStyle: {
    type: String,
    default: 'pt-3 pl-3 text-xs text-mediaGrey font-medium'
  },
  categoryValue: {
    type: String,
    default: 'IMAGES'
  },
  categoryValueStyle: {
    type: String,
    default: 'text-sm text-mediaGrey font-medium'
  },
  categoryIcon: {
    type: String,
    default: 'icon-images pr-2'
  },
  allText: {
    type: String,
    default: 'ALL'
  },
  totalLabel: {
    type: String,
    default: 'Total: '
  },
  totalValue: {
    type: String,
    default: '67'
  },
  totalStyle: {
    type: String,
    default: 'flex font-light items-center pt-1 pl-3 text-xs'
  },
  folderStyle: {
    type: String,
    default: 'font-size: 165px' // Consider moving to CSS class if possible
  },
  mediasWidth: {
    type: String,
    default: '38'
  },
  mediasHeight: {
    type: String,
    default: '38'
  },
  mediaStyle: {
    type: String,
    default: 'rounded-full ml-2'
  },
  documentClass: {
    type: String,
    default: 'flex justify-center items-center'
  },
  documentStyle: {
    type: String,
    default: 'background: #61035B' // Consider moving to CSS class if possible
  },
  allStyle: {
    type: String,
    default: 'text-xl text-Blue font-medium'
  },
  containerStyle: {
    type: String,
    default: 'absolute top-12 left-1'
  },
  all: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  folderClicked: {
    type: Function as PropType<(folder?: any) => void>, // Added type safety for the function prop
    default: () => {}
  }
});

</script>

<style scoped>
.text-mediaGrey {
  color: #6E6E6E;
}
</style>
