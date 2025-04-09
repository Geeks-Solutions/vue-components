<template>
  <div class="input wyzywig-wrapper">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>
    <component :is="QuillComponent" :key="quillKey" ref="myQuillEditor" v-model="settings" :options="options" class="wyzywig" />
    <MediaComponent ref="sectionsMediaComponent" :content-used-key="contentUsedKey" :auth-token="authToken" :server-url="serverUrl" :project-id="projectIdProp" :sections-user-id="sectionsUserId" :selected-media-id="$route.query.id" :media-translation-prefix="mediaTranslationPrefix" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useCookies } from '@vueuse/core'
import MediaComponent from "./MediaComponent.vue"

/* eslint-disable camelcase */

// Define props
const props = defineProps({
  html: {
    type: String,
    default: ""
  },
  quillKey: {
    type: String,
    default: "quillKey"
  },
  editorOptions: {
    type: Object,
    default: () => ({})
  },
  sectionsWysiwygEditorOptions: {
    type: Object,
    default: () => ({})
  },
  authToken: {
    type: String,
    default: ''
  },
  sectionsUserId: {
    type: String,
    default: ''
  },
  projectIdProp: {
    type: String,
    default: ''
  },
  serverUrl: {
    type: String,
    default: ''
  },
  selectedMediaId: {
    type: String,
    default: ''
  },
  contentUsedKey: {
    type: String,
    default: "title"
  },
  mediaTranslationPrefix: {
    type: String,
    default: "mediaT."
  }
})

// Define emits
const emit = defineEmits(['settingsUpdate', 'wysiwygMedia'])

// Reactive state
const settings = ref("")
const savedFormat = ref(null)
const selectedMedia = ref(null)
const options = ref(null)
const selectedRange = ref(null)
const QuillComponent = ref(null)

// Template refs
const myQuillEditor = ref(null)
const sectionsMediaComponent = ref(null)

// Cookies
const cookies = useCookies()

// Watch for changes
watch(settings, () => {
  emit('settingsUpdate', settings.value)
})

watch(() => props.html, () => {
  settings.value = props.html
}, { deep: true, immediate: true })

watch(selectedMedia, (mediaObject) => {
  if (!mediaObject) return
  
  const media = {
    media_id: "",
    url: "",
    seo_tag: "",
    files: [
      {
        filename: "",
        url: ""
      }
    ],
    headers: {}
  }
  
  media.files[0].url = mediaObject.files[0].url
  media.files[0].filename = mediaObject.files[0].filename
  media.media_id = mediaObject.id
  media.url = mediaObject.files[0].url
  media.seo_tag = mediaObject.seo_tag
  
  if (mediaObject.files[0].headers) {
    media.headers = mediaObject.files[0].headers
  }

  if (selectedRange.value) {
    myQuillEditor.value.quill.deleteText(selectedRange.value.index, selectedRange.value.length)
  }

  const range = myQuillEditor.value.quill.getSelection()
  myQuillEditor.value.quill.insertEmbed(
    selectedRange.value ? selectedRange.value.index : range ? range.index : 0,
    'image',
    media.url
  )

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(myQuillEditor.value.quill.root.innerHTML, 'text/html')
    const imgTags = doc.querySelectorAll('img')
    
    imgTags.forEach(img => {
      if (!img.hasAttribute('media-id')) {
        img.setAttribute('media-id', media.media_id)
      }
      if (!img.hasAttribute('alt') && media.seo_tag) {
        img.setAttribute('alt', media.seo_tag)
      }
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy')
      }
    })
    
    myQuillEditor.value.quill.root.innerHTML = doc.body.innerHTML
  } catch (error) {
    console.error('Error processing image:', error)
  }

  emit('wysiwygMedia', media)
  sectionsMediaComponent.value.closeModal()
})

