<template>
  <div>

    <FilterSelect
      v-for = "(filter, idx) in filters"
      :key = "idx"
      ref = "filterRef"
      :filter-options="filterOptions"
      :filter_map="filter_map"
      :filter-by-text="filterByText"
      :filter-container-style="filterContainerStyle"
      :filter-select-default="filterSelectDefault"
      :filter-icon="filterIcon"
      :filter-icon-icomoon="filterIconIcomoon"
      :filter-icon-style="filterIconStyle"
      :select-style="selectStyle"
      :main-filter-value="getMainFilterValue(idx)"
      :main-filter-style="mainFilterStyle"
      :multiSelectStyle="multiSelectStyle"
      :multiSelectPlaceholder="multiSelectPlaceholder"
      :emit-all="emitAll"
      :main-filter-options="mainFilterOptions"
      :single-select-filter-options="singleSelectFilterOptions"
      :multi-select-filter-options="multiSelectFilterOptions"
      @getFilter = "filter => getFilter(filter, idx)"
    />

    <div class="overflow-auto flex-col md:flex-row" style="display: flex;">
      <div v-for = "(added, i) in filtered" :key = "i">
        <div v-if="added.type" class="max-w-xs">
          <div v-if = "added.value" :style = "filteredValuesStyle">
            <div class = "val">
              {{ added.title.split('-/-')[0] }} = {{ alterValue(getvalue(added.value.split('-/-')[0]), added.type) }}
            </div>
            <div class = "val pl-4">
              {{ added.title.split('-/-')[1] }} = {{ alterValue(getvalue(added.value.split('-/-')[1]), added.type) }}
            </div>
            <div style="margin-left: 10px;cursor: pointer" @click = "removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else-if="Array.isArray(added.value)" class="max-w-xs">
          <div v-if = "added.value" :style = "filteredValuesStyle">
            <div class = "val">
              {{ added.title }} = {{ alterValue(getvalue(added.value.map(u => u.translation).join(','))) }}
            </div>
            <div style="margin-left: 10px;cursor: pointer" @click = "removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else-if="added.all" class="max-w-xs">
          <div v-if = "added.value" :style = "filteredValuesStyle">
            <div class = "val">
              {{ added.all.title }} = {{ alterValue(getvalue(added.value)) }}
            </div>
            <div style="margin-left: 10px;cursor: pointer" @click = "removeFilter(i)">X</div>
          </div>
        </div>
        <div v-else class="max-w-xs">
          <div v-if = "added.value" :style = "filteredValuesStyle">
            <div class = "val">
              {{ added.title }} = {{ alterValue(getvalue(added.value)) }}
            </div>
            <div style="margin-left: 10px;cursor: pointer" @click = "removeFilter(i)">X</div>
          </div>
        </div>
      </div>
    </div>

    <div style = "display: flex;padding-top: 2%">
      <a
        class = "apply_btn text-Dark"
        style = "margin-bottom: 10px;text-decoration:underline;cursor:pointer;"
        @click = "add_filter()"
      >+ {{ addFilterLabel }}</a
      >
      <a
        v-if = "filters.length > 1"
        class = "clear apply_btn text-Dark"
        style = "margin-bottom: 10px;text-decoration:underline;margin-left:20px;cursor:pointer;"
        @click = "clearFilters"
      >{{ clearFiltersLabel }}</a
      >
      <a
        class = "clear apply_btn text-Dark"
        style = "cursor: pointer;margin-bottom: 10px;text-decoration:underline;margin-left:20px; "
        @click = "apply_filter()"
      >{{ applyFilterLabel }}</a
      >
    </div>

  </div>
</template>

<script>
import FilterSelect from "../components/FilterSelect";

