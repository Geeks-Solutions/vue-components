<template>
  <div class="relative inline-block">
    <div class="flex items-center">

      <div v-if="withScheduledFor && scheduledPublication && isoDateInFuture(scheduledPublication)" :class="'ml-3 cursor-default'">
        {{ $t('dashboard.scheduledFor') }} {{ formatIsoDateTime(scheduledPublication) }}
      </div>

      <div v-if="selectedDate || (scheduledPublication && isoDateInFuture(scheduledPublication))" @click.stop.prevent="scheduledPublication ? $emit('cancel-schedule') : $emit('schedule-publish')">
        <Buttons :button-text="scheduledPublication ? $t('dashboard.cancelSchedulePublish') : $t('dashboard.schedulePublish')" :button-style="editStyle" :with-icon="false" />
      </div>
      <!-- Alarm icon -->
      <span v-if="!scheduledPublication || (scheduledPublication && !isoDateInFuture(scheduledPublication))" @click="toggleMenu" class="cursor-pointer">
      <img
        src="../../assets/images/alarm.svg"
        alt=""
        class="ml-2"
        style="width: 22px; height: 22px;"
      />
    </span>
    </div>

    <!-- Menu -->
    <div
      v-if="showMenu"
      class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border rounded shadow p-2 z-50 flex items-center space-x-1"
    >
      <input
        type="datetime-local"
        class="border rounded px-2 py-1"
        v-model="selectedDate"
        :min="today"
        @change="emitDate"
      />
      <button
        v-if="selectedDate"
        @click="clearDate"
        class="text-gray-500 hover:text-gray-800 font-bold px-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script>
import Buttons from "../Buttons.vue";
import {isoDateInFuture, formatIsoDateTime} from "../../utils/constants"

export default {
  props: {
    editStyle: {
      type: String,
      default: 'py-1.5 px-3 ml-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue'
    },
    scheduledPublication: {
      type: String,
      default: ''
    },
    withScheduledFor: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Buttons
  },
  data() {
    return {
      showMenu: false,
      selectedDate: null,
      today: this.formatDateTime(new Date())
    };
  },
  methods: {
    formatDateTime(date) {
      // Format as yyyy-MM-ddTHH:mm for datetime-local input
      const d = new Date(date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    emitDate() {
      this.$emit('update:date', this.selectedDate);
      // Optional: close menu after picking a date
      // this.showMenu = false;
    },
    clearDate() {
      this.selectedDate = null;
      this.$emit('update:date', null);
    },
    isoDateInFuture,
    formatIsoDateTime
  }
}
</script>
