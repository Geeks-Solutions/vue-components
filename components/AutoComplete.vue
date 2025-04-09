<template>
  <div :class="selectWrapperStyle">
    <div :class="[selectStyle, errorOccurredModel ? selectErrorClass : '', withIcon ? selectIconClass : '', labelOutside ? '' : labelInsideClass]">
      <div v-if="selectLabel" :class="[labelClass, withIcon ? labelPaddingWithIcon : labelPadding]">
        {{ selectLabel }}
      </div>
      <div :class="[focused ? focusStyle : '']">
        <div class="relative" :class="[focused ? focusMarginStyle : '']">
          <v-select
            v-model="filterModel"
            :placeholder="selectPlaceholder"
            :label="filterLabelProp"
            :options="filterOptions"
            :clearable="filterClearable"
            :disabled="filterDisabled"
            :reduce="reduce"
            :multiple="multiple"
            :close-on-select="closeOnSelect"
            :clear-on-select="clearOnSelect"
            :preserve-search="preserveSearch"
            :track-by="trackBy"
            :preselect-first="preselectFirst"
            :searchable="filterSearchable"
            @input="(val) => {filterModel = val; emit('itemSelected', val)}"
            @search="(search) => {selectIsSearching = search !== ''}"
          >
            <template #selected-option="{ selected, label }">
              <slot name="selected-option" :selected="selected" :label="label"></slot>
            </template>
            <template #option="{ option, label }">
              <slot name="option" :option="option" :label="label"></slot>
            </template>
          </v-select>
          <span v-if="withIcon" :class="filterIconIcomoon"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';

