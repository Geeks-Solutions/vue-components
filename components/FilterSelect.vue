<template>
  <div>
    <div class="flex flex-col sm:flex-row" :class="props.filterContainerStyle">
      <div class="flex-col self-start sm:self-end">
        <AutoComplete
          :main-filter="mainFilter"
          :select-label="props.filterByText"
          :reduce="val => {return val['key']}"
          :filter-options="props.filterOptions"
          :selectWrapperStyle="props.mainFilterOptions.selectWrapperStyle"
          :selectStyle="props.mainFilterOptions.selectStyle"
          :labelStyle="props.mainFilterOptions.labelStyle"
          :labelInsideStyle="props.mainFilterOptions.labelInsideStyle"
          :labelInsideDefaultStyle="props.mainFilterOptions.labelInsideDefaultStyle"
          :labelPaddingWithIcon="props.mainFilterOptions.labelPaddingWithIcon"
          :labelPadding="props.mainFilterOptions.labelPadding"
          :selectErrorClass="props.mainFilterOptions.selectErrorClass"
          :selectIconClass="props.mainFilterOptions.selectIconClass"
          :labelInsideClass="props.mainFilterOptions.labelInsideClass"
          :trackBy="props.mainFilterOptions.trackBy"
          :focused="props.mainFilterOptions.focused"
          :filterDisabled="filterVal[mainFilter] ? true : props.mainFilterOptions.filterDisabled"
          :multiple="props.mainFilterOptions.multiple"
          :closeOnSelect="props.mainFilterOptions.closeOnSelect"
          :preserveSearch="props.mainFilterOptions.preserveSearch"
          :preselectFirst="props.mainFilterOptions.preselectFirst"
          :clearOnSelect="props.mainFilterOptions.clearOnSelect"
          :multipleSelection="props.mainFilterOptions.multipleSelection"
          :labelOutside="props.mainFilterOptions.labelOutside"
          :selectPlaceholder="props.mainFilterOptions.selectPlaceholder"
          :filterLabelProp="props.mainFilterOptions.filterLabelProp"
          :filterIconIcomoon="props.mainFilterOptions.filterIconIcomoon"
          :focusStyle="props.mainFilterOptions.focusStyle"
          :focusMarginStyle="props.mainFilterOptions.focusMarginStyle"
          :filterClearable="props.mainFilterOptions.filterClearable"
          :filterSearchable="props.mainFilterOptions.filterSearchable"
          :errorOccurred="props.mainFilterOptions.errorOccurred"
          :withIcon="props.mainFilterOptions.withIcon"
          @itemSelected="emitFilter(item)"
        />
      </div>
      <div class="flex-col self-start sm:self-end">
        <div v-if="props.filterMap[mainFilter].type === 'text'">
          <input v-model = "filterVal[mainFilter]"
            type = "text"
            :placeholder = "props.filterMap[mainFilter].placeholder ? props.filterMap[mainFilter].placeholder : capitalize(props.filterMap[mainFilter].title)" :class = "props.inputStyle" @input="emitFilter()" />
          <div v-if="props.filterMap[mainFilter].description" :class="props.filterMap[mainFilter].descriptionStyle ? props.filterMap[mainFilter].descriptionStyle : ''">
            {{ props.filterMap[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filterMap[mainFilter].type === 'select'">
          <AutoComplete
            :main-filter="filterVal[mainFilter]"
            :reduce="val => {return val['key']}"
            :filter-options="props.filterMap[mainFilter].options"
            :selectLabel="props.singleSelectFilterOptions.selectLabel"
            :selectWrapperStyle="props.singleSelectFilterOptions.selectWrapperStyle"
            :selectStyle="props.singleSelectFilterOptions.selectStyle"
            :labelStyle="props.singleSelectFilterOptions.labelStyle"
            :labelInsideStyle="props.singleSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="props.singleSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="props.singleSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="props.singleSelectFilterOptions.labelPadding"
            :selectErrorClass="props.singleSelectFilterOptions.selectErrorClass"
            :selectIconClass="props.singleSelectFilterOptions.selectIconClass"
            :labelInsideClass="props.singleSelectFilterOptions.labelInsideClass"
            :trackBy="props.singleSelectFilterOptions.trackBy"
            :focused="props.singleSelectFilterOptions.focused"
            :filterDisabled="props.singleSelectFilterOptions.filterDisabled"
            :multiple="props.singleSelectFilterOptions.multiple"
            :closeOnSelect="props.singleSelectFilterOptions.closeOnSelect"
            :preserveSearch="props.singleSelectFilterOptions.preserveSearch"
            :preselectFirst="props.singleSelectFilterOptions.preselectFirst"
            :clearOnSelect="props.singleSelectFilterOptions.clearOnSelect"
            :multipleSelection="props.singleSelectFilterOptions.multipleSelection"
            :labelOutside="props.singleSelectFilterOptions.labelOutside"
            :selectPlaceholder="props.filterMap[mainFilter].selectPlaceholder ? props.filterMap[mainFilter].selectPlaceholder : props.singleSelectFilterOptions.selectPlaceholder"
            :filterLabelProp="props.singleSelectFilterOptions.filterLabelProp"
            :filterIconIcomoon="props.singleSelectFilterOptions.filterIconIcomoon"
            :focusStyle="props.singleSelectFilterOptions.focusStyle"
            :focusMarginStyle="props.singleSelectFilterOptions.focusMarginStyle"
            :filterClearable="props.singleSelectFilterOptions.filterClearable"
            :filterSearchable="props.singleSelectFilterOptions.filterSearchable"
            :errorOccurred="props.singleSelectFilterOptions.errorOccurred"
            :withIcon="props.singleSelectFilterOptions.withIcon"
            @itemSelected="item => {updateFilterValue(item); props.emitAll ? emitFilter() : emit('getFilter', updateFilter())}"
          />
          <div v-if="props.filterMap[mainFilter].description" :class="props.filterMap[mainFilter].descriptionStyle ? props.filterMap[mainFilter].descriptionStyle : ''">
            {{ props.filterMap[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filterMap[mainFilter].type === 'multiSelect'">
          <AutoComplete
            :select-style="props.multiSelectStyle"
            :main-filter="filterVal[mainFilter]"
            :selectPlaceholder="props.filterMap[mainFilter].selectPlaceholder ? props.filterMap[mainFilter].selectPlaceholder : props.multiSelectPlaceholder"
            :filter-label-prop="props.filterMap[mainFilter].multiSelectLabel"
            :reduce="props.filterMap[mainFilter].multipleSelect === false ? val => val[props.filterMap[mainFilter].multiSelectLabel] : val => val"
            :filter-options="props.filterMap[mainFilter].filterOptions"
            :multiple="props.filterMap[mainFilter].multipleSelect === false ? false : true"
            :track-by="props.filterMap[mainFilter].multiSelectKey"
            :selectLabel="props.multiSelectFilterOptions.selectLabel"
            :selectWrapperStyle="props.multiSelectFilterOptions.selectWrapperStyle"
            :selectStyle="props.multiSelectFilterOptions.selectStyle"
            :labelStyle="props.multiSelectFilterOptions.labelStyle"
            :labelInsideStyle="props.multiSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="props.multiSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="props.multiSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="props.multiSelectFilterOptions.labelPadding"
            :selectErrorClass="props.multiSelectFilterOptions.selectErrorClass"
            :selectIconClass="props.multiSelectFilterOptions.selectIconClass"
            :labelInsideClass="props.multiSelectFilterOptions.labelInsideClass"
            :trackBy="props.multiSelectFilterOptions.trackBy"
            :focused="props.multiSelectFilterOptions.focused"
            :filterDisabled="props.multiSelectFilterOptions.filterDisabled"
            :closeOnSelect="props.multiSelectFilterOptions.closeOnSelect"
            :preserveSearch="props.multiSelectFilterOptions.preserveSearch"
            :preselectFirst="props.multiSelectFilterOptions.preselectFirst"
            :clearOnSelect="props.multiSelectFilterOptions.clearOnSelect"
            :multipleSelection="props.multiSelectFilterOptions.multipleSelection"
            :labelOutside="props.multiSelectFilterOptions.labelOutside"
            :filterIconIcomoon="props.multiSelectFilterOptions.filterIconIcomoon"
            :focusStyle="props.multiSelectFilterOptions.focusStyle"
            :focusMarginStyle="props.multiSelectFilterOptions.focusMarginStyle"
            :filterClearable="props.multiSelectFilterOptions.filterClearable"
            :filterSearchable="props.multiSelectFilterOptions.filterSearchable"
            :errorOccurred="props.multiSelectFilterOptions.errorOccurred"
            :withIcon="props.multiSelectFilterOptions.withIcon"
            @itemSelected="item => {updateFilterValue(item); emit('getFilter', updateFilter()); emit('itemsSelected', filterVal[mainFilter])}"
          />
          <div v-if="props.filterMap[mainFilter].description" :class="props.filterMap[mainFilter].descriptionStyle ? props.filterMap[mainFilter].descriptionStyle : ''">
            {{ props.filterMap[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filterMap[mainFilter].type === 'range'" class="flex flex-col md:flex-row gap-4 md:gap-0">
          <div>
            <input v-model = "filterVal[props.filterMap[mainFilter].key1]"
                   type = "text"
                   :placeholder = "capitalize(props.filterMap[mainFilter].subTitle1)" :class = "props.inputStyle" @input="emitFilter()" />
            <div v-if="props.filterMap[mainFilter].description1" :class="props.filterMap[mainFilter].descriptionStyle1 ? props.filterMap[mainFilter].descriptionStyle1 : ''">
              {{ props.filterMap[mainFilter].description1 }}
            </div>
          </div>
          <div>
            <input v-model = "filterVal[props.filterMap[mainFilter].key2]"
                   type = "text"
                   :placeholder = "capitalize(props.filterMap[mainFilter].subTitle2)" :class = "props.inputStyle" @input="emitFilter()" />
            <div v-if="props.filterMap[mainFilter].description2" :class="props.filterMap[mainFilter].descriptionStyle2 ? props.filterMap[mainFilter].descriptionStyle2 : ''">
              {{ props.filterMap[mainFilter].description2 }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import AutoComplete from './AutoComplete.vue';

interface FilterOption {
  key: string;
  value: string;
}

interface FilterMapItem {
  title?: string;
  key: string;
  size?: number;
  type?: 'text' | 'select' | 'multiSelect' | 'range';
  placeholder?: string;
  options?: FilterOption[];
  multiSelectLabel?: string;
  multiSelectKey?: string;
  multipleSelect?: boolean;
  filterOptions?: any[];
  description?: string;
  descriptionStyle?: string;
  subTitle1?: string;
  subTitle2?: string;
  description1?: string;
  description2?: string;
  descriptionStyle1?: string;
  descriptionStyle2?: string;
  selectPlaceholder?: string;
}

const props = defineProps({
  filterOptions: {
    type: Array as PropType<FilterOption[]>,
    default: () => [
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
  },
  filterMap: {
    type: Object as PropType<{ [key: string]: FilterMapItem }>,
    default: () => ({
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
    })
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
    default: () => ({})
  },
  mainFilterOptions: {
    type: Object,
    default: () => ({
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle: 'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
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
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: false,
      filterSearchable: false,
      errorOccurred: false,
      withIcon: true,
    })
  },
  singleSelectFilterOptions: {
    type: Object,
    default: () => ({
      selectLabel: '',
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle: 'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
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
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: false,
      filterSearchable: false,
      errorOccurred: false,
      withIcon: false,
    })
  },
  multiSelectFilterOptions: {
    type: Object,
    default: () => ({
      selectLabel: '',
      selectWrapperStyle: 'w-max',
      selectStyle: 'default-select-style-chooser relative',
      labelStyle: 'text-md font-base mr-2 mb-1',
      labelInsideStyle: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
      labelInsideDefaultStyle: 'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
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
      filterIconIcomoon: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
      focusStyle: 'border border-Blue rounded-xl',
      focusMarginStyle: 'px-0.5 py-0.5',
      filterClearable: false,
      filterSearchable: true,
      errorOccurred: false,
      withIcon: false,
    })
  }
});

const emit = defineEmits(['getFilter', 'itemsSelected']);

const filters = ref([{ value: '' }]);
const selectedType = ref('');
const mainFilter = ref('All'); // Holds the selected filter type key (e.g., 'id', 'name')
const filterVal = ref<{ [key: string]: any }>({}); // Holds the actual value for the selected filter type
const value2 = ref(''); // Seems unused?
const toggleValue = ref(''); // Seems unused?

watch(() => props.clearFilters, () => {
  mainFilter.value = 'All';
  filterVal.value = {};
});

watch(() => props.mainFilterValue, (newVal) => {
  if (newVal.key && newVal.value && newVal.key !== '' && !String(newVal.value).includes("undefined")) {
    if (!newVal.key.includes("-/-")) {
      mainFilter.value = newVal.key;
      filterVal.value[mainFilter.value] = newVal.value;
    }
  }
}, { deep: true, immediate: true });

const capitalize = (value: string): string => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const updateFilterValue = (item: any) => {
  filterVal.value[mainFilter.value] = item;
};

const updateFilter = () => {
  let filter: { [key: string]: any } = {};
  for (const key in filterVal.value) {
    if (filterVal.value[key]) {
      filter[key] = filterVal.value[key];
    }
  }
  return filter;
};

// Method to clear the filter selection and value
// TODO: Revisit during testing to ensure it correctly resets state and interacts with AutoComplete.
const clear = () => {
  mainFilter.value = 'All'; // Reset the filter type selector
  filterVal.value = {}; // Clear the stored filter values
  // Optionally, emit an event if the parent needs to know it was cleared programmatically
  // emit('getFilter', updateFilter());
};

// Expose the clear method to the parent component
defineExpose({
  clear,
});

const emitFilter = (item?: any) => {
  if (item) {
    updateFilterValue(item);
  }
  if (props.emitAll === false) {
    emit('getFilter', updateFilter());
  }
};
</script>

<style scoped>

</style>
