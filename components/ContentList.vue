<template>
  <div>

    <div :class="listStyle">
      <div v-for="(content, index) in contentList" :key="index" class="mb-4 mr-8">
        <div :class="spaceBetweenStyle">
          <div class="pr-2.5">
            <img :src="content.imageSrc" alt="" :width="content.imageWidth">
          </div>
          <div class="self-center">
            <div :class="content.titleStyle">
              {{ content.title}}
            </div>
            <div class="flex">
              <div :class="content.authorNameStyle">
                {{ content.authorName }}
              </div>
              <div :class="createdOnStyle">
                {{ createdOnLabel }}
              </div>
              <div :class="content.dateStyle">
                {{ content.date }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

interface ContentItem {
  authorNameStyle?: string;
  authorName?: string;
  dateStyle?: string;
  date?: string;
  title?: string;
  titleStyle?: string;
  imageSrc?: string;
  imageWidth?: number;
}

const props = defineProps({
  listStyle: {
    type: String,
    default: 'flex flex-col items-start w-max justify-center h-600px overflow-auto'
  },
  spaceBetweenStyle: {
    type: String,
    default: 'flex pb-2'
  },
  contentList: {
    type: Array as PropType<ContentItem[]>,
    default: () => [
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        title: 'Title of content very long long long long long...',
        titleStyle: 'font-medium text-Blue text-lg',
        imageSrc: '../assets/images/temp3.png',
        imageWidth: 140
      }
    ]
  },
  createdOnStyle: {
    type: String,
    default: 'font-light pl-4'
  },
  createdOnLabel: {
    type: String,
    default: 'Created on:'
  }
});
</script>

<style scoped>

</style>
