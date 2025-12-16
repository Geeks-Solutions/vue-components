import FilterSelect from '../src/runtime/components/FilterSelect.vue'

const defaultControls = {
  filterOptions: {
    type: Array,
    default() {
      return [
        {
          key: 'All',
          value: 'All',
        },
        {
          key: 'id',
          value: 'ID',
        },
        {
          key: 'name',
          value: 'Name',
        },
        {
          key: 'title',
          value: 'Title',
        },
        {
          key: 'status',
          value: 'Status',
        },
        {
          key: 'statuses',
          value: 'Statuses',
        },
        {
          key: 'role',
          value: 'Role',
        },
      ]
    },
  },

  filter_map: {
    type: Object,
    default() {
      return {
        All: { key: 'All', size: 3 },
        id: {
          title: 'ID',
          key: 'id',
          size: 5,
          type: 'text',
        },
        name: {
          title: 'Name',
          key: 'name',
          size: 5,
          type: 'text',
        },
        title: {
          title: 'Title',
          key: 'title',
          size: 5,
          type: 'text',
        },
        status: {
          title: 'Status',
          key: 'status',
          size: 5,
          type: 'text',
        },
        statuses: {
          title: 'Statuses',
          key: 'statuses',
          size: 5,
          type: 'multiSelect',
          multiSelectLabel: 'translation',
          multiSelectKey: 'key',
          multipleSelect: true,
          filterOptions: [
            {
              key: 'id',
              translation: 'ID',
            },
            {
              key: 'name',
              translation: 'Name',
            },
            {
              key: 'title',
              translation: 'Title',
            },
            {
              key: 'status',
              translation: 'Status',
            },
            {
              key: 'role',
              translation: 'Role',
            },
          ],
        },
        role: {
          title: 'Role',
          key: 'role',
          size: 5,
          type: 'text',
        },
      }
    },
  },
  filterByText: {
    type: String,
    default: 'Filter By: ',
  },
  filterContainerStyle: {
    type: String,
    default: 'md:items-end gap-4',
  },
  filterByStyle: {
    type: String,
    default: 'pt-3 pr-2',
  },
  filterSelectDefault: {
    type: String,
    default: 'Select Filter',
  },
  filterIconIcomoon: {
    type: String,
    default: 'icon-filterIcon',
  },
  filterIcon: {
    type: String,
    default: '',
  },
  filterIconStyle: {
    type: String,
    default: '',
  },
  mainFilterStyle: {
    type: String,
    default:
      'flex items-center pl-2 mr-6 md:ml-2 border border-FieldGray rounded-xl h-[49px] w-[244px] focus:outline-none mb-6',
  },
  inputStyle: {
    type: String,
    default:
      'py-4 pl-6 mr-1 border border-FieldGray rounded-xl h-[49px] md:w-[300px] w-[220px] focus:outline-none',
  },
  subFilterStyle: {
    type: String,
    default: 'pl-6 mb-6 mr-6 border border-FieldGray rounded-xl h-[49px] w-full focus:outline-none',
  },
  selectStyle: {
    type: String,
    default: 'h-35px w-180px ml-12',
  },
  multiSelectStyle: {
    type: String,
    default: 'default-select-style-chooser relative',
  },
  multiSelectPlaceholder: {
    type: String,
    default: '',
  },
  emitAll: {
    type: Boolean,
    default: false,
  },
  clearFilters: {
    type: Boolean,
    default: false,
  },
  mainFilterValue: {
    type: Object,
    default() {
      return {}
    },
  },
  mainFilterOptions: {
    type: Object,
    default() {
      return {
        selectWrapperStyle: 'w-max',
        selectStyle: 'default-select-style-chooser relative',
        labelStyle: 'text-md font-base mr-2 mb-1',
        labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
        labelInsideDefaultStyle:
          'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
        labelPaddingWithIcon: 'left-12',
        labelPadding: 'left-3',
        selectErrorClass: 'select-error-class',
        selectIconClass: 'select-icon-class',
        labelInsideClass: 'label-inside-class',
        trackBy: '',
        focused: false,
        filterDisabled: false,
        multiple: false,
        closeOnSelect: true,
        preserveSearch: false,
        preselectFirst: false,
        clearOnSelect: false,
        multipleSelection: false,
        labelOutside: true,
        mainFilter: '',
        selectPlaceholder: '',
        filterLabelProp: 'value',
        filterIconIcomoon:
          'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
        focusStyle: 'border border-Blue rounded-xl',
        focusMarginStyle: 'px-0.5 py-0.5',
        filterClearable: false,
        filterSearchable: false,
        errorOccurred: false,
        withIcon: true,
      }
    },
  },
  singleSelectFilterOptions: {
    type: Object,
    default() {
      return {
        selectLabel: '',
        selectWrapperStyle: 'w-max',
        selectStyle: 'default-select-style-chooser relative',
        labelStyle: 'text-md font-base mr-2 mb-1',
        labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
        labelInsideDefaultStyle:
          'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
        labelPaddingWithIcon: 'left-12',
        labelPadding: 'left-3',
        selectErrorClass: 'select-error-class',
        selectIconClass: 'select-icon-class',
        labelInsideClass: 'label-inside-class',
        trackBy: '',
        focused: false,
        filterDisabled: false,
        multiple: false,
        closeOnSelect: true,
        preserveSearch: false,
        preselectFirst: false,
        clearOnSelect: false,
        multipleSelection: false,
        labelOutside: true,
        mainFilter: '',
        selectPlaceholder: '',
        filterLabelProp: 'translation',
        filterIconIcomoon:
          'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
        focusStyle: 'border border-Blue rounded-xl',
        focusMarginStyle: 'px-0.5 py-0.5',
        filterClearable: false,
        filterSearchable: false,
        errorOccurred: false,
        withIcon: false,
      }
    },
  },
  multiSelectFilterOptions: {
    type: Object,
    default() {
      return {
        selectLabel: '',
        selectWrapperStyle: 'w-max',
        selectStyle: 'default-select-style-chooser relative',
        labelStyle: 'text-md font-base mr-2 mb-1',
        labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
        labelInsideDefaultStyle:
          'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
        labelPaddingWithIcon: 'left-12',
        labelPadding: 'left-3',
        selectErrorClass: 'select-error-class',
        selectIconClass: 'select-icon-class',
        labelInsideClass: 'label-inside-class',
        trackBy: '',
        focused: false,
        filterDisabled: false,
        multiple: false,
        closeOnSelect: false,
        preserveSearch: true,
        preselectFirst: true,
        clearOnSelect: false,
        multipleSelection: false,
        labelOutside: true,
        mainFilter: '',
        selectPlaceholder: '',
        filterLabelProp: 'value',
        filterIconIcomoon:
          'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
        focusStyle: 'border border-Blue rounded-xl',
        focusMarginStyle: 'px-0.5 py-0.5',
        filterClearable: false,
        filterSearchable: true,
        errorOccurred: false,
        withIcon: false,
      }
    },
  },
}

export default {
  title: 'Components/Form Components/FilterSelect',
  component: FilterSelect,
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
  render: (args) => ({
    components: { FilterSelect },
    setup() {
      return { args }
    },
    template: '<FilterSelect v-bind="args" />',
  }),
}
