import Card from '../src/runtime/components/media/Card.vue'
import defaultMediaSvg from '~/src/runtime/assets/images/temp2.svg'

const defaultControls = {
  locked: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  isAuthor: {
    type: Boolean,
    default: false,
  },
  iconLocked: {
    type: String,
    default: 'icon-locked pl-2.5 pr-2.5 pt-2 pb-2',
  },
  iconUnlocked: {
    type: String,
    default: 'icon-unlocked pl-2.5 pr-2.5 pt-2 pb-2',
  },
  iconHidden: {
    type: String,
    default: 'icon-hidden text-2xl',
  },
  iconSeen: {
    type: String,
    default: 'icon-seen text-2xl',
  },
  iconAttach: {
    type: String,
    default: 'icon-attach',
  },
  copyLinkLabel: {
    type: String,
    default: 'Copy link',
  },
  copyLinkStyle: {
    type: String,
    default: 'pl-1 text-Blue font-light',
  },
  containerStyle: {
    type: String,
    default: 'shadow rounded-xl h-[380px]',
  },
  mediaSrc: {
    type: String,
    default: defaultMediaSvg, // Use imported asset
  },
  hiddenMediaSrc: {
    type: String,
    default: '',
  },
  hiddenMessage: {
    type: String,
    default: '',
  },
  mediaTitle: {
    type: String,
    default: 'Nametest.jpeg',
  },
  mediaTitleStyle: {
    type: String,
    default: '',
  },
  hiddenContainerStyle: {
    type: String,
    default: '',
  },
  mediaAuthorStyle: {
    type: String,
    default: 'pl-1 italic text-sm font-extralight',
  },
  mediaAuthor: {
    type: String,
    default: '- By Lorem ipsum',
  },
  contentStyle: {
    type: String,
    default: 'text-sm font-extralight pr-1',
  },
  contentvalue: {
    type: String,
    default: '0',
  },
  contentLabel: {
    type: String,
    default: 'content using this media',
  },
  sizeStyle: {
    type: String,
    default: 'text-sm font-extralight pr-1',
  },
  sizeLabel: {
    type: String,
    default: 'Size: ',
  },
  sizeValueStyle: {
    type: String,
    default: 'text-xs text-grayText font-extralight pr-1',
  },
  sizeValue: {
    type: String,
    default: '38MB - 40MB',
  },
  withDuration: {
    type: Boolean,
    default: true,
  },
  durationStyle: {
    type: String,
    default: 'text-sm font-extralight pr-2',
  },
  durationLabel: {
    type: String,
    default: 'Duration:',
  },
  mobileLabel: {
    type: String,
    default: 'Mobile',
  },
  mobileDesktopValueStyle: {
    type: String,
    default: 'text-xs text-grayText font-extralight pr-3',
  },
  mobileDesktopLabelStyle: {
    type: String,
    default: 'text-sm font-light pr-1',
  },
  desktopLabel: {
    type: String,
    default: 'Desktop',
  },
  mobileValue: {
    type: String,
    default: '30min',
  },
  desktopValue: {
    type: String,
    default: '20min',
  },
  seeMoreStyle: {
    type: String,
    default: 'text-sm text-Blue italic font-extralight cursor-pointer',
  },
  seeMoreLabel: {
    type: String,
    default: 'see more',
  },
  mediaType: {
    type: String,
    default: '',
  },
  seeMoreClicked: {
    type: Function,
    default: () => {},
  },
  copyLink: {
    type: Function,
    default: () => {},
  },
  openMedia: {
    type: Function,
    default: () => {},
  },
}

export default {
  title: 'Components/Media/Card',
  component: Card,
  parameters: {},
  tags: ['autodocs'],
  // Define argTypes if your component has props
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

// You can also use the render function if you need more control
export const Primary = {
  args: {
    // Your args here
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: '<Card v-bind="args" />',
  }),
}
