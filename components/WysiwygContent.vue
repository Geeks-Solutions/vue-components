<template>
  <div :class="[wrapperDefaultClasses, wrapperClasses]">
    <component :is="tag" :class="[defaultClasses, classes]" v-html="htmlContent"></component>
  </div>
</template>

<script>
export default {
  name: "WysiwygContent",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    htmlContent: {
      type: String,
      default: ""
    },
    wrapperDefaultClasses: {
      type: String,
      default: "ql-snow"
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    defaultClasses: {
      type: String,
      default: "ql-editor"
    },
    classes: {
      type: String,
      default: ""
    }
  },
  created() {
    import("quill/dist/quill.snow.css");
  }
}
</script>
