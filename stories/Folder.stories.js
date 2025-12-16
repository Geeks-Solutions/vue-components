import Folder from '../src/runtime/components/media/Folder.vue'
import temp1 from '../src/runtime/assets/images/temp1.png'
import defaultMediaImage from '~/src/runtime/assets/images/temp1.png'

const defaultControls = {
  loading: {
    type: Boolean,
    default: false,
  },
  medias: {
    type: Array,
    // Use the imported asset in the default value factory function
    default: () => [
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
      { url: defaultMediaImage },
    ],
  },
  mediasNumber: {
    type: Number,
    default: 5,
  },
  categoryLabel: {
    type: String,
    default: 'CATEGORY:',
  },
  categoryStyle: {
    type: String,
    default: 'pt-3 pl-3 text-xs text-mediaGrey font-medium',
  },
  categoryValue: {
    type: String,
    default: 'IMAGES',
  },
  categoryValueStyle: {
    type: String,
    default: 'text-sm text-mediaGrey font-medium',
  },
  categoryIcon: {
    type: String,
    default: 'icon-images pr-2',
  },
  allText: {
    type: String,
    default: 'ALL',
  },
  totalLabel: {
    type: String,
    default: 'Total: ',
  },
  totalValue: {
    type: String,
    default: '67',
  },
  totalStyle: {
    type: String,
    default: 'flex font-light items-center pt-1 pl-3 text-xs',
  },
  folderStyle: {
    type: String,
    default: 'font-size: 165px', // Consider moving to CSS class if possible
  },
  mediasWidth: {
    type: String,
    default: '38',
  },
  mediasHeight: {
    type: String,
    default: '38',
  },
  mediaStyle: {
    type: String,
    default: 'rounded-full ml-2',
  },
  documentClass: {
    type: String,
    default: 'flex justify-center items-center',
  },
  documentStyle: {
    type: String,
    default: 'background: #61035B', // Consider moving to CSS class if possible
  },
  allStyle: {
    type: String,
    default: 'text-xl text-Blue font-medium',
  },
  containerStyle: {
    type: String,
    default: 'absolute top-12 left-1',
  },
  all: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  folderClicked: {
    type: Function, // Added type safety for the function prop
    default: () => {},
  },
}

export default {
  component: Folder,
  title: 'Components/Media/Folder',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  components: { Folder },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<Folder v-bind="args" />',
})

export const Primary = Template.bind({})
