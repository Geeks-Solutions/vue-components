<template>
  <div>
    <LazyGFilterSelect
      v-for="(filterMp, idx) in filters"
      :key="idx"
      ref="filterRef"
      :filter-options="props.filterOptions"
      :filter_map="props.filter_map"
      :filter-by-text="props.filterByText"
      :filter-container-style="props.filterContainerStyle"
      :filter-select-default="props.filterSelectDefault"
      :filter-icon="props.filterIcon"
      :filter-icon-icomoon="props.filterIconIcomoon"
      :filter-icon-style="props.filterIconStyle"
      :select-style="props.selectStyle"
      :main-filter-value="getMainFilterValue(idx)"
      :main-filter-style="props.mainFilterStyle"
      :multi-select-style="props.multiSelectStyle"
      :multi-select-placeholder="props.multiSelectPlaceholder"
      :emit-all="props.emitAll"
      :main-filter-options="props.mainFilterOptions"
      :single-select-filter-options="props.singleSelectFilterOptions"
      :multi-select-filter-options="props.multiSelectFilterOptions"
      @get-filter="(filter) => getFilter(filter, idx)"
    />

    <div class="overflow-auto flex-col md:flex-row" style="display: flex">
      <div v-for="(added, i) in filtered" :key="i">
        <div v-if="added?.type" class="max-w-xs">
          <div v-if="added.value" :style="props.filteredValuesStyle">
            <div class="val">
              {{ added.title?.split('-/-')[0] }} = {{ getvalue(added.value?.split('-/-')[0]) }}
            </div>
            <div class="val pl-4">
              {{ added.title?.split('-/-')[1] }} = {{ getvalue(added.value?.split('-/-')[1]) }}
            </div>
            <div style="margin-left: 10px; cursor: pointer" @click="removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else-if="Array.isArray(added.value)" class="max-w-xs">
          <div v-if="added.value" :style="props.filteredValuesStyle">
            <div class="val">
              {{ added.title }} =
              {{ alterValue(getvalue(added.value.map((u) => u.translation).join(','))) }}
            </div>
            <div style="margin-left: 10px; cursor: pointer" @click="removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else-if="added.all" class="max-w-xs">
          <div v-if="added.value" :style="props.filteredValuesStyle">
            <div class="val">{{ added.all.title }} = {{ alterValue(getvalue(added.value)) }}</div>
            <div style="margin-left: 10px; cursor: pointer" @click="removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else class="max-w-xs">
          <div v-if="added.value" :style="props.filteredValuesStyle">
            <div class="val">{{ added.title }} = {{ alterValue(getvalue(added.value)) }}</div>
            <div style="margin-left: 10px; cursor: pointer" @click="removeFilter(i)">X</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; padding-top: 2%">
      <a
        class="apply_btn text-Dark"
        style="margin-bottom: 10px; text-decoration: underline; cursor: pointer"
        @click="add_filter"
        >+ {{ props.addFilterLabel }}</a
      >
      <a
        v-if="filters.length > 1"
        class="clear apply_btn text-Dark"
        style="margin-bottom: 10px; text-decoration: underline; margin-left: 20px; cursor: pointer"
        @click="clearFilters"
        >{{ props.clearFiltersLabel }}</a
      >
      <a
        class="clear apply_btn text-Dark"
        style="cursor: pointer; margin-bottom: 10px; text-decoration: underline; margin-left: 20px"
        @click="apply_filter"
        >{{ props.applyFilterLabel }}</a
      >
    </div>
  </div>
</template>

<script setup>
import { ref, useState, watch } from '#imports'

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
    default: 'items-end gap-4',
  },
  filterSelectDefault: {
    type: String,
    default: 'Select Filter',
  },
  filterIcon: {
    type: String,
    default: '',
  },
  filterIconIcomoon: {
    type: String,
    default: '',
  },
  filterIconStyle: {
    type: String,
    default: '',
  },
  selectStyle: {
    type: String,
    default: '',
  },
  mainFilterStyle: {
    type: String,
    default:
      'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-244px focus:outline-none mb-6',
  },
  multiSelectStyle: {
    type: String,
    default: 'default-select-style-chooser relative',
  },
  multiSelectPlaceholder: {
    type: String,
    default: 'Select options',
  },
  emitAll: {
    type: Boolean,
    default: false,
  },
  addFilterLabel: {
    type: String,
    default: 'Add another Filter',
  },
  clearFiltersLabel: {
    type: String,
    default: 'Clear Filters',
  },
  applyFilterLabel: {
    type: String,
    default: 'Apply Filters',
  },
  alterValue: {
    type: Function,
    default: (value) => {
      return value
    },
  },
  filteredValuesStyle: {
    type: String,
    default:
      'color: white; background: black; padding: 5px 15px; margin: 0 5px; border-radius: 10px; position: relative; display: flex; width: fit-content;',
  },
  filtersQuery: {
    type: String,
    default: '',
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

const emit = defineEmits(['apply_filter', 'remove_filter', 'getValue', 'clearFilters'])

// Reactive state
const filters = useState('filters', () => [{ value: '' }])
const filtered = useState('filtered', () => [])
const filterLength = ref(0)

// Refs for accessing child components
const filterRef = ref(null)

// Watcher for filtersQuery
watch(
  () => props.filtersQuery,
  (newQuery) => {
    if (newQuery && newQuery !== '') {
      const parsedQuery = JSON.parse(newQuery)
      filtered.value = parsedQuery
      filters.value = []

      for (const filter in parsedQuery) {
        filters.value.push({ value: '' })
      }
    }
  },
  { deep: true, immediate: true }
)

// Methods
const add_filter = () => {
  let filled = true
  filtered.value.map((fil) => {
    if (!fil.value) {
      filled = false
    }
  })

  if (filled) {
    filters.value.push({ value: '' })
  } else {
    alert('You must select or fill all filters to add new one')
  }
}

const apply_filter = () => {
  if (filtered.value.length !== 0) {
    emit('apply_filter', filtered.value)
  } else {
    alert('You must select a filter')
  }
}

const removeFilter = (i) => {
  emit('remove_filter', i, filtered.value[i])

  if (filtered.value.length === 1 && filters.value.length === 1) {
    clearFilters()
    return
  }

  if (filters.value.length !== 1) {
    filters.value = filters.value.filter((fil, index) => index !== i)
  }

  filtered.value = filtered.value.filter((fil, index) => index !== i)
}

const getvalue = (val) => {
  emit('getValue', val)

  if (typeof val !== 'object') {
    return val.toString() === 'undefined' ? '' : val
  } else {
    val = val.map((v) => v.title)
    return val.join(' - ')
  }
}

const getFilter = (filter, idx) => {
  filterLength.value = filter.length
  let finalFiltersArray = [...filtered.value]

  finalFiltersArray[idx] = filter
  finalFiltersArray = finalFiltersArray.filter((fil) => fil.key !== 'All')
  filtered.value = finalFiltersArray
}

const clearFilters = () => {
  emit('clearFilters')
  filtered.value = []
  filters.value = [{}]

  // Note: This part might need adjustment based on how you're referencing child components
  if (filterRef.value && filterRef.value[0]) {
    filterRef.value[0].clearFilterVal()
  }
}

const getMainFilterValue = (idx) => {
  return filtered.value[idx]
}

// Expose methods if needed
defineExpose({
  add_filter,
  apply_filter,
  removeFilter,
  getvalue,
  getFilter,
  clearFilters,
  getMainFilterValue,
})
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .max-w-xs {
    max-width: 320px;
  }
}
</style>
