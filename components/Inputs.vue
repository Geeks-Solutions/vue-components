<template>
  <div>
    <div class="w-full relative flex items-center">
      <div :class="inputWrapper">
        <transition v-if="inputLabel" name="fade" mode="out-in">
          <div v-if="inputText !== ''" >
            <label :class="labelStyle"  class="absolute block text-xs font-bold pt-1 pl-10 pin-t pin-l w-full leading-normal" :for="placeholder">
              {{ placeholder }}
            </label>
          </div>
        </transition>
        <input
          v-if="!textArea"
          :id="placeholder"
          v-model="inputText"
          :disabled="!active"
          :type="inputType"
          step="any"
          :placeholder="requiredInput ? placeholder + '*' : placeholder"
          :autocomplete="autoComplete"
          :class="[
            overrideDefault ? inputStyle : 'py-4 pl-10 border border-FieldGray rounded-xl h-48px w-240px md:w-344px focus:outline-none',
              inputText !== '' ? inputLabel ? 'pt-8' : '' : '',
          toutAppareil || optionnel || validate ? 'pr-20' : optionalStyle,
          inputStyle
        ]"
          @keyup="validateInput"
          @keypress="$emit('onlyNumbers', $event)"
          @blur="$emit('addCharacter', $event)"
        />
        <textarea
          v-if="textArea"
          :id="placeholder"
          v-model="inputText"
          :disabled="!active"
          :type="inputType"
          :placeholder="requiredInput ? placeholder + '*' : placeholder"
          class="
          py-4
          pl-10
          border border-FieldGray
          rounded-xl
          h-48px
          w-344px
          focus:outline-none
        "
          :class="[
              inputText !== '' ? 'pt-8' : '',
          inputStyle,
          toutAppareil || optionnel || validate ? 'pr-20' : 'pr-3.5',
        ]"
          @keyup="validateInput"
        />
      </div>
      <img
        v-if="(lockIcon || phoneIcon) && (types === 'password' || types === 'phoneNumber')"
        :src="getInputIcon"
        width="20"
        alt=""
        class="absolute left-3"
      />
      <span v-else-if="types === 'password' || types === 'phoneNumber'" :class="[getInputIconIcomoon, inputIconIcomoonStyle]"></span>

      <img
        v-if="validateIcon && inputText !== '' && validate === true"
        :src="validateIcon"
        alt="check-mark"
        class="absolute left-72"
      />
      <span v-else-if="inputText !== '' && validate === true" :class="[validateIconIcomoonSrc, validateIconIcomoonStyle]"></span>


      <span v-if="eyeIconIcomoon" :class="[imgClicked ? eyeIconCrossedIcomoon : eyeIconIcomoonSrc, eyeIconStyle]" @click="showPass"></span>

      <img
        v-if="signImage && types === 'sign' && inputText !== ''"
        :src="signImage"
        alt="sign"
        width="15"
        height="15"
        class="absolute md:left-72 left-40 cursor-pointer"
      />
      <span v-else-if="types === 'sign' && inputText !== ''" :class="[signImageIcomoonSrc, signImageIcomoonStyle]"></span>

      <div v-if="toutAppareil" class="text-center flex flex-col absolute md:left-64 left-40">
        <img
          v-if="monitorIcon"
          :src="monitorIcon"
          alt="appareil"
          class="mx-auto mt-0.5 -mb-2"
        />
        <span v-else :class="[monitorIcomoonSrc, monitorIcomoonStyle]"></span>

        <span class="text-xs">{{ allDevices }}</span>
      </div>
    </div>

    <span v-if="errorTextMessage" class="text-error text-xs"
    >{{ errorTextMessage }}</span
    >

    <div v-if="toggleMobile" class="flex items-center mt-2">
      <div class="w-344px relative flex items-center">
        <input
          v-model="inputTextMobile"
          :disabled="!active"
          type="text"
          value=""
          :placeholder="placeholder"
          :class="[
            !active
              ? 'bg-BorderGray'
              : 'focus:ring-1 focus:ring-Blue focus:border-transparent',
              inputStyle,
            toutAppareil || optionnel || validate ? 'pr-20' : 'pr-3.5',
          ]"
          @keyup="validateInput()"
        />
        <img
          v-if="validateIcon && inputText !== '' && validate === true"
          :src="validateIcon"
          alt="check-mark"
          class="absolute right-4"
        />
        <span v-else-if="inputText !== '' && validate === true" :class="[validateIconIcomoonSrc, validateIconIcomoonStyle]"></span>

        <div class="text-center flex flex-col absolute right-4">
          <img
            v-if="mobileIcon"
            :src="mobileIcon"
            alt="optionnel"
            class="mx-auto mt-0.5 -mb-2"
          />
          <span v-else :class="[mobileIcomoonSrc, mobileIcomoonStyle]"></span>

          <span class="text-xs">{{ optionalHint }}</span>
        </div>
      </div>
      <img
        v-if="crossIcon"
        :src="crossIcon"
        alt="cross"
        class="ml-2 cursor-pointer"
        @click="addMobile"
      />
      <span v-else :class="[icomoonCrossIconSrc, icomoonCrossIconStyle]" @click="addMobile"></span>

    </div>
    <div
      v-if="!toggleMobile && toutAppareil"
      class="flex items-end mt-2.5"
      @click="addMobile"
    >
      <img
        v-if="mobileIcon"
        :src="mobileIcon"
        alt="mobile"
        class="mr-2.5 cursor-pointer"
      />
      <span v-else :class="[mobileIcomoonSrc, mobileIcomoonStyle]"></span>

      <span class="text-Blue text-xs cursor-pointer"
        >{{ addDevice }}</span
      >
    </div>
    <span v-if="errorTextMessageMobile" class="text-error text-xs"
    >{{ errorTextMessageMobile }}</span
    >
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