// Initialize Quill
onMounted(async () => {
  // Import CSS
  await import("quill/dist/quill.snow.css")
  
  if (process.client) {
    // Setup Quill with plugins
    let Emoji = await import("@devdcodes9/quill-emojijs")
    await import("@devdcodes9/quill-emojijs/dist/quill-emoji.css")
    let Quill = (await import('quill')).default

    // Add pasteHTML method
    Quill.prototype.pasteHTML = function (html) {
      this.setContents(this.clipboard.convert({
        html: html,
        text: '\n'
      }))
    }

    // Register emoji modules
    Quill.register("modules/emoji-toolbar", Emoji.default.ToolbarEmoji)
    Quill.register('formats/emoji', Emoji.default.EmojiBlot)

    // Custom image blot
    const ImageBlot = Quill.import("formats/image")
    class CustomImageBlot extends ImageBlot {
      static blotName = "customImage"
      static tagName = "img"

      /**
       * Converts the HTML tag to image blot
       * @param value
       */
      static create(value) {
        let node = super.create()
        Object.getOwnPropertyNames(value).forEach((attribute_name) => {
          node.setAttribute(attribute_name, value[attribute_name])
        })
        return node
      }

      /**
       * Converts the image blot to HTML tag
       * @param node
       */
      static value(node) {
        var blot = {}
        node.getAttributeNames().forEach((attribute_name) => {
          blot[attribute_name] = node.getAttribute(attribute_name)
        })
        return blot
      }
    }
    Quill.register(CustomImageBlot)

    // Raw HTML blot
    const BlockEmbed = Quill.import('blots/block/embed')
    class RawHTMLBlot extends BlockEmbed {
      static create(value) {
        const node = super.create()
        node.innerHTML = value // Insert the raw HTML
        return node
      }
      static value(node) {
        return node.innerHTML // Extract the raw HTML when needed
      }
    }
    RawHTMLBlot.blotName = 'rawHtml'
    RawHTMLBlot.tagName = 'div'
    Quill.register(RawHTMLBlot)

    // HTML edit button
    let rawHtml = await import("quill-html-edit-button")
    Quill.register("modules/htmlEditButton", rawHtml.htmlEditButton)

    // Make Quill available globally
    window.Quill = Quill
    
    // Set editor options
    if (props.editorOptions.modules && Object.keys(props.editorOptions.modules).length > 0) {
      options.value = props.editorOptions
    } else if (props.sectionsWysiwygEditorOptions && Object.keys(props.sectionsWysiwygEditorOptions).length > 0) {
      options.value = props.sectionsWysiwygEditorOptions
    } else {
      options.value = {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['link', 'image', 'video', 'formula'],
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': ['#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['emoji'],
            ["save-format", "apply-format"],
          ],
          "emoji-toolbar": true,
          htmlEditButton: {},
        }
      }
    }
    
    // Import and setup quill editor
    const quillEditorModule = await import('@vueuse/core')
    QuillComponent.value = quillEditorModule.quillEditor
    
    // Setup toolbar handlers after component is mounted
    nextTick(() => {
      if (myQuillEditor.value && myQuillEditor.value.quill) {
        // Add image handler
        myQuillEditor.value.quill.getModule('toolbar').addHandler('image', () => {
          selectedRange.value = null
          let selectedMedia = ''
          
          try {
            const range = myQuillEditor.value.quill.getSelection()
            if (range && range.length > 0) {
              selectedRange.value = range
              const delta = myQuillEditor.value.quill.getContents(range.index, range.length)
              
              if (delta && delta.ops && delta.ops.length > 0 && delta.ops.length === 1 &&
                  delta.ops[0] && delta.ops[0].insert && delta.ops[0].insert.customImage &&
                  delta.ops[0].insert.customImage['media-id']) {
                selectedMedia = delta.ops[0].insert.customImage['media-id']
              }
            }
          } catch (error) {
            console.error('Error getting selection:', error)
          }

          uploadFunction(selectedMedia)
        })

        // Add save format button handler
        const saveButtons = document.querySelectorAll('.ql-save-format')
        saveButtons.forEach((saveButton) => {
          saveButton.addEventListener('click', saveFormat)
        })

        // Add apply format button handler
        const applyButtons = document.querySelectorAll('.ql-apply-format')
        applyButtons.forEach((applyButton) => {
          applyButton.addEventListener('click', applyFormat)
        })
      }
    })
  }
})

// Methods
const validate = () => {
  return true
}

const uploadFunction = (mediaId = null) => {
  sectionsMediaComponent.value.openModal(mediaId, null)
}

const saveFormat = () => {
  const selection = myQuillEditor.value.quill.getSelection()
  if (selection) {
    const savedFormatValue = JSON.stringify(myQuillEditor.value.quill.getFormat(selection))
    cookies.set('sections-quill-format', savedFormatValue)
  }
}

const applyFormat = () => {
  const selection = myQuillEditor.value.quill.getSelection()
  const savedFormatValue = cookies.get('sections-quill-format')

  if (selection && savedFormatValue) {
    myQuillEditor.value.quill.formatText(selection.index, selection.length, savedFormatValue)
  }
}
</script>

<style>
.ql-save-format:after {
  content: "Save format";
}

.ql-apply-format:after {
  content: "Apply format";
}

.ql-formats button.ql-save-format {
  width: 100px !important;
  padding: 0 !important;
}

.ql-formats button.ql-apply-format {
  width: 100px !important;
  padding: 0 !important;
}
.quill-editor.wyzywig img {
  display: inline !important;
}
.quill-editor.wyzywig .ql-toolbar.ql-snow {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
main.sections-main .input.wyzywig-wrapper {
  margin: 0 128px;
}
aside.sections-aside .input.wyzywig-wrapper {
  margin-right: 80px;
}
.ql-html-popupContainer button.ql-html-buttonCancel {
  outline: none;
  max-width: 1000px;
  display: flex;
  background: #31a9db;
  border: none;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
}

.ql-html-popupContainer button.ql-html-buttonOk {
  outline: none;
  max-width: 1000px;
  display: flex;
  background: #31a9db;
  border: none;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
}

.ql-html-popupContainer .ql-html-buttonGroup {
  display: flex;
}
.emoji_completions {
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
#emoji-palette {
  margin-top: 30px;
}
</style>
