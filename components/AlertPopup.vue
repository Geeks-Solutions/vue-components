<template>
  <div v-show="props.showPopupCode" class="fixed z-20 overflow-hidden bg-FieldGray bg-opacity-25 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="false"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="false">&amp;#8203;</span>

      <div :class="props.containerStyle">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div>
            <div class="mt-3 flex justify-between pt-1 text-center sm:mt-0 sm:ml-4 sm:text-left">

              <div class="flex w-full justify-end">
                <span :class="[props.icomoonCrossIconSrc, props.icomoonCrossIconStyle]" @click="emit('cancel')"></span>
              </div>
            </div>

            <div v-if="props.canBeDeleted" class="w-full justify-center pt-16 mb-24">
             <span :class="props.alertIcon"></span>
             <div class="flex w-full justify-center text-center">
               <div :class="props.titleDeleteStyle">
                 {{ props.titleDelete }}
               </div>
             </div>

             <div class="flex justify-center mt-14">
               <div @click.stop.prevent="emit('apply')">
                 <Buttons
                   :button-text="props.applyButtonText"
                   :button-style="props.applyButtonStyle"
                   :with-icomoon-icon="true"
                   :icomoon-icon-active-src="'icon-trashCan2'"
                   :active="true"
                 />
               </div>
               <div @click.stop.prevent="emit('cancel')">
                 <Buttons
                   :button-text="props.cancelButtonText"
                   :button-style="props.cancelButtonStyle"
                   :with-icon="false"
                 />
               </div>
             </div>

            </div>

            <div v-else class="w-full flex flex-col justify-center">
              <span :class="props.alertIcon"></span>
              <div class="flex w-full justify-center text-center">
                <div :class="props.titleNoDeleteStyle">
                  {{ props.titleNoDelete }}
                </div>
              </div>
              <div>
                <div :class="props.subTitleNoDeleteStyle">
                  {{ props.subTitleNoDelete }}
                </div>
              </div>


              <div :class="props.errorsContainerStyle">
                <div v-for="(error, index) in props.errors" :key="index" class="mb-4">
                  <div v-show="error.errorTitle" :class="error.errorTitleStyle">
                    {{ error.errorTitle}}
                  </div>
                  <div class="flex">
                    <div v-show="error.authorName" :class="error.authorNameStyle">
                      {{ error.authorName }}
                    </div>
                    <div v-show="error.date" :class="props.createdOnStyle">
                      {{ props.createdOnLabel }}
                    </div>
                    <div v-show="error.date" :class="error.dateStyle">
                      {{ error.date }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, defineProps, defineEmits } from 'vue';
import Buttons from "./Buttons.vue"; // Assurez-vous que le chemin est correct

interface ErrorItem {
  authorNameStyle?: string;
  authorName?: string;
  dateStyle?: string;
  date?: string;
  errorTitle?: string;
  errorTitleStyle?: string;
}

const props = defineProps({
  showPopupCode: {
    type: Boolean,
    default: false
  },
  canBeDeleted: {
    type: Boolean,
    default: true
  },
  errors: {
    type: Array as PropType<ErrorItem[]>,
    default: () => [
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      // ... (autres erreurs par défaut si nécessaire, mais généralement il vaut mieux passer un tableau vide par défaut)
    ]
  },
  containerStyle: {
    type: String,
    default: 'inline-block shadow-lg shadow ring-black ring-opacity-5 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:w-1/2'
  },
  errorsContainerStyle: {
    type: String,
    default: 'mt-10 mb-14 self-center h-270px overflow-y-auto'
  },
  createdOnStyle: {
    type: String,
    default: 'font-light pl-4'
  },
  createdOnLabel: {
    type: String,
    default: 'Created on:'
  },
  titleDelete: {
    type: String,
    default: 'Are you sure you want to delete this media?'
  },
  titleDeleteStyle: {
    type: String,
    default: 'text-xl font-base text-center w-220px'
  },
  titleNoDeleteStyle: {
    type: String,
    default: 'text-xl font-base text-center'
  },
  titleNoDelete: {
    type: String,
    default: 'Oops! You cannot delete this media'
  },
  subTitleNoDeleteStyle: {
    type: String,
    default: 'text-xl font-extralight text-center'
  },
  subTitleNoDelete: {
    type: String,
    default: 'because it\'s linked to the following contents:'
  },
  title: { // Note: Ces props 'title', 'titleStyle', 'description', 'descriptionStyle' ne sont pas utilisées dans le template
    type: String,
    default: ''
  },
  titleStyle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  descriptionStyle: {
    type: String,
    default: ''
  },
  alertIcon: {
    type: String,
    default: 'flex w-full icon-alert text-6xl justify-center pb-8'
  },
  icomoonCrossIconStyle: {
    type: String,
    default: 'cursor-pointer'
  },
  applyButtonText: {
    type: String,
    default: 'DELETE MEDIA'
  },
  applyButtonStyle: {
    type: String,
    default: 'text-sm text-TextGray font-semibold bg-white border border-FieldGray hover:border-Blue hover:bg-white rounded-2xl px-4 py-3 mr-2 hover:text-Blue'
  },
  cancelButtonText: {
    type: String,
    default: 'CANCEL'
  },
  cancelButtonStyle: {
    type: String,
    default: 'text-sm text-white bg-Blue hover:bg-white border hover:border-Blue rounded-2xl px-6 py-3 hover:text-Blue'
  },
  icomoonCrossIconSrc: {
    type: String,
    default: 'icon-cross'
  }
});

const emit = defineEmits(['cancel', 'apply']);

</script>

<style scoped>

</style>