// Define props
const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: 'Placeholder Text',
  },
  eyeIcon: {
    type: Boolean,
    default: false,
  },
  toutAppareil: {
    type: Boolean,
    default: false,
  },
  monitorIcon: {
    type: String,
    default: '',
  },
  monitorIcomoonSrc: {
    type: String,
    default: 'icon-monitor',
  },
  monitorIcomoonStyle: {
    type: String,
    default: 'mx-auto mt-0.5 -mb-2 text-2xl',
  },
  mobileIcomoonSrc: {
    type: String,
    default: 'icon-appel-sur-smartphone',
  },
  mobileIcomoonStyle: {
    type: String,
    default: 'mr-2.5 cursor-pointer text-xl',
  },
  mobileIcon: {
    type: String,
    default: '',
  },
  optionnel: {
    type: Boolean,
    default: false,
  },
  allDevices: {
    type: String,
    default: 'tout appareil',
  },
  optionalHint: {
    type: String,
    default: '(optionnel)',
  },
  addDevice: {
    type: String,
    default: 'Ajouter un contenu pour mobile',
  },
  errorTextMessage: {
    type: String,
    default: '',
  },
  errorTextMessageMobile: {
    type: String,
    default: '',
  },
  types: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  requiredInput: {
    type: Boolean,
    default: false
  },
  inputStyle: {
    type: String,
    default: 'py-4 pl-10 border border-FieldGray rounded-xl h-48px w-240px md:w-344px focus:outline-none'
  },
  optionalStyle: {
    type: String,
    default: 'pr-3.5'
  },
  inputModel: {
    type: String,
    default: ''
  },
  inputMobileModel: {
    type: String,
    default: ''
  },
  inputWrapper: {
    type: String,
    default: ''
  },
  textArea: {
    type: Boolean,
    default: false
  },
  inputLabel: {
    type: Boolean,
    default: true
  },
  overrideDefault: {
    type: Boolean,
    default: false
  },
  signImage: {
    type: String,
    default: ''
  },
  signImageIcomoonSrc: {
    type: String,
    default: 'icon-check-mark-blue'
  },
  signImageIcomoonStyle: {
    type: String,
    default: 'absolute md:left-72 left-40'
  },
  labelStyle: {
    type: String,
    default: 'text-Blue'
  },
  eyeIconStyle: {
    type: String,
    default: 'absolute md:left-64 left-40 cursor-pointer text-2xl'
  },
  eyeIconIcomoon: {
    type: Boolean,
    default: false
  },
  eyeIconCrossedIcomoon: {
    type: String,
    default: 'icon-eyeCrossed'
  },
  eyeIconIcomoonSrc: {
    type: String,
    default: 'icon-eye'
  },
  validate: {
    type: Boolean,
    default: false
  },
  lockIcon: {
    type: String,
    default: ''
  },
  phoneIcon: {
    type: String,
    default: ''
  },
  lockIconIcomoon: {
    type: String,
    default: 'icon-lock'
  },
  phoneIconIcomoon: {
    type: String,
    default: 'icon-appel-sur-smartphone'
  },
  inputIconIcomoonStyle: {
    type: String,
    default: 'absolute left-3'
  },
  validateIcon: {
    type: String,
    default: ''
  },
  validateIconIcomoonSrc: {
    type: String,
    default: 'icon-check-mark-blue'
  },
  validateIconIcomoonStyle: {
    type: String,
    default: 'absolute md:left-72 left-40'
  },
  icomoonCrossIconStyle: {
    type: String,
    default: 'pl-4 cursor-pointer'
  },
  icomoonCrossIconSrc: {
    type: String,
    default: 'icon-cross'
  },
  crossIcon: {
    type: String,
    default: ''
  },
  autoComplete: {
    type: String,
    default: 'on'
  }
})

