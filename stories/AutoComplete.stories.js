import AutoComplete from '../src/runtime/components/AutoComplete.vue'

const defaultControls = {
  filterOptions: {
    type: Array,
    default: () => [
      {
        key: 'All',
        value: 'All',
      },
      {
        key: 'id',
        value: 'id',
      },
      {
        key: 'name',
        value: 'name',
      },
      {
        key: 'title',
        value: 'title',
      },
      {
        key: 'status',
        value: 'status',
      },
      {
        key: 'role',
        value: 'role',
      },
    ],
  },
  selectWrapperStyle: {
    type: String,
    default: 'w-max',
  },
  selectLabel: {
    type: String,
    default: '',
  },
  selectStyle: {
    type: String,
    default: 'default-select-style-chooser relative',
  },
  labelStyle: {
    type: String,
    default: 'text-md font-base mr-2 mb-1',
  },
  labelInsideStyle: {
    type: String,
    default: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
  },
  labelInsideDefaultStyle: {
    type: String,
    default: 'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
  },
  labelPaddingWithIcon: {
    type: String,
    default: 'left-12',
  },
  labelPadding: {
    type: String,
    default: 'left-3',
  },
  selectErrorClass: {
    type: String,
    default: 'select-error-class',
  },
  selectIconClass: {
    type: String,
    default: 'select-icon-class',
  },
  labelInsideClass: {
    type: String,
    default: 'label-inside-class',
  },
  trackBy: {
    type: String,
    default: '',
  },
  focused: {
    type: Boolean,
    default: false,
  },
  filterDisabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  closeOnSelect: {
    type: Boolean,
    default: true,
  },
  preserveSearch: {
    type: Boolean,
    default: false,
  },
  preselectFirst: {
    type: Boolean,
    default: false,
  },
  clearOnSelect: {
    type: Boolean,
    default: false,
  },
  multipleSelection: {
    type: Boolean,
    default: false,
  },
  reduce: {
    type: Function,
    default: (val) => val,
  },
  labelOutside: {
    type: Boolean,
    default: true,
  },
  mainFilter: {
    type: Object,
    default: null,
  },
  selectPlaceholder: {
    type: String,
    default: '',
  },
  filterLabelProp: {
    type: String,
    default: 'value',
  },
  filterIconIcomoon: {
    type: String,
    default: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
  },
  focusStyle: {
    type: String,
    default: 'border border-Blue rounded-xl',
  },
  focusMarginStyle: {
    type: String,
    default: 'px-0.5 py-0.5',
  },
  filterClearable: {
    type: Boolean,
    default: false,
  },
  filterSearchable: {
    type: Boolean,
    default: true,
  },
  errorOccurred: {
    type: Boolean,
    default: false,
  },
  withIcon: {
    type: Boolean,
    default: false,
  },
}

export default {
  component: AutoComplete,
  title: 'Components/Form Components/AutoComplete',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  components: { AutoComplete },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<AutoComplete v-bind="args" />',
})

export const Primary = Template.bind({})
