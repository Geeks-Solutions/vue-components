import Buttons from '../src/runtime/components/Buttons.vue'
import rotateIcon from '../src/runtime/assets/images/rotate.svg'

const defaultControls = {
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
      src: rotateIcon,
    }),
  },
}

export default {
  component: Buttons,
  title: 'Components/Form Components/Buttons',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  components: { Buttons },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<Buttons v-bind="args" />',
})

export const Primary = Template.bind({})