// Define emits
const emit = defineEmits(['input', 'inputMobile', 'childToParent', 'onlyNumbers', 'addCharacter'])

// Reactive state
const inputText = ref(props.inputModel)
const inputTextMobile = ref(props.inputMobileModel)
const error = ref(props.errorMessage)
const toggleMobile = ref(props.optionnel)
const passwordShown = ref(false)
const imgClicked = ref(false)
const password = ref('password')

// Computed properties
const inputType = computed(() => {
  switch(props.types) {
    case "password":
      return (password.value && !passwordShown.value ? 'password' : 'text')
    case "phoneNumber":
      return 'text'
    case "amount":
      return 'number'
    default:
      return 'text'
  }
})

const getInputIcon = computed(() => {
  switch(props.types) {
    case "password":
      return props.lockIcon
    case "phoneNumber":
      return props.phoneIcon
    default:
      return ''
  }
})

const getInputIconIcomoon = computed(() => {
  switch(props.types) {
    case "password":
      return props.lockIconIcomoon
    case "phoneNumber":
      return props.phoneIconIcomoon
    default:
      return ''
  }
})

// Watch for changes
watch(inputText, (value) => {
  emit('input', value)
})

watch(() => props.inputModel, (val) => {
  inputText.value = val
})

watch(inputTextMobile, (value) => {
  emit('inputMobile', value)
})

watch(() => props.inputMobileModel, (val) => {
  inputTextMobile.value = val
})

watch(() => props.optionnel, () => {
  toggleMobile.value = props.optionnel
})

// Methods
const onlyNumber = ($event) => {
  const keyCode = ($event.keyCode ? $event.keyCode : $event.which)
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault()
  }
}

const validateInput = () => {
  if(props.requiredInput === true) {
    emit('childToParent', inputText.value)
    if (inputText.value !== '') {
      error.value = false
    } else error.value = inputText.value === ''
  }
}

const addMobile = () => {
  emit('inputMobile', '')
  toggleMobile.value = !toggleMobile.value
}

const showPass = () => {
  imgClicked.value = !imgClicked.value
  passwordShown.value = !passwordShown.value
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to
  /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
