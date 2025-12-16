<template>
  <div>
    <div class="flex flex-col sm:flex-row" :class="props.filterContainerStyle">
      <div class="flex-col self-start sm:self-end">
        <LazyGAutoComplete
          :main-filter="mainFilter"
          :select-label="props.filterByText"
          :reduce="
            (val) => {
              return val['key']
            }
          "
          :filter-options="props.filterOptions"
          :select-wrapper-style="props.mainFilterOptions.selectWrapperStyle"
          :select-style="props.mainFilterOptions.selectStyle"
          :label-style="props.mainFilterOptions.labelStyle"
          :label-inside-style="props.mainFilterOptions.labelInsideStyle"
          :label-inside-default-style="props.mainFilterOptions.labelInsideDefaultStyle"
          :label-padding-with-icon="props.mainFilterOptions.labelPaddingWithIcon"
          :label-padding="props.mainFilterOptions.labelPadding"
          :select-error-class="props.mainFilterOptions.selectErrorClass"
          :select-icon-class="props.mainFilterOptions.selectIconClass"
          :label-inside-class="props.mainFilterOptions.labelInsideClass"
          :track-by="props.mainFilterOptions.trackBy"
          :focused="props.mainFilterOptions.focused"
          :filter-disabled="filter_val[mainFilter] ? true : props.mainFilterOptions.filterDisabled"
          :multiple="props.mainFilterOptions.multiple"
          :close-on-select="props.mainFilterOptions.closeOnSelect"
          :preserve-search="props.mainFilterOptions.preserveSearch"
          :preselect-first="props.mainFilterOptions.preselectFirst"
          :clear-on-select="props.mainFilterOptions.clearOnSelect"
          :multiple-selection="props.mainFilterOptions.multipleSelection"
          :label-outside="props.mainFilterOptions.labelOutside"
          :select-placeholder="props.mainFilterOptions.selectPlaceholder"
          :filter-label-prop="props.mainFilterOptions.filterLabelProp"
          :filter-icon-icomoon="props.mainFilterOptions.filterIconIcomoon"
          :focus-style="props.mainFilterOptions.focusStyle"
          :focus-margin-style="props.mainFilterOptions.focusMarginStyle"
          :filter-clearable="props.mainFilterOptions.filterClearable"
          :filter-searchable="props.mainFilterOptions.filterSearchable"
          :error-occurred="props.mainFilterOptions.errorOccurred"
          :with-icon="props.mainFilterOptions.withIcon"
          @item-selected="
            (item) => {
              emitFilter(item)
            }
          "
        />
      </div>
      <div class="flex-col self-start sm:self-end">
        <div v-if="props.filter_map[mainFilter].type === 'text'">
          <input
            v-model="filter_val[mainFilter]"
            type="text"
            :placeholder="
              props.filter_map[mainFilter].placeholder
                ? props.filter_map[mainFilter].placeholder
                : capitalize(props.filter_map[mainFilter].title)
            "
            :class="props.inputStyle"
            @input="emitFilter()"
          >
          <div
            v-if="props.filter_map[mainFilter].description"
            :class="
              props.filter_map[mainFilter].descriptionStyle
                ? props.filter_map[mainFilter].descriptionStyle
                : ''
            "
          >
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filter_map[mainFilter].type === 'select'">
          <LazyGAutoComplete
            :main-filter="filter_val[mainFilter]"
            :reduce="
              (val) => {
                return val['key']
              }
            "
            :filter-options="props.filter_map[mainFilter].options"
            :select-label="props.singleSelectFilterOptions.selectLabel"
            :select-wrapper-style="props.singleSelectFilterOptions.selectWrapperStyle"
            :select-style="props.singleSelectFilterOptions.selectStyle"
            :label-style="props.singleSelectFilterOptions.labelStyle"
            :label-inside-style="props.singleSelectFilterOptions.labelInsideStyle"
            :label-inside-default-style="props.singleSelectFilterOptions.labelInsideDefaultStyle"
            :label-padding-with-icon="props.singleSelectFilterOptions.labelPaddingWithIcon"
            :label-padding="props.singleSelectFilterOptions.labelPadding"
            :select-error-class="props.singleSelectFilterOptions.selectErrorClass"
            :select-icon-class="props.singleSelectFilterOptions.selectIconClass"
            :label-inside-class="props.singleSelectFilterOptions.labelInsideClass"
            :track-by="props.singleSelectFilterOptions.trackBy"
            :focused="props.singleSelectFilterOptions.focused"
            :filter-disabled="props.singleSelectFilterOptions.filterDisabled"
            :multiple="props.singleSelectFilterOptions.multiple"
            :close-on-select="props.singleSelectFilterOptions.closeOnSelect"
            :preserve-search="props.singleSelectFilterOptions.preserveSearch"
            :preselect-first="props.singleSelectFilterOptions.preselectFirst"
            :clear-on-select="props.singleSelectFilterOptions.clearOnSelect"
            :multiple-selection="props.singleSelectFilterOptions.multipleSelection"
            :label-outside="props.singleSelectFilterOptions.labelOutside"
            :select-placeholder="
              props.filter_map[mainFilter].selectPlaceholder
                ? props.filter_map[mainFilter].selectPlaceholder
                : props.singleSelectFilterOptions.selectPlaceholder
            "
            :filter-label-prop="props.singleSelectFilterOptions.filterLabelProp"
            :filter-icon-icomoon="props.singleSelectFilterOptions.filterIconIcomoon"
            :focus-style="props.singleSelectFilterOptions.focusStyle"
            :focus-margin-style="props.singleSelectFilterOptions.focusMarginStyle"
            :filter-clearable="props.singleSelectFilterOptions.filterClearable"
            :filter-searchable="props.singleSelectFilterOptions.filterSearchable"
            :error-occurred="props.singleSelectFilterOptions.errorOccurred"
            :with-icon="props.singleSelectFilterOptions.withIcon"
            @item-selected="
              (item) => {
                updateFilterValue(item)
                props.emitAll ? emitFilter() : emit('getFilter', updateFilter())
              }
            "
          />
          <div
            v-if="props.filter_map[mainFilter].description"
            :class="
              props.filter_map[mainFilter].descriptionStyle
                ? props.filter_map[mainFilter].descriptionStyle
                : ''
            "
          >
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filter_map[mainFilter].type === 'multiSelect'">
          <LazyGAutoComplete
            :select-style="props.multiSelectStyle"
            :main-filter="filter_val[mainFilter]"
            :select-placeholder="
              props.filter_map[mainFilter].selectPlaceholder
                ? props.filter_map[mainFilter].selectPlaceholder
                : props.multiSelectPlaceholder
            "
            :filter-label-prop="props.filter_map[mainFilter].multiSelectLabel"
            :reduce="
              props.filter_map[mainFilter].multipleSelect === false
                ? (val) => val[props.filter_map[mainFilter].multiSelectLabel]
                : (val) => val
            "
            :filter-options="props.filter_map[mainFilter].filterOptions"
            :multiple="props.filter_map[mainFilter].multipleSelect === false ? false : true"
            :track-by="props.filter_map[mainFilter].multiSelectKey"
            :select-label="props.multiSelectFilterOptions.selectLabel"
            :select-wrapper-style="props.multiSelectFilterOptions.selectWrapperStyle"
            :select-style="props.multiSelectFilterOptions.selectStyle"
            :label-style="props.multiSelectFilterOptions.labelStyle"
            :label-inside-style="props.multiSelectFilterOptions.labelInsideStyle"
            :label-inside-default-style="props.multiSelectFilterOptions.labelInsideDefaultStyle"
            :label-padding-with-icon="props.multiSelectFilterOptions.labelPaddingWithIcon"
            :label-padding="props.multiSelectFilterOptions.labelPadding"
            :select-error-class="props.multiSelectFilterOptions.selectErrorClass"
            :select-icon-class="props.multiSelectFilterOptions.selectIconClass"
            :label-inside-class="props.multiSelectFilterOptions.labelInsideClass"
            :track-by="props.multiSelectFilterOptions.trackBy"
            :focused="props.multiSelectFilterOptions.focused"
            :filter-disabled="props.multiSelectFilterOptions.filterDisabled"
            :close-on-select="props.multiSelectFilterOptions.closeOnSelect"
            :preserve-search="props.multiSelectFilterOptions.preserveSearch"
            :preselect-first="props.multiSelectFilterOptions.preselectFirst"
            :clear-on-select="props.multiSelectFilterOptions.clearOnSelect"
            :multiple-selection="props.multiSelectFilterOptions.multipleSelection"
            :label-outside="props.multiSelectFilterOptions.labelOutside"
            :filter-icon-icomoon="props.multiSelectFilterOptions.filterIconIcomoon"
            :focus-style="props.multiSelectFilterOptions.focusStyle"
            :focus-margin-style="props.multiSelectFilterOptions.focusMarginStyle"
            :filter-clearable="props.multiSelectFilterOptions.filterClearable"
            :filter-searchable="props.multiSelectFilterOptions.filterSearchable"
            :error-occurred="props.multiSelectFilterOptions.errorOccurred"
            :with-icon="props.multiSelectFilterOptions.withIcon"
            @item-selected="
              (item) => {
                updateFilterValue(item)
                emit('getFilter', updateFilter())
                emit('itemsSelected', filter_val[mainFilter])
              }
            "
          />
          <div
            v-if="props.filter_map[mainFilter].description"
            :class="
              props.filter_map[mainFilter].descriptionStyle
                ? props.filter_map[mainFilter].descriptionStyle
                : ''
            "
          >
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div
          v-if="props.filter_map[mainFilter].type === 'range'"
          class="flex flex-col md:flex-row gap-4 md:gap-0"
        >
          <div>
            <input
              v-model="filter_val[props.filter_map[mainFilter].key1]"
              type="text"
              :placeholder="capitalize(props.filter_map[mainFilter].subTitle1)"
              :class="props.inputStyle"
              @input="emitFilter()"
            >
            <div
              v-if="props.filter_map[mainFilter].description1"
              :class="
                props.filter_map[mainFilter].descriptionStyle1
                  ? props.filter_map[mainFilter].descriptionStyle1
                  : ''
              "
            >
              {{ props.filter_map[mainFilter].description1 }}
            </div>
          </div>
          <div>
            <input
              v-model="filter_val[props.filter_map[mainFilter].key2]"
              type="text"
              :placeholder="capitalize(props.filter_map[mainFilter].subTitle2)"
              :class="props.inputStyle"
              @input="emitFilter()"
            >
            <div
              v-if="props.filter_map[mainFilter].description2"
              :class="
                props.filter_map[mainFilter].descriptionStyle2
                  ? props.filter_map[mainFilter].descriptionStyle2
                  : ''
              "
            >
              {{ props.filter_map[mainFilter].description2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, watchEffect } from '#imports'

const props = defineProps({
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
  // eslint-disable-next-line vue/prop-name-casing
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
})

const emit = defineEmits(['getFilter', 'removeFilter'])

// Reactive state
const filters = ref([{ value: '' }])
const selectedType = ref('')
const mainFilter = ref('All')
const filter_val = ref({})
const value2 = ref('')
const toggleValue = ref('')

const capitalize = (value) => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Watchers
watch(
  () => props.clearFilters,
  () => {
    mainFilter.value = 'All'
    filter_val.value = {}
  }
)

watch(
  () => props.mainFilterValue,
  (newValue) => {
    if (
      newValue.key &&
      newValue.value &&
      newValue.key !== '' &&
      !newValue.value.includes('undefined')
    ) {
      if (!newValue.key.includes('-/-')) {
        nextTick(() => {
          mainFilter.value = newValue.key
          filter_val.value[mainFilter.value] = newValue.value
        })
      }
    }
  },
  { deep: true, immediate: true }
)

// Methods
const remove_filter = () => {
  mainFilter.value = 'All'
  emit('removeFilter')
}

const updateFilter = () => {
  return props.filter_map[mainFilter.value].type &&
    props.filter_map[mainFilter.value].type === 'range'
    ? {
        key:
          props.filter_map[mainFilter.value].key1 + '-/-' + props.filter_map[mainFilter.value].key2,
        value:
          filter_val.value[props.filter_map[mainFilter.value].key1] +
          '-/-' +
          filter_val.value[props.filter_map[mainFilter.value].key2],
        title:
          props.filter_map[mainFilter.value].subTitle1 +
          '-/-' +
          props.filter_map[mainFilter.value].subTitle2,
        type: 'range',
      }
    : {
        key: props.filter_map[mainFilter.value].key,
        value: filter_val.value[mainFilter.value],
        title: props.filter_map[mainFilter.value].title,
      }
}

const showVal = () => {
  filter_val.value[mainFilter.value] = toggleValue.value
}

const emitFilter = (item) => {
  if (item) mainFilter.value = item
  if (props.emitAll === true) {
    emit('getFilter', {
      all: props.filter_map[mainFilter.value],
      value:
        props.filter_map[mainFilter.value].type === 'range'
          ? filter_val.value[props.filter_map[mainFilter.value].key1] +
            '-' +
            filter_val.value[props.filter_map[mainFilter.value].key2]
          : filter_val.value[mainFilter.value],
    })
  }
}

const updateFilterValue = (val) => {
  filter_val.value[mainFilter.value] = val
}

// Updated hook equivalent
watchEffect(() => {
  const filter = updateFilter()
  if (props.emitAll === false) {
    emit('getFilter', filter)
  }
})

const clearFilterVal = () => {
  filter_val.value = {}
}

defineExpose({
  clearFilterVal,
})
</script>

<style scoped></style>
