<template>
  <div class="input wyzywig-wrapper">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>
    <component :is="QuillComponent" :key="quillKey" ref="myQuillEditor" v-model="settings" :options="options" class="wyzywig" />
    <MediaComponent ref="sectionsMediaComponent" :content-used-key="contentUsedKey" :auth-token="authToken" :server-url="serverUrl" :project-id="projectIdProp" :sections-user-id="sectionsUserId" :selected-media-id="$route.query.id" :media-translation-prefix="mediaTranslationPrefix" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
  </div>
</template>
<script>
import MediaComponent from "./MediaComponent";

/* eslint-disable camelcase */

export default {
  components: {
    MediaComponent
  },
  props: {
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
      default() {
        return {}
      }
    },
    sectionsWysiwygEditorOptions: {
      type: Object,
      default() {
        return {}
      }
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
  },
  data() {
    return {
      settings: "",
      savedFormat: null,
      selectedMedia: null,
      options: null,
      selectedRange: null,
      QuillComponent: null
    };
  },
  watch: {
    settings() {
      this.$emit('settingsUpdate', this.settings)
    },
    html: {
      handler() {
        this.settings = this.html
      },
      deep: true,
      immediate: true
    },
    selectedMedia(mediaObject) {
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
      };
      media.files[0].url = mediaObject.files[0].url;
      media.files[0].filename = mediaObject.files[0].filename;
      media.media_id = mediaObject.id;
      media.url = mediaObject.files[0].url;
      media.seo_tag = mediaObject.seo_tag;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }

      if (this.selectedRange) {
        this.$refs.myQuillEditor.quill.deleteText(this.selectedRange.index, this.selectedRange.length)
      }

      const range = this.$refs.myQuillEditor.quill.getSelection();
      this.$refs.myQuillEditor.quill.insertEmbed(this.selectedRange ? this.selectedRange.index : range ? range.index : 0, 'image', media.url);

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.$refs.myQuillEditor.quill.root.innerHTML, 'text/html');
        const imgTags = doc.querySelectorAll('img');
        imgTags.forEach(img => {
          if (!img.hasAttribute('media-id')) {
            img.setAttribute('media-id', media.media_id);
          }
          if (!img.hasAttribute('alt') && media.seo_tag) {
            img.setAttribute('alt', media.seo_tag);
          }
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
        });
        this.$refs.myQuillEditor.quill.root.innerHTML = doc.body.innerHTML;
      } catch {}

      this.$emit('wysiwygMedia', media);
      this.$refs.sectionsMediaComponent.closeModal()
    }
  },
  created() {
    import("quill/dist/quill.snow.css");
    if (process.client) {
      let Emoji = require("@devdcodes9/quill-emojijs");
      import("@devdcodes9/quill-emojijs/dist/quill-emoji.css");
      let Quill = require('quill').default;

      Quill.prototype.pasteHTML = function (html) {
        this.setContents(this.clipboard.convert({
          html: html,
          text: '\n'
        }))
      };

      Quill.register("modules/emoji-toolbar", Emoji.default.ToolbarEmoji);
      Quill.register('formats/emoji', Emoji.default.EmojiBlot);

      const ImageBlot = Quill.import("formats/image");
      class CustomImageBlot extends ImageBlot {
        static blotName = "customImage";
        static tagName = "img";

        /**
         * Converts the HTML tag to image blot
         * @param value
         */
        static create(value) {
          let node = super.create();
          Object.getOwnPropertyNames(value).forEach((attribute_name) => {
            node.setAttribute(attribute_name, value[attribute_name]);
          });

          return node;
        }

        /**
         * Converts the image blot to HTML tag
         * @param node
         */
        static value(node) {
          var blot = {};
          node.getAttributeNames().forEach((attribute_name) => {
            blot[attribute_name] = node.getAttribute(attribute_name);
          });

          return blot;
        }
      }
      Quill.register(CustomImageBlot);

      const BlockEmbed = Quill.import('blots/block/embed');
      class RawHTMLBlot extends BlockEmbed {
        static create(value) {
          const node = super.create();
          node.innerHTML = value; // Insert the raw HTML
          return node;
        }
        static value(node) {
          return node.innerHTML; // Extract the raw HTML when needed
        }
      }
      RawHTMLBlot.blotName = 'rawHtml';
      RawHTMLBlot.tagName = 'div';
      Quill.register(RawHTMLBlot);

      let rawHtml = require("quill-html-edit-button");
      Quill.register("modules/htmlEditButton", rawHtml.htmlEditButton);

      window.Quill = Quill
    }

    if(this.editorOptions.modules && Object.keys(this.editorOptions.modules).length > 0) {
      this.options = this.editorOptions
    } else if(this.sectionsWysiwygEditorOptions && Object.keys(this.sectionsWysiwygEditorOptions).length > 0) {
      this.options = this.sectionsWysiwygEditorOptions
    } else {
      this.options = {
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
  },
  async mounted() {
    await import('vue-quill-editor').then(module => {
      this.QuillComponent = module.quillEditor
      this.$nextTick(() => {
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', () => {
          this.selectedRange = null
          let selectedMedia = ''
          try {
            const range = this.$refs.myQuillEditor.quill.getSelection();
            if (range && range.length > 0) {
              this.selectedRange = range
              const delta = this.$refs.myQuillEditor.quill.getContents(range.index, range.length);
              if (delta && delta.ops && delta.ops.length > 0 && delta.ops.length === 1 && delta.ops[0] && delta.ops[0].insert && delta.ops[0].insert.customImage && delta.ops[0].insert.customImage['media-id']) {
                selectedMedia = delta.ops[0].insert.customImage['media-id']
              }
            }
          } catch {}

          this.uploadFunction(selectedMedia);
        });

        var saveButtons = document.querySelectorAll('.ql-save-format');
        saveButtons.forEach((saveButton) => {
          saveButton.addEventListener('click', () => {
            this.saveFormat()
          });
        })

        var applyButtons = document.querySelectorAll('.ql-apply-format');
        applyButtons.forEach((applyButton) => {
          applyButton.addEventListener('click', () => {
            this.applyFormat()
          });
        })
      })
    })
  },
  methods: {
    validate() {
      return true;
    },
    uploadFunction(mediaId = null) {
      this.$refs.sectionsMediaComponent.openModal(mediaId, null)
    },
    saveFormat() {
      const selection = this.$refs.myQuillEditor.quill.getSelection();
      if (selection) {
        const savedFormat = JSON.stringify(this.$refs.myQuillEditor.quill.getFormat(selection));
        this.$cookies.set('sections-quill-format', savedFormat);
      }
    },
    applyFormat() {
      const selection = this.$refs.myQuillEditor.quill.getSelection();
      const savedFormat = this.$cookies.get('sections-quill-format');

      if (selection && savedFormat) {
        this.$refs.myQuillEditor.quill.formatText(selection.index, selection.length, savedFormat);
      }
    }
  }
};
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
</style>
