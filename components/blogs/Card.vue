<template>
  <div class="max-w-max">
    <div :class="containerStyle">

      <div class="flex p-3 justify-between items-center w-full">

        <div class="flex flex-col relative">
          <div class="flex">
            <span v-if="!published" :class="iconNotPublished"></span>
            <span v-else :class="iconPublished"></span>
          </div>
          <div v-if="scheduledPublication && isoDateInFuture(scheduledPublication)" class="absolute top-7 left-0 whitespace-nowrap scheduledFor" :class="lastUpdateStyle">
            {{ $t('dashboard.scheduledFor') }} {{ formatIsoDateTime(scheduledPublication) }}
          </div>
        </div>

        <div class="flex items-center cursor-pointer">
          <span v-if="canDelete" :class="iconDelete" @click="$emit('delete-blog')"></span>
          <div v-if="!selectedDate && (!scheduledPublication || (scheduledPublication && !isoDateInFuture(scheduledPublication)))" @click.stop.prevent="editBlog">
            <Buttons :button-text="editLabel" :button-style="editStyle" :with-icon="false" />
          </div>
          <div v-if="canSchedule" class="flex items-center cursor-pointer">
            <Schedule :edit-style="editStyle" :scheduled-publication="scheduledPublication" @schedule-publish="$emit('schedule-publish', selectedDate)" @cancel-schedule="$emit('cancel-schedule', null)" @update:date="(val) => selectedDate = val" />
          </div>
        </div>

      </div>

      <div class="w-350px" :class="canOpenBlog ? 'md:cursor-pointer' : ''" @click="openBlog">
        <div v-if="mediaSrc">
          <UniversalViewer :src="mediaSrc" :type="mediaMetadataType" class="w-full h-200px object-cover" />
        </div>
        <div v-else>
          <div class="flex w-full h-200px justify-center items-center object-cover">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-photograpg text-8xl"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap w-350px items-center pt-3 pr-3 pl-3">
        <div :class="blogTitleStyle">
          {{ blogTitle }}
        </div>
        <div :class="blogAuthorStyle">
          {{ blogAuthor }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3">
        <div :class="descriptionStyle" v-html="description"></div>
      </div>

      <div class="flex flex-col items-end pt-1 pl-3 pr-3">
        <div v-if="draftOf" :class="draftOfStyle" style="text-align: end" @click="$emit('open-original-blog')">
          {{ draftOf }}
        </div>
        <div v-if="lastUpdateDate" :class="[lastUpdateStyle, draftOf ? '' : 'pt-4']">
          {{ lastUpdateDate }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Buttons from "../Buttons.vue";
import Schedule from "./Schedule.vue";
import UniversalViewer from "../UniversalViewer.vue";
import {formatIsoDateTime, isoDateInFuture} from "../../utils/constants"

export default {
  name: "Card",
  components: {
    Buttons,
    Schedule,
    UniversalViewer
  },
  props: {
    containerStyle: {
      type: String,
      default: 'shadow rounded-xl h-410px'
    },
    published: {
      type: Boolean,
      default: false
    },
    isAuthor: {
      type: Boolean,
      default: false
    },
    iconNotPublished: {
      type: String,
      default: 'icon-hidden text-2xl'
    },
    iconPublished: {
      type: String,
      default: 'icon-seen text-2xl'
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    canOpenBlog: {
      type: Boolean,
      default: true
    },
    canSchedule: {
      type: Boolean,
      default: false
    },
    iconDelete: {
      type: String,
      default: 'icon-trashCan2 text-md'
    },
    editLabel: {
      type: String,
      default: 'EDIT CONTENT'
    },
    editStyle: {
      type: String,
      default: 'py-1.5 px-3 ml-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue'
    },
    blogTitle: {
      type: String,
      default: 'Title of blog'
    },
    blogTitleStyle: {
      type: String,
      default: 'w-200px overflow-hidden overflow-ellipsis whitespace-nowrap'
    },
    blogAuthor: {
      type: String,
      default: '- By Lorem ipsum'
    },
    blogAuthorStyle: {
      type: String,
      default: 'pl-1 italic text-sm font-extralight w-126px overflow-hidden text-ellipsis whitespace-nowrap text-end'
    },
    mediaSrc: {
      type: String,
      default: '../assets/images/temp2.svg'
    },
    mediaMetadataType: {
      type: String,
      default: ''
    },
    descriptionStyle: {
      type: String,
      default: 'text-sm font-extralight pr-1 w-350px h-60px text-ellipsis overflow-hidden'
    },
    description: {
      type: String,
      default: ''
    },
    lastUpdateStyle: {
      type: String,
      default: 'text-xs font-extralight pr-1 text-ellipsis overflow-hidden'
    },
    lastUpdateDate: {
      type: String,
      default: ''
    },
    draftOfStyle: {
      type: String,
      default: 'text-xs text-Blue underline md:cursor-pointer font-extralight w-340px text-end whitespace-nowrap pr-1 text-ellipsis overflow-hidden'
    },
    draftOf: {
      type: String,
      default: ''
    },
    deleteBlog: {
      type: Function,
      default: (item) => {}
    },
    editBlog: {
      type: Function,
      default: (item) => {}
    },
    openBlog: {
      type: Function,
      default: (item) => {}
    },
    dashboardInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    scheduledPublication: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedDate: null,
    }
  },
  methods: {
    formatIsoDateTime,
    isoDateInFuture
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
.scheduledFor {
  font-size: 8px !important;
}
</style>
