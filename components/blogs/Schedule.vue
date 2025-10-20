<template>
  <div class="relative inline-block">
    <div class="flex items-center">
      <div class="relative">
        <!-- Button for scheduled items -->
        <div
          v-if="selectedDate || (scheduledPublication && isoDateInFuture(scheduledPublication))"
          @click.stop.prevent="scheduledPublication ? withScheduledFor ? null : $emit('cancel-schedule') : schedulePublish()"
        >
          <Buttons
            :button-text="scheduledPublication && isoDateInFuture(scheduledPublication)
              ? withScheduledFor
                ? `${$t('dashboard.scheduledFor')} ${formatIsoDateTime(scheduledPublication)}`
                : $t('dashboard.cancelSchedulePublish')
              : `${$t('dashboard.schedulePublish')} ${$t('dashboard.on')} ${formatIsoDateTime(selectedDate)}`"
            :button-style="!withScheduledFor && (selectedDate || (scheduledPublication && isoDateInFuture(scheduledPublication))) ? scheduledDateEditStyle : editStyle"
            :with-icon="false"
          />
        </div>

        <!-- Alarm icon -->
        <div
          v-if="!selectedDate && (!scheduledPublication || (scheduledPublication && !isoDateInFuture(scheduledPublication)))"
          class="cursor-pointer relative inline-block"
          :class="[{'absolute top-3 right-4': selectedDate && withScheduledFor}, {'absolute top-2 right-2': selectedDate && !withScheduledFor}]"
        >
          <img
            src="../../assets/images/alarm.svg"
            alt="calendar"
            style="width: 22px; height: 22px;"
          />

        </div>

        <!-- Cancel icon -->
        <span
          v-else
          @click="(!scheduledPublication || (scheduledPublication && !isoDateInFuture(scheduledPublication))) ? clearDate() : $emit('cancel-schedule')"
          class="cursor-pointer text-xl text-error"
          :class="[{'absolute top-2 right-5': withScheduledFor}, {'absolute top-1 right-2': !withScheduledFor}]"
        >
          <IconsCross color="#E81C4F" style="width: 18px;" />
        </span>

        <!-- Invisible input perfectly over the icon -->
        <input
          type="datetime-local"
          v-model="selectedDate"
          :min="today"
          @input="emitDate"
          class="absolute opacity-0 left-0 cursor-pointer datetime-schedule"
          style="width: 22px; height: 46px;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Buttons from "../Buttons.vue";
import IconsCross from "../icons/cross.vue";
import { isoDateInFuture, formatIsoDateTime } from "../../utils/constants";

export default {
  props: {
    editStyle: {
      type: String,
      default:
        "py-1.5 px-3 ml-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
    },
    scheduledDateEditStyle: {
      type: String,
      default:
        "py-1.5 px-12 ml-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue date-btn-schedule",
    },
    scheduledPublication: {
      type: String,
      default: "",
    },
    withScheduledFor: {
      type: Boolean,
      default: false,
    },
  },
  components: { Buttons, IconsCross },
  watch: {
    scheduledPublication() {
      if (this.scheduledPublication && this.isoDateInFuture(this.scheduledPublication)) {
        this.selectedDate = null
      }
    }
  },
  data() {
    return {
      selectedDate: null,
      today: this.formatDateTime(new Date()),
    };
  },
  methods: {
    formatDateTime(date) {
      const d = new Date(date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    },
    emitDate() {
      this.$emit("update:date", this.selectedDate);
    },
    clearDate() {
      this.selectedDate = null
      this.$emit("update:date", this.selectedDate);
    },
    schedulePublish() {
      this.$emit('schedule-publish')
    },
    isoDateInFuture,
    formatIsoDateTime,
  }
};
</script>

<style>
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
.datetime-schedule {
  top: -14px;
}
.date-btn-schedule {
  font-size: 10px !important;
  width: 280px !important;
}
</style>
