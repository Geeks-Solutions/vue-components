<template>
  <div>
    <div class="flex flex-col sm:flex-row" :class="filterContainerStyle">
      <div class="flex-col self-start sm:self-end">
        <AutoComplete
          :main-filter="mainFilter"
          :select-label="filterByText"
          :reduce="val => {return val['key']}"
          :filter-options="filterOptions"
          :selectWrapperStyle="mainFilterOptions.selectWrapperStyle"
          :selectStyle="mainFilterOptions.selectStyle"
          :labelStyle="mainFilterOptions.labelStyle"
          :labelInsideStyle="mainFilterOptions.labelInsideStyle"
          :labelInsideDefaultStyle="mainFilterOptions.labelInsideDefaultStyle"
          :labelPaddingWithIcon="mainFilterOptions.labelPaddingWithIcon"
          :labelPadding="mainFilterOptions.labelPadding"
          :selectErrorClass="mainFilterOptions.selectErrorClass"
          :selectIconClass="mainFilterOptions.selectIconClass"
          :labelInsideClass="mainFilterOptions.labelInsideClass"
          :trackBy="mainFilterOptions.trackBy"
          :focused="mainFilterOptions.focused"
          :filterDisabled="filter_val[mainFilter] ? true : mainFilterOptions.filterDisabled"
          :multiple="mainFilterOptions.multiple"
          :closeOnSelect="mainFilterOptions.closeOnSelect"
          :preserveSearch="mainFilterOptions.preserveSearch"
          :preselectFirst="mainFilterOptions.preselectFirst"
          :clearOnSelect="mainFilterOptions.clearOnSelect"
          :multipleSelection="mainFilterOptions.multipleSelection"
          :labelOutside="mainFilterOptions.labelOutside"
          :selectPlaceholder="mainFilterOptions.selectPlaceholder"
          :filterLabelProp="mainFilterOptions.filterLabelProp"
          :filterIconIcomoon="mainFilterOptions.filterIconIcomoon"
          :focusStyle="mainFilterOptions.focusStyle"
          :focusMarginStyle="mainFilterOptions.focusMarginStyle"
          :filterClearable="mainFilterOptions.filterClearable"
          :filterSearchable="mainFilterOptions.filterSearchable"
          :errorOccurred="mainFilterOptions.errorOccurred"
          :withIcon="mainFilterOptions.withIcon"
          @itemSelected="(item) => {emitFilter(item)}"
        ></AutoComplete>
      </div>
      <div class="flex-col self-start sm:self-end">
        <div v-if="filter_map[mainFilter].type === 'text'">
          <input v-model = "filter_val[mainFilter]"
            type = "text"
            :placeholder = "filter_map[mainFilter].placeholder ? filter_map[mainFilter].placeholder : filter_map[mainFilter].title | capitalize" :class = "inputStyle" @input="emitFilter()" />
          <div v-if="filter_map[mainFilter].description" :class="filter_map[mainFilter].descriptionStyle ? filter_map[mainFilter].descriptionStyle : ''">
            {{ filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="filter_map[mainFilter].type === 'select'">
          <AutoComplete
            :main-filter="filter_val[mainFilter]"
            :reduce="val => {return val['key']}"
            :filter-options="filter_map[mainFilter].options"
            :selectLabel="singleSelectFilterOptions.selectLabel"
            :selectWrapperStyle="singleSelectFilterOptions.selectWrapperStyle"
            :selectStyle="singleSelectFilterOptions.selectStyle"
            :labelStyle="singleSelectFilterOptions.labelStyle"
            :labelInsideStyle="singleSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="singleSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="singleSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="singleSelectFilterOptions.labelPadding"
            :selectErrorClass="singleSelectFilterOptions.selectErrorClass"
            :selectIconClass="singleSelectFilterOptions.selectIconClass"
            :labelInsideClass="singleSelectFilterOptions.labelInsideClass"
            :trackBy="singleSelectFilterOptions.trackBy"
            :focused="singleSelectFilterOptions.focused"
            :filterDisabled="singleSelectFilterOptions.filterDisabled"
            :multiple="singleSelectFilterOptions.multiple"
            :closeOnSelect="singleSelectFilterOptions.closeOnSelect"
            :preserveSearch="singleSelectFilterOptions.preserveSearch"
            :preselectFirst="singleSelectFilterOptions.preselectFirst"
            :clearOnSelect="singleSelectFilterOptions.clearOnSelect"
            :multipleSelection="singleSelectFilterOptions.multipleSelection"
            :labelOutside="singleSelectFilterOptions.labelOutside"
            :selectPlaceholder="filter_map[mainFilter].selectPlaceholder ? filter_map[mainFilter].selectPlaceholder : singleSelectFilterOptions.selectPlaceholder"
            :filterLabelProp="singleSelectFilterOptions.filterLabelProp"
            :filterIconIcomoon="singleSelectFilterOptions.filterIconIcomoon"
            :focusStyle="singleSelectFilterOptions.focusStyle"
            :focusMarginStyle="singleSelectFilterOptions.focusMarginStyle"
            :filterClearable="singleSelectFilterOptions.filterClearable"
            :filterSearchable="singleSelectFilterOptions.filterSearchable"
            :errorOccurred="singleSelectFilterOptions.errorOccurred"
            :withIcon="singleSelectFilterOptions.withIcon"
            @itemSelected="(item) => {updateFilterValue(item); emitAll ? emitFilter() : $emit('getFilter', updateFilter())}"
          ></AutoComplete>
          <div v-if="filter_map[mainFilter].description" :class="filter_map[mainFilter].descriptionStyle ? filter_map[mainFilter].descriptionStyle : ''">
            {{ filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="filter_map[mainFilter].type === 'multiSelect'">
          <AutoComplete
            :select-style="multiSelectStyle"
            :main-filter="filter_val[mainFilter]"
            :selectPlaceholder="filter_map[mainFilter].selectPlaceholder ? filter_map[mainFilter].selectPlaceholder : multiSelectPlaceholder"
            :filter-label-prop="filter_map[mainFilter].multiSelectLabel"
            :reduce="filter_map[mainFilter].multipleSelect === false ? val => val[filter_map[mainFilter].multiSelectLabel] : val => val"
            :filter-options="filter_map[mainFilter].filterOptions"
            :multiple="filter_map[mainFilter].multipleSelect === false ? false : true"
            :track-by="filter_map[mainFilter].multiSelectKey"
            :selectLabel="multiSelectFilterOptions.selectLabel"
            :selectWrapperStyle="multiSelectFilterOptions.selectWrapperStyle"
            :selectStyle="multiSelectFilterOptions.selectStyle"
            :labelStyle="multiSelectFilterOptions.labelStyle"
            :labelInsideStyle="multiSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="multiSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="multiSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="multiSelectFilterOptions.labelPadding"
            :selectErrorClass="multiSelectFilterOptions.selectErrorClass"
            :selectIconClass="multiSelectFilterOptions.selectIconClass"
            :labelInsideClass="multiSelectFilterOptions.labelInsideClass"
            :trackBy="multiSelectFilterOptions.trackBy"
            :focused="multiSelectFilterOptions.focused"
            :filterDisabled="multiSelectFilterOptions.filterDisabled"
            :closeOnSelect="multiSelectFilterOptions.closeOnSelect"
            :preserveSearch="multiSelectFilterOptions.preserveSearch"
            :preselectFirst="multiSelectFilterOptions.preselectFirst"
            :clearOnSelect="multiSelectFilterOptions.clearOnSelect"
            :multipleSelection="multiSelectFilterOptions.multipleSelection"
            :labelOutside="multiSelectFilterOptions.labelOutside"
            :filterIconIcomoon="multiSelectFilterOptions.filterIconIcomoon"
            :focusStyle="multiSelectFilterOptions.focusStyle"
            :focusMarginStyle="multiSelectFilterOptions.focusMarginStyle"
            :filterClearable="multiSelectFilterOptions.filterClearable"
            :filterSearchable="multiSelectFilterOptions.filterSearchable"
            :errorOccurred="multiSelectFilterOptions.errorOccurred"
            :withIcon="multiSelectFilterOptions.withIcon"
            @itemSelected="(item) => {updateFilterValue(item); $emit('getFilter', updateFilter()); $emit('itemsSelected', filter_val[mainFilter])}"
          ></AutoComplete>
          <div v-if="filter_map[mainFilter].description" :class="filter_map[mainFilter].descriptionStyle ? filter_map[mainFilter].descriptionStyle : ''">
            {{ filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="filter_map[mainFilter].type === 'range'" class="flex flex-col md:flex-row gap-4 md:gap-0">
          <div>
            <input v-model = "filter_val[filter_map[mainFilter].key1]"
                   type = "text"
                   :placeholder = "filter_map[mainFilter].subTitle1 | capitalize" :class = "inputStyle" @input="emitFilter()" />
            <div v-if="filter_map[mainFilter].description1" :class="filter_map[mainFilter].descriptionStyle1 ? filter_map[mainFilter].descriptionStyle1 : ''">
              {{ filter_map[mainFilter].description1 }}
            </div>
          </div>
          <div>
            <input v-model = "filter_val[filter_map[mainFilter].key2]"
                   type = "text"
                   :placeholder = "filter_map[mainFilter].subTitle2 | capitalize" :class = "inputStyle" @input="emitFilter()" />
            <div v-if="filter_map[mainFilter].description2" :class="filter_map[mainFilter].descriptionStyle2 ? filter_map[mainFilter].descriptionStyle2 : ''">
              {{ filter_map[mainFilter].description2 }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AutoComplete from './AutoComplete.vue'

export default {
  components: {
    AutoComplete
  },
  filters: {
    capitalize: (value) => {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
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
            value: 'ID'
          },
          {
            key: 'name',
            value: 'Name'
          },
          {
            key: 'title',
            value: 'Title'
          },
          {
            key: 'status',
            value: 'Status'
          },
          {
            key: 'statuses',
            value: 'Statuses'
          },
          {
            key: 'role',
            value: 'Role'
          }
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
                translation: 'ID'
              },
              {
                key: 'name',
                translation: 'Name'
              },
              {
                key: 'title',
                translation: 'Title'
              },
              {
                key: 'status',
                translation: 'Status'
              },
              {
                key: 'role',
                translation: 'Role'
              }
            ]
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
      default: 'md:items-end gap-4'
    },
    filterByStyle: {
      type: String,
      default: 'pt-3 pr-2'
    },
    filterSelectDefault: {
      type: String,
      default: 'Select Filter'
    },
    filterIconIcomoon: {
      type: String,
      default: 'icon-filterIcon'
    },
    filterIcon: {
      type: String,
      default: ''
    },
    filterIconStyle: {
      type: String,
      default: ''
    },
    mainFilterStyle: {
      type: String,
      default: 'flex items-center pl-2 mr-6 md:ml-2 border border-FieldGray rounded-xl h-49px w-244px focus:outline-none mb-6'
    },
    inputStyle: {
      type: String,
      default: 'py-4 pl-6 mr-1 border border-FieldGray rounded-xl h-49px md:w-300px w-220px focus:outline-none'
    },
    subFilterStyle: {
      type: String,
      default: 'pl-6 mb-6 mr-6 border border-FieldGray rounded-xl h-49px w-full focus:outline-none'
    },
    selectStyle: {
      type: String,
      default: 'h-35px w-180px ml-12'
    },
    multiSelectStyle: {
      type: String,
      default: 'default-select-style-chooser relative'
    },
    multiSelectPlaceholder: {
      type: String,
      default: ''
    },
    emitAll: {
      type: Boolean,
      default: false
    },
    clearFilters: {
      type: Boolean,
      default: false
    },
    mainFilterValue: {
      type: Object,
      default() {
        return {}
      }
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
      selectedType: '',
      mainFilter: 'All',
      filter_val: {},
      value2: '',
      toggleValue: ''
    }
  },
  watch: {
    clearFilters() {
      this.mainFilter = 'All'
      this.filter_val = {}
    },
    mainFilterValue: {
      handler() {
        if(this.mainFilterValue.key && this.mainFilterValue.value && this.mainFilterValue.key !== '' && !this.mainFilterValue.value.includes("undefined")) {
          if(!this.mainFilterValue.key.includes("-/-")) {
            this.$nextTick(() => {
              this.mainFilter = this.mainFilterValue.key
              this.filter_val[this.mainFilter] = this.mainFilterValue.value
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  updated() {
    let filter = {}
    filter = this.updateFilter()
    if(this.emitAll === false) {
      this.$emit('getFilter', filter)
    }
  },
  methods: {
    remove_filter() {
      this.mainFilter = 'All'
      this.$emit('removeFilter')
    },
    updateFilter() {
      return this.filter_map[this.mainFilter].type === 'range' ?
        {
          key: this.filter_map[this.mainFilter].key1+'-/-'+this.filter_map[this.mainFilter].key2,
          value: this.filter_val[this.filter_map[this.mainFilter].key1]+'-/-'+this.filter_val[this.filter_map[this.mainFilter].key2],
          title: this.filter_map[this.mainFilter].subTitle1+'-/-'+this.filter_map[this.mainFilter].subTitle2,
          type: 'range'
        }
        : {
          key: this.filter_map[this.mainFilter].key,
          value: this.filter_val[this.mainFilter],
          title: this.filter_map[this.mainFilter].title,
        }
    },
    showVal() {
      this.filter_val[this.mainFilter] = this.toggleValue
    },
    emitFilter(item) {
      if(item) this.mainFilter = item
      if(this.emitAll === true) {
        this.$emit('getFilter', {
          all: this.filter_map[this.mainFilter],
          value: this.filter_map[this.mainFilter].type === 'range' ? this.filter_val[this.filter_map[this.mainFilter].key1]+'-'+this.filter_val[this.filter_map[this.mainFilter].key2] : this.filter_val[this.mainFilter]
        })
      }
    },
    updateFilterValue(val) {
      this.$set(this.filter_val, this.mainFilter, val);
    }
  }
}
</script>

<style scoped>
</style>
