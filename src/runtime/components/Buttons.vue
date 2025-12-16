<template>
  <div>
    <button
      :type="submit ? 'submit' : ''"
      class="flex items-center justify-center"
      :class="[active ? buttonStyle : inactiveButtonStyle]"
      @click="submitFunction"
    >
      {{ buttonText }}
      <span
        v-if="withIcomoonIcon"
        :class="[
          active ? icomoonIconActiveSrc : icomoonIconInActiveSrc,
          active ? icomoonIconActiveStyle : icomoonIconInActiveStyle,
        ]"
      />
      <img
        v-else-if="withIcon"
        class="ml-2.5"
        :class="active ? iconStyle.activeIconStyle : iconStyle.inActiveIconStyle"
        :src="iconStyle.src"
        alt="rotate"
      >
    </button>
  </div>
</template>

<script setup>
// Define props using the new Vue 3 syntax
const props = defineProps({
  submitFunction: {
    type: Function,
    default: () => {},
  },
  buttonText: {
    type: String,
    default: 'Button with icon',
  },
  active: {
    type: Boolean,
    default: true,
  },
  withIcon: {
    type: Boolean,
    default: false,
  },
  submit: {
    type: Boolean,
    default: false,
  },
  withIcomoonIcon: {
    type: Boolean,
    default: false,
  },
  icomoonIconActiveSrc: {
    type: String,
    default: 'icon-rotateWhite',
  },
  icomoonIconInActiveSrc: {
    type: String,
    default: 'icon-rotate',
  },
  icomoonIconActiveStyle: {
    type: String,
    default: 'pl-2',
  },
  icomoonIconInActiveStyle: {
    type: String,
    default: 'pl-2',
  },
  buttonStyle: {
    type: String,
    default:
      'bg-Blue text-white border-Blue border hover:text-Blue px-3.5 h-53px py-3.5 rounded-xl hover:bg-white',
  },
  inactiveButtonStyle: {
    type: String,
    default:
      'bg-SmallTextGray text-white border-SmallTextGray border px-3.5 h-53px py-3.5 rounded-xl cursor-default',
  },
  iconStyle: {
    type: Object,
    default: () => ({
      activeIconStyle: '',
      inActiveIconStyle: '',
      // Use the imported asset as the default value
      src: '/images/rotate.svg',
    }),
  },
})
</script>

<style>
.grayscale {
  filter: grayscale(1);
}
</style>
