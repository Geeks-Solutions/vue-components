import AlertPopup from '../src/runtime/components/AlertPopup.vue'

const defaultControls = {
  showPopupCode: {
    type: Boolean,
    default: false,
  },
  canBeDeleted: {
    type: Boolean,
    default: true,
  },
  errors: {
    type: Array,
    default: () => [
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
      {
        authorNameStyle: 'italic text-TextGray pr-4 border-r h-20px',
        authorName: 'By Name of author',
        dateStyle: 'italic text-TextGray pl-2',
        date: '18 March 2020',
        errorTitle: 'Title of content very long long long long long...',
        errorTitleStyle: 'font-medium text-Blue text-lg',
      },
    ],
  },
  containerStyle: {
    type: String,
    default:
      'inline-block shadow-lg shadow ring-black ring-opacity-5 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:w-1/2',
  },
  errorsContainerStyle: {
    type: String,
    default: 'mt-10 mb-14 self-center h-[270px] overflow-y-auto',
  },
  createdOnStyle: {
    type: String,
    default: 'font-light pl-4',
  },
  createdOnLabel: {
    type: String,
    default: 'Created on:',
  },
  titleDelete: {
    type: String,
    default: 'Are you sure you want to delete this media?',
  },
  titleDeleteStyle: {
    type: String,
    default: 'text-xl font-base text-center w-220px',
  },
  titleNoDeleteStyle: {
    type: String,
    default: 'text-xl font-base text-center',
  },
  titleNoDelete: {
    type: String,
    default: 'Oops! You cannot delete this media',
  },
  subTitleNoDeleteStyle: {
    type: String,
    default: 'text-xl font-extralight text-center',
  },
  subTitleNoDelete: {
    type: String,
    default: "because it's linked to the following contents:",
  },
  title: {
    // Note: Ces props 'title', 'titleStyle', 'description', 'descriptionStyle' ne sont pas utilisées dans le template
    type: String,
    default: '',
  },
  titleStyle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  descriptionStyle: {
    type: String,
    default: '',
  },
  alertIcon: {
    type: String,
    default: 'flex w-full icon-alert text-6xl justify-center pb-8',
  },
  icomoonCrossIconStyle: {
    type: String,
    default: 'cursor-pointer',
  },
  applyButtonText: {
    type: String,
    default: 'DELETE MEDIA',
  },
  applyButtonStyle: {
    type: String,
    default:
      'text-sm text-TextGray font-semibold bg-white border border-FieldGray hover:border-Blue hover:bg-white rounded-2xl px-4 py-3 mr-2 hover:text-Blue',
  },
  cancelButtonText: {
    type: String,
    default: 'CANCEL',
  },
  cancelButtonStyle: {
    type: String,
    default:
      'text-sm text-white bg-Blue hover:bg-white border hover:border-Blue rounded-2xl px-6 py-3 hover:text-Blue',
  },
  icomoonCrossIconSrc: {
    type: String,
    default: 'icon-cross',
  },
}

export default {
  component: AlertPopup,
  title: 'Components/Media/AlertPopup',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  components: { AlertPopup },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<AlertPopup v-bind="args" />',
})

export const Primary = Template.bind({})