const props = defineProps({
  selectWrapperStyle: {
    type: String,
    default: 'w-max'
  },
  selectLabel: {
    type: String,
    default: ''
  },
  selectStyle: {
    type: String,
    default: 'default-select-style-chooser relative'
  },
  labelStyle: {
    type: String,
    default: 'text-md font-base mr-2 mb-1'
  },
  labelInsideStyle: {
    type: String,
    default: 'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10'
  },
  labelInsideDefaultStyle: {
    type: String,
    default: 'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10'
  },
  labelPaddingWithIcon: {
    type: String,
    default: 'left-12'
  },
  labelPadding: {
    type: String,
    default: 'left-3'
  },
  selectErrorClass: {
    type: String,
    default: 'select-error-class'
  },
  selectIconClass: {
    type: String,
    default: 'select-icon-class'
  },
  labelInsideClass: {
    type: String,
    default: 'label-inside-class'
  },
  trackBy: {
    type: String,
    default: ''
  },
  focused: {
    type: Boolean,
    default: false
  },
  filterDisabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  closeOnSelect: {
    type: Boolean,
    default: true
  },
  preserveSearch: {
    type: Boolean,
    default: false
  },
  preselectFirst: {
    type: Boolean,
    default: false
  },
  clearOnSelect: {
    type: Boolean,
    default: false
  },
  multipleSelection: {
    type: Boolean,
    default: false
  },
  reduce: {
    type: Function,
    default: (val: any) => val
  },
  labelOutside: {
    type: Boolean,
    default: true
  },
  mainFilter: {
    type: Object,
    default: null
  },
  selectPlaceholder: {
    type: String,
    default: ''
  },
  filterLabelProp: {
    type: String,
    default: 'value'
  },
  filterIconIcomoon: {
    type: String,
    default: 'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle'
  },
  focusStyle: {
    type: String,
    default: 'border border-Blue rounded-xl'
  },
  focusMarginStyle: {
    type: String,
    default: 'px-0.5 py-0.5'
  },
  filterClearable: {
    type: Boolean,
    default: false
  },
  filterSearchable: {
    type: Boolean,
    default: true
  },
  errorOccurred: {
    type: Boolean,
    default: false
  },
  withIcon: {
    type: Boolean,
    default: false
  },
  filterOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['itemSelected']);

const filterModel = ref(props.mainFilter || null);
const errorOccurredModel = ref(props.errorOccurred);
const selectIsSearching = ref(false);

watch(() => props.mainFilter, (newVal) => {
  filterModel.value = newVal;
}, { immediate: true, deep: true });

watch(() => props.errorOccurred, (newVal) => {
  errorOccurredModel.value = newVal;
}, { immediate: true, deep: true });

const labelClass = computed(() => {
  if (props.labelOutside) {
    return props.labelStyle;
  } else {
    if (filterModel.value !== undefined && filterModel.value !== null) {
      if (filterModel.value.length === 0 && !selectIsSearching.value) {
        return props.labelInsideDefaultStyle;
      } else {
        return props.labelInsideStyle;
      }
    } else {
      if (!selectIsSearching.value) {
        return props.labelInsideDefaultStyle;
      } else {
        return props.labelInsideStyle;
      }
    }
  }
});

</script>

<style>
@media only screen and (max-width:480px) {
  .default-select-style-chooser .vs--searchable .vs__dropdown-toggle {
    min-width: 220px;
    max-width: 320px;
  }
}
@media only screen and (min-width:769px) {
  .default-select-style-chooser .vs--searchable .vs__dropdown-toggle {
    min-width: 250px;
  }
}
.default-select-style-chooser .vs--searchable .vs__dropdown-toggle {
  border-radius: 10px;
  border: 1px solid #c2c2c2;
  width: 100%;
  min-height: 49px;
  padding-left: 0;
}
.default-select-style-chooser.select-icon-class .vs--searchable .vs__dropdown-toggle {
  padding-left: 35px;
}
.default-select-style-chooser.label-inside-class .vs--searchable .vs__dropdown-toggle {
  padding-bottom: 0;
}
.default-select-style-chooser.select-error-class .vs--searchable .vs__dropdown-toggle {
  border: 1px solid #BA0202;
}
.default-select-style-chooser.select-error-class .vs__open-indicator {
  fill: #BA0202;
}
.default-select-style-chooser.select-error-class .vs--searchable .vs__dropdown-toggle:hover {
  border: 1px solid #BA0202;
}
.default-select-style-chooser .vs--searchable .vs__dropdown-toggle:hover {
  border: 1px solid #737373;
}
.default-select-style-chooser .vs--searchable .vs__dropdown-toggle:focus {
  border: 1px solid #03B1C7;
}
.default-select-style-chooser.selected .vs--searchable .vs__dropdown-toggle {
  padding-left: unset;
}
.default-select-style-chooser .vs__actions {
  padding: 4px 14px 0 3px !important;
}
.default-select-style-chooser .vs--open .vs__dropdown-toggle {
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.default-select-style-chooser .vs__dropdown-menu {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.default-select-style-chooser .vs--open .vs__dropdown-menu {
  border-top: 0;
}
.default-select-style-chooser .vs__dropdown-toggle ul li {
  margin-top: 5px;
  margin-bottom: 5px;
}
.default-select-style-chooser.label-inside-class .vs--single.vs--loading .vs__selected, .vs--single.vs--open .vs__selected {
  position: relative !important;
}
.default-select-style-chooser .vs__selected {
  margin: 4px 0 0 4px;
}
.default-select-style-chooser.label-inside-class .vs__selected {
  margin: 12px 0 0 4px;
}

.default-select-style-chooser.label-inside-class .vs__search, .vs__search:focus {
  padding-top: 5px;
  font-size: 12px;
}
.default-select-style-chooser .filterIconStyle {
  top: 1.1rem;
}
.vs__selected-options input::placeholder {
  color: #737373;
  font-size: 12px;
}
@media only screen and (max-width:480px) {
  .default-select-style-chooser .vs--unsearchable .vs__dropdown-toggle {
    min-width: 220px;
    max-width: 320px;
  }
}
@media only screen and (min-width:768px) {
  .default-select-style-chooser .vs--unsearchable .vs__dropdown-toggle {
    min-width: 250px;
  }
}
.default-select-style-chooser .vs--unsearchable .vs__dropdown-toggle {
  border-radius: 10px;
  border: 1px solid #c2c2c2;
  width: 100%;
  min-height: 49px;
  padding-left: 0;
}
.default-select-style-chooser .vs--open.vs--unsearchable .vs__dropdown-toggle {
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.default-select-style-chooser.select-icon-class .vs--unsearchable .vs__dropdown-toggle {
  padding-left: 35px;
}
.default-select-style-chooser.label-inside-class .vs--unsearchable .vs__dropdown-toggle {
  padding-bottom: 0;
}
.default-select-style-chooser.select-error-class .vs--unsearchable .vs__dropdown-toggle {
  border: 1px solid #BA0202;
}
.default-select-style-chooser.select-error-class .vs__open-indicator {
  fill: #BA0202;
}
.default-select-style-chooser.select-error-class .vs--unsearchable .vs__dropdown-toggle:hover {
  border: 1px solid #BA0202;
}
.default-select-style-chooser .vs--unsearchable .vs__dropdown-toggle:hover {
  border: 1px solid #737373;
}
.default-select-style-chooser .vs--unsearchable .vs__dropdown-toggle:focus {
  border: 1px solid #03B1C7;
}
.default-select-style-chooser.selected .vs--unsearchable .vs__dropdown-toggle {
  padding-left: unset;
}

</style>