export default {
  name: "MainFilter",
  components: {
    FilterSelect,
  },
  props: {
    filterOptions: {
      type: Array,
      default() {
        return [
          {
            key: 'All',
            value: 'All'
          },
          {
            key: 'id',
            value: 'id'
          },
          {
            key: 'name',
            value: 'name'
          },
          {
            key: 'title',
            value: 'title'
          },
          {
            key: 'status',
            value: 'status'
          },
          {
            key: 'role',
            value: 'role'
          },
        ]
      }
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
      }
    },
    filterByText: {
      type: String,
      default: 'Filter By: '
    },
    filterContainerStyle: {
      type: String,
      default: 'items-end gap-4'
    },
    filterSelectDefault: {
      type: String,
      default: 'Select Filter'
    },
    filterIcon: {
      type: String,
      default: ''
    },
    filterIconIcomoon: {
      type: String,
      default: ''
    },
    filterIconStyle: {
      type: String,
      default: ''
    },
    selectStyle: {
      type: String,
      default: ''
    },
    mainFilterStyle: {
      type: String,
      default: 'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-244px focus:outline-none mb-6'
    },
    multiSelectStyle: {
      type: String,
      default: 'default-select-style-chooser relative'
    },
    multiSelectPlaceholder: {
      type: String,
      default: 'Select options'
    },
    emitAll: {
      type: Boolean,
      default: false
    },
    addFilterLabel: {
      type: String,
      default: 'Add another Filter'
    },
    clearFiltersLabel: {
      type: String,
      default: 'Clear Filters'
    },
    applyFilterLabel: {
      type: String,
      default: 'Apply Filters'
    },
    alterValue: {
      type: Function,
      default: (value, type) => {return value}
    },
    filteredValuesStyle: {
      type: String,
      default: 'color: white; background: black; padding: 5px 15px; margin: 0 5px; border-radius: 10px; position: relative; display: flex; width: fit-content;'
    },
    filtersQuery: {
      type: String,
      default: ''
    },
    mainFilterOptions: {
      type: Object,
      default() {
        return {
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  true,
        }
      }
    },
    singleSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'translation',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    },
    multiSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  false,
          preserveSearch:  true,
          preselectFirst:  true,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  true,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    }
  },
  data() {
    return {
      filters: [{ value: '' }],
      filtered: [],
      filterLength: 0
    }
  },
  watch: {
    filtersQuery: {
      handler() {
        if(this.filtersQuery && this.filtersQuery !== '') {
          this.filtered = JSON.parse(this.filtersQuery)
          this.filters = []
          /* eslint-disable no-unused-vars */
          for(const filter in JSON.parse(this.filtersQuery)) {
            this.filters.push({value: ''})
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    add_filter() {
      let filled = true
      // eslint-disable-next-line array-callback-return
      this.filtered.map(fil => {
        if (!fil.value) {
          filled = false
        }
      })
      if (filled) {
        this.filters.push({value: ''})
      } else {
        alert('You must select or fill all filters to add new one')
      }
    },
    apply_filter() {
      if(this.filtered.length !== 0) {
        this.$emit('apply_filter', this.filtered)
      } else {
        alert('You must select a filter')
      }
    },
    removeFilter(i) {
      this.$emit('remove_filter', i, this.filtered[i])
      if (this.filtered.length === 1 && this.filters.length === 1) {
        this.clearFilters()
        return
      }
      if(this.filters.length !== 1) {
        this.filters = this.filters.filter((fil, index) => index !== i)
      }
      this.filtered = this.filtered.filter((fil, index) => index !== i)
    },
    getvalue(val) {
      this.$emit('getValue', val)
      if (typeof val !== 'object') {
        if(val.toString() === 'undefined') {
          return ''
        } else  {
          return val
        }
      } else {
        val = val.map(v => {
          v = v.title
          return v
        })
        val = val.join(' - ')
        return val
      }
    },
    getFilter(filter, idx) {
      this.filterLength = filter.length
      let finalFiltersArray = [...this.filtered]

      finalFiltersArray[idx] = filter
      finalFiltersArray = finalFiltersArray.filter(fil => fil.key !== 'All')
      this.filtered = finalFiltersArray
    },
    clearFilters() {
      this.$emit('clearFilters')
      this.filtered = []
      this.filters = [{}]
      this.$refs.filterRef[0].filter_val = {}
      this.$refs.filterRef[0].filter = 'All'
    },
    getMainFilterValue(idx) {
      return this.filtered[idx]
    },
  }
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .max-w-xs {
    max-width: 320px;
  }
}
</style>
