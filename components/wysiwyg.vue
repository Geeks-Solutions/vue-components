<template>
  <div title="" class="input wyzywig-wrapper">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>
    <component :is="QuillComponent" :key="quillKey" ref="myQuillEditor" v-model="settings" :options="options" class="wyzywig" />
    <MediaComponent ref="sectionsMediaComponent" :content-used-key="contentUsedKey" :auth-token="authToken" :server-url="serverUrl" :project-id="projectIdProp" :sections-user-id="sectionsUserId" :selected-media-id="$route.query.id" :media-translation-prefix="mediaTranslationPrefix" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
  </div>
</template>
<script>
import MediaComponent from "./MediaComponent";
import {initLottieFromHtml} from "./media/medias";

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
      QuillComponent: null,
      fontsArray: [
        "0.25rem", "0.5rem", "0.75rem", false, "1.25rem", "1.5rem", "1.75rem", "2rem",
        "2.25rem", "2.5rem", "2.75rem", "3rem", "3.25rem", "3.5rem", "3.75rem", "4rem",
        "4.25rem", "4.5rem", "4.75rem", "5rem", "5.25rem", "5.5rem", "5.75rem", "6rem",
        "6.25rem", "6.5rem", "6.75rem", "7rem", "7.25rem", "7.5rem", "7.75rem", "8rem"
      ],
      editableMediaId: null
    };
  },
  watch: {
    settings() {
      this.$emit('settingsUpdate', this.settings)
    },
    html: {
      async handler() {
        this.settings = this.html
        await this.initializeLottie(this.$refs.myQuillEditor?.$el)
      },
      deep: true,
      immediate: true
    },
    async selectedMedia(mediaObject) {
      this.editableMediaId = null
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
      media.metadata = mediaObject.metadata;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }

      if (this.selectedRange) {
        this.$refs.myQuillEditor.quill.deleteText(this.selectedRange.index, this.selectedRange.length)
      }

      const range = this.$refs.myQuillEditor.quill.getSelection();

      if (media.metadata?.type === 'lottie') {
        this.$refs.myQuillEditor.quill.insertEmbed(this.selectedRange ? this.selectedRange.index : range ? range.index : 0, 'lottie', {
          'lottie-id': `lottie-${media.media_id}`,
          src: media.url,
          'media-id': media.media_id,
          'media-type': media.metadata?.type || 'image',
        }, Quill.sources.USER);
        await this.initializeLottie(this.$refs.myQuillEditor?.$el)
      } else {
        this.$refs.myQuillEditor.quill.insertEmbed(this.selectedRange ? this.selectedRange.index : range ? range.index : 0, 'image', media.url);
      }

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

      const Embed = Quill.import('blots/embed');
      class ButtonBlot extends Embed {
        static create(value) {
          const node = super.create();

          const buttonContainer = document.createElement('button');
          buttonContainer.className = 'quill-button-container';

          buttonContainer.setAttribute('type', 'button');

          buttonContainer.setAttribute('data-button-id', 'button-' + Date.now() + '-' + Math.floor(Math.random() * 1000));

          const anchor = document.createElement('a');
          anchor.innerText = value.label || 'Button';
          anchor.href = value.link || '#';
          anchor.className = 'ql-a-button';
          // anchor.target = '_blank';

          buttonContainer.setAttribute('data-label', value.label || 'Button');
          buttonContainer.setAttribute('data-link', value.link || '#');

          buttonContainer.appendChild(anchor);

          node.appendChild(buttonContainer);

          return node;
        }

        static value(node) {
          const buttonContainer = node.querySelector('.quill-button-container');
          return {
            label: buttonContainer ? buttonContainer.getAttribute('data-label') : '',
            link: buttonContainer ? buttonContainer.getAttribute('data-link') : ''
          };
        }
      }

      ButtonBlot.blotName = 'button';
      ButtonBlot.tagName = 'span';
      ButtonBlot.className = 'quill-button-wrapper';

      Quill.register(ButtonBlot);

      class ButtonToolbarModule {
        constructor(quill, options) {
          this.quill = quill;
          this.options = options;
          this.toolbar = quill.getModule('toolbar');

          if (this.toolbar) {
            this.toolbar.addHandler('button', this.handleButtonAction.bind(this));
          }

          this.quill.on('selection-change', this.handleSelectionChange.bind(this));
        }

        handleSelectionChange(range) {
          this.selectedButtonId = null;

          if (!range) return;

          const [blot] = this.quill.getLeaf(range.index);
          if (!blot) return;

          let currentNode = blot.domNode;
          while (currentNode && !this.selectedButtonId) {
            if (currentNode.classList && currentNode.classList.contains('quill-button-wrapper')) {
              const buttonContainer = currentNode.querySelector('.quill-button-container');
              if (buttonContainer) {
                this.selectedButtonId = buttonContainer.getAttribute('data-button-id');
              }
              break;
            }
            currentNode = currentNode.parentNode;
          }
        }

        handleButtonAction() {
          if (this.selectedButtonId) {
            const buttonElement = this.quill.root.querySelector(`.quill-button-container[data-button-id="${this.selectedButtonId}"]`);
            if (buttonElement) {
              this.editButton(buttonElement);
              return;
            }
          }

          this.createButton();
        }

        createButton() {
          const label = prompt('Button Label:', '');
          if (!label) return; // Cancel if no label

          const link = prompt('Button Link:', '');

          const range = this.quill.getSelection(true);

          this.quill.insertEmbed(range.index, 'button', {
            label: label,
            link: link
          }, Quill.sources.USER);

          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }

        editButton(buttonElement) {
          if (!buttonElement) return;

          const currentLabel = buttonElement.getAttribute('data-label');
          const currentLink = buttonElement.getAttribute('data-link');

          const newLabel = prompt('Edit Button Label:', currentLabel);
          if (newLabel === null) return; // User canceled

          const newLink = prompt('Edit Button Link:', currentLink);

          const anchorElement = buttonElement.querySelector('a');
          anchorElement.innerText = newLabel;
          anchorElement.href = newLink;

          buttonElement.setAttribute('data-label', newLabel);
          buttonElement.setAttribute('data-link', newLink);

          this.selectedButtonId = null;
        }
      }

      Quill.register('modules/buttonToolbar', ButtonToolbarModule);



      const BlockEmbed2 = Quill.import('blots/block/embed');

      class HTMLBlot extends BlockEmbed2 {
        static create(value) {
          const node = super.create();

          // Create a div to hold our HTML content
          const container = document.createElement('div');
          container.classList.add('ql-html-container');
          container.innerHTML = value;

          // Add container to the blot's DOM node
          node.appendChild(container);

          // Store the raw HTML for retrieval later
          node.setAttribute('data-html', value);

          return node;
        }

        static value(node) {
          return node.getAttribute('data-html');
        }
      }

      HTMLBlot.blotName = 'html';
      HTMLBlot.tagName = 'div';
      HTMLBlot.className = 'ql-custom-html';

// Register the blot with Quill
      Quill.register(HTMLBlot);

// HTML Module with improved UI
      class HTMLModule {
        constructor(quill, options) {
          this.quill = quill;
          this.options = options || {};
          this.toolbar = quill.getModule('toolbar');

          if (this.toolbar) {
            this.toolbar.addHandler('html', this.handleHTML.bind(this));
          }

          // Create HTML editor modal (but don't append to DOM yet)
          this.createHTMLEditor();
        }

        createHTMLEditor() {
          // Create modal container
          this.modal = document.createElement('div');
          this.modal.className = 'ql-html-editor-modal';

          // Create modal content
          const modalContent = document.createElement('div');
          modalContent.className = 'ql-html-editor-content';

          // Create textarea for HTML editing
          this.htmlEditor = document.createElement('textarea');
          this.htmlEditor.className = 'ql-html-editor-textarea';

          // Create buttons
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'ql-html-editor-buttons';

          this.saveButton = document.createElement('button');
          this.saveButton.textContent = 'Save';
          this.saveButton.className = 'ql-html-editor-save';

          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.className = 'ql-html-editor-cancel';

          const noteText = document.createElement('div');
          noteText.textContent = 'Use with cautions, when adding a new html content, make sure to wrap it with a <p></p> tag';
          noteText.className = 'ql-html-editor-noteText';

          // Append elements
          buttonContainer.appendChild(this.saveButton);
          buttonContainer.appendChild(cancelButton);
          buttonContainer.appendChild(noteText);

          modalContent.appendChild(this.htmlEditor);
          modalContent.appendChild(buttonContainer);

          this.modal.appendChild(modalContent);

          // Event listeners
          this.saveButton.addEventListener('click', () => {
            this.saveHTML();
          });

          cancelButton.addEventListener('click', () => {
            this.hideHTMLEditor();
          });

          // Close modal when clicking outside
          this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
              this.hideHTMLEditor();
            }
          });
        }

        handleHTML() {
          const range = this.quill.getSelection(true);
          this.range = range;

          // If editing existing HTML blot
          let existingHTML = '';

          // Get current content if no existing HTML
          if (!existingHTML) {
            existingHTML = this.quill.root.innerHTML;
          }

          // Show HTML editor
          this.showHTMLEditor(existingHTML);
        }

        showHTMLEditor(html) {
          // Set HTML content in textarea
          this.htmlEditor.value = html;

          // Append modal to body if not already there
          if (!document.body.contains(this.modal)) {
            document.body.appendChild(this.modal);
          }

          // Show modal
          this.modal.style.display = 'flex';

          // Focus textarea
          setTimeout(() => {
            this.htmlEditor.focus();
          }, 0);
        }

        hideHTMLEditor() {
          this.modal.style.display = 'none';
        }

        saveHTML() {
          const html = this.htmlEditor.value;

          if (html) {
            // Clear entire editor
            const length = this.quill.getLength();
            this.quill.deleteText(0, length, Quill.sources.USER);

            // Insert full HTML as a single custom 'html' blot
            this.quill.insertEmbed(0, 'html', html, Quill.sources.USER);
            this.quill.setSelection(this.quill.getLength(), 0, Quill.sources.USER);
          }

          this.hideHTMLEditor();
        }
      }

// Register the module with Quill
      Quill.register('modules/html', HTMLModule);

      class LottieBlot extends Embed {
        static blotName = 'lottie';
        static tagName = 'div';

        static create(value) {
          const node = super.create();
          if (value['lottie-id']) node.setAttribute('lottie-id', value['lottie-id']);
          if (value.src) node.setAttribute('src', value.src);
          if (value['media-id']) node.setAttribute('media-id', value['media-id']);
          if (value['media-type']) node.setAttribute('media-type', value['media-type']);
          node.setAttribute('contenteditable', 'false');
          node.style.display = 'inline-block'
          return node;
        }

        static value(node) {
          return {
            'lottie-id': node.getAttribute('lottie-id'),
            src: node.getAttribute('src'),
            'media-id': node.getAttribute('media-id'),
            'media-type': node.getAttribute('media-type'),
          };
        }
      }
      Quill.register(LottieBlot);

// Add styles for the HTML editor and icon
      const style = document.createElement('style');
      style.innerHTML = `
      div[lottie-id] canvas {
    pointer-events: none;
  }
  .ql-html-container {
    width: 100%;
  }

  /* HTML button icon */
  .ql-toolbar.ql-snow button.ql-html::before {
    content: "<>";
    font-family: monospace;
    font-weight: bold;
    font-size: 14px;
    display: flex;
  }

  /* Modal styles */
  .ql-html-editor-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    justify-content: center;
    align-items: center;
  }

  .ql-html-editor-content {
    background-color: white;
    border-radius: 5px;
    width: 80%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }

  .ql-html-editor-textarea {
    width: 100%;
    height: 60vh;
    padding: 15px;
    font-family: monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    resize: none;
  }

  .ql-html-editor-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    border-top: 1px solid #eee;
    position: relative;
  }

  .ql-html-editor-save,
  .ql-html-editor-cancel {
    max-height: 64px;
    width: auto;
    min-width: auto;
    border-radius: 16px;
    height: auto;
    padding: 6px 8px;
    min-height: auto;
    margin: 10px;
  }

  .ql-html-editor-noteText {
    font-size: 12px;
    position: absolute;
    left: 8px;
  }

  .ql-html-editor-save {
    background-color: #31a9db;
    color: white;
  }
`;
      document.head.appendChild(style);

      const fontSizeArr = this.fontsArray

      var Size = Quill.import('attributors/style/size');
      Size.whitelist = fontSizeArr;
      Quill.register(Size, true);

      var Link = Quill.import('formats/link');

      class MyLink extends Link {
        static create(value) {
          let node = super.create(value);
          value = this.sanitize(value);
          node.setAttribute('href', value);
          if(!value.startsWith("http")) {
            node.removeAttribute('target');
          }
          return node;
        }
      }

      Quill.register(MyLink);

      let QuillTableUI = require('quill-table-ui').default
      import("quill-table-ui/dist/index.css");

      Quill.register({
        'modules/tableUI': QuillTableUI
      }, true)

      window.Quill = Quill
    }

    if(this.editorOptions.modules && Object.keys(this.editorOptions.modules).length > 0) {
      this.options = this.editorOptions
    } else if(this.sectionsWysiwygEditorOptions && Object.keys(this.sectionsWysiwygEditorOptions).length > 0) {
      this.options = this.sectionsWysiwygEditorOptions
    } else {
      this.options = {
        modules: {
          toolbar: {
            container: [
              ["save-format", "apply-format"],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'size': this.fontsArray }],  // custom dropdown
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'color': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
              ['link', 'image', 'video'],
              [{ 'align': [] }],
              [{ 'list': 'bullet' }, { 'list': 'ordered'}],
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              ['clean'],

              ['show-additional'],
              ['formula'],
              ['blockquote', 'code-block'],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'direction': 'rtl' }],                         // text direction
              ['emoji'],
              ["button"],
              ['html'],
              ['table-button'],
            ],
            handlers: {
              'button': function() {},
              'html': function() {}
            }
          },
          "emoji-toolbar": true,
          buttonToolbar: true,
          html: true,
          table: true,
          tableUI: true
        }
      }
    }
  },
  async mounted() {
    await import('vue-quill-editor').then(module => {
      this.QuillComponent = module.quillEditor
      this.$nextTick(async () => {
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
              } else if (delta?.ops?.length === 1 && delta.ops[0].insert?.lottie?.['media-id']) {
                selectedMedia = delta.ops[0].insert.lottie['media-id'];
              }
            }
          } catch {}

          this.uploadFunction(selectedMedia);
        });

        var saveButtons = document.querySelectorAll('.ql-save-format');
        saveButtons.forEach((saveButton) => {
          saveButton.innerHTML = '<div title="Save format"><svg version="1.0" style="width: 20px;" xmlns="http://www.w3.org/2000/svg"\n' +
            ' width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"\n' +
            ' preserveAspectRatio="xMidYMid meet">\n' +
            '\n' +
            '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"\n' +
            'fill="#000000" stroke="none">\n' +
            '<path d="M4564 4761 c-86 -29 -141 -68 -273 -194 -70 -67 -617 -590 -1215\n' +
            '-1162 l-1088 -1040 54 -16 c278 -86 537 -332 643 -614 13 -33 27 -60 32 -60 8\n' +
            '0 2137 2220 2282 2380 64 71 98 140 113 230 35 213 -104 425 -316 481 -69 18\n' +
            '-170 16 -232 -5z"/>\n' +
            '<path d="M1614 2090 c-136 -17 -309 -85 -434 -170 -92 -63 -190 -176 -320\n' +
            '-368 -78 -117 -149 -210 -195 -255 -129 -130 -297 -226 -530 -303 -72 -24\n' +
            '-129 -48 -127 -54 7 -32 48 -103 93 -162 121 -161 372 -307 652 -379 222 -57\n' +
            '467 -73 672 -45 547 76 914 346 1021 751 28 105 26 302 -5 415 -74 276 -277\n' +
            '490 -526 554 -78 20 -212 27 -301 16z"/>\n' +
            '</g>\n' +
            '</svg></div>';
          saveButton.addEventListener('click', () => {
            this.saveFormat()
          });
        })

        var applyButtons = document.querySelectorAll('.ql-apply-format');
        applyButtons.forEach((applyButton) => {
          applyButton.innerHTML = '<div title="Apply format"><svg version="1.1" id="Layer_1" style="width: 20px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
            '\t width="100%" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">\n' +
            '<path fill="#FFFFFF" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M0.999999,399.000000 \n' +
            '\tC1.000000,266.392517 1.000000,133.785049 1.000000,1.088782 \n' +
            '\tC171.666641,1.088782 342.333313,1.088782 513.000000,1.091285 \n' +
            '\tC513.000000,23.083954 513.000000,45.074120 512.632446,67.407303 \n' +
            '\tC510.908478,59.553364 506.507568,52.990051 500.971741,46.640503 \n' +
            '\tC497.213013,43.876896 493.722839,41.208294 489.949005,39.031540 \n' +
            '\tC474.645020,30.204197 452.835052,33.115471 440.156372,45.294075 \n' +
            '\tC428.821594,56.181747 417.245209,66.817451 405.863281,77.656586 \n' +
            '\tC389.898621,92.859909 374.028320,108.162254 358.093414,123.396896 \n' +
            '\tC343.723206,137.135590 329.304688,150.823761 314.936127,164.564178 \n' +
            '\tC298.882690,179.915802 282.823364,195.261688 266.838287,210.684326 \n' +
            '\tC253.931122,223.137299 241.130295,235.700485 228.282852,248.215332 \n' +
            '\tC227.924988,248.563904 227.577484,248.923172 227.217682,249.269714 \n' +
            '\tC212.432648,263.509583 197.646729,277.748566 182.401077,291.991821 \n' +
            '\tC158.847260,290.388428 137.796753,296.551727 118.645607,309.200623 \n' +
            '\tC103.854942,318.969543 93.635750,332.976440 84.610176,347.884308 \n' +
            '\tC75.451485,363.011993 64.305077,376.281494 47.547211,382.963989 \n' +
            '\tC32.321110,389.035645 16.537714,393.709778 0.999999,399.000000 \n' +
            'z"/>\n' +
            '<path fill="#FFFFFF" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M513.000000,87.000000 \n' +
            '\tC513.000000,228.941162 513.000000,370.882324 513.000000,512.911743 \n' +
            '\tC342.333344,512.911743 171.666687,512.911743 1.000000,512.911743 \n' +
            '\tC1.000000,476.570587 1.000000,440.252289 1.316193,403.639221 \n' +
            '\tC3.106510,407.171936 4.511069,411.027863 6.067833,414.821381 \n' +
            '\tC10.695731,426.098602 16.903753,436.547516 26.197760,444.407715 \n' +
            '\tC34.050434,451.049011 42.694351,456.970001 51.663551,462.007019 \n' +
            '\tC58.719070,465.969360 66.804550,468.097626 74.702728,471.343262 \n' +
            '\tC88.762367,474.400787 102.444054,478.511780 116.364510,479.617798 \n' +
            '\tC142.418396,481.687927 167.999100,477.903931 192.345459,467.896729 \n' +
            '\tC216.198639,458.092194 235.501358,442.784363 247.574219,419.571991 \n' +
            '\tC256.629150,402.162140 258.916351,383.433411 256.884583,363.754028 \n' +
            '\tC260.717010,359.432861 264.330627,355.363251 268.083038,351.425995 \n' +
            '\tC282.706940,336.081787 297.377960,320.782471 312.025543,305.460815 \n' +
            '\tC326.328247,290.499908 340.620300,275.528778 354.923340,260.568176 \n' +
            '\tC369.686340,245.126480 384.461243,229.696182 399.223053,214.253342 \n' +
            '\tC413.409790,199.412033 427.579346,184.554230 441.769531,169.716171 \n' +
            '\tC456.764923,154.036194 471.692657,138.290298 486.808441,122.727135 \n' +
            '\tC497.213104,112.014587 508.890686,102.300941 513.000000,87.000000 \n' +
            'z"/>\n' +
            '<path fill="#FFC473" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M74.432526,471.040588 \n' +
            '\tC66.804550,468.097626 58.719070,465.969360 51.663551,462.007019 \n' +
            '\tC42.694351,456.970001 34.050434,451.049011 26.197760,444.407715 \n' +
            '\tC16.903753,436.547516 10.695731,426.098602 6.067833,414.821381 \n' +
            '\tC4.511069,411.027863 3.106510,407.171936 1.316193,403.172241 \n' +
            '\tC1.000000,401.933319 1.000000,400.866669 0.999999,399.399994 \n' +
            '\tC16.537714,393.709778 32.321110,389.035645 47.547211,382.963989 \n' +
            '\tC64.305077,376.281494 75.451485,363.011993 84.610176,347.884308 \n' +
            '\tC93.635750,332.976440 103.854942,318.969543 118.645607,309.200623 \n' +
            '\tC137.796753,296.551727 158.847260,290.388428 182.765839,292.173950 \n' +
            '\tC202.014801,294.450470 218.207672,301.269562 231.033325,315.163269 \n' +
            '\tC230.428665,315.969147 230.018890,316.497772 229.549576,316.966858 \n' +
            '\tC179.030563,367.461090 128.509888,417.953674 77.964073,468.421051 \n' +
            '\tC76.938004,469.445557 75.616302,470.174011 74.432526,471.040588 \n' +
            'z"/>\n' +
            '<path fill="#002D6C" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M513.000000,86.531731 \n' +
            '\tC508.890686,102.300941 497.213104,112.014587 486.808441,122.727135 \n' +
            '\tC471.692657,138.290298 456.764923,154.036194 441.769531,169.716171 \n' +
            '\tC427.579346,184.554230 413.409790,199.412033 399.223053,214.253342 \n' +
            '\tC384.461243,229.696182 369.686340,245.126480 354.923340,260.568176 \n' +
            '\tC340.620300,275.528778 326.328247,290.499908 312.025543,305.460815 \n' +
            '\tC297.377960,320.782471 282.706940,336.081787 268.083038,351.425995 \n' +
            '\tC264.330627,355.363251 260.717010,359.432861 256.593079,363.512512 \n' +
            '\tC253.022003,344.928375 244.919571,328.735352 232.206924,314.600830 \n' +
            '\tC233.618835,312.990448 234.864807,311.647522 236.162628,310.356781 \n' +
            '\tC292.118622,254.704315 348.106720,199.084137 404.028351,143.397156 \n' +
            '\tC434.946411,112.608810 465.750000,81.705551 496.623962,50.872875 \n' +
            '\tC498.024475,49.474213 499.610352,48.261127 501.109894,46.961605 \n' +
            '\tC506.507568,52.990051 510.908478,59.553364 512.632446,67.875168 \n' +
            '\tC513.000000,74.021156 513.000000,80.042305 513.000000,86.531731 \n' +
            'z"/>\n' +
            '<path fill="#00459F" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M500.971741,46.640503 \n' +
            '\tC499.610352,48.261127 498.024475,49.474213 496.623962,50.872875 \n' +
            '\tC465.750000,81.705551 434.946411,112.608810 404.028351,143.397156 \n' +
            '\tC348.106720,199.084137 292.118622,254.704315 236.162628,310.356781 \n' +
            '\tC234.864807,311.647522 233.618835,312.990448 231.990417,314.594788 \n' +
            '\tC231.632141,314.880493 231.200424,314.858215 231.200424,314.858215 \n' +
            '\tC218.207672,301.269562 202.014801,294.450470 183.225677,292.169800 \n' +
            '\tC197.646729,277.748566 212.432648,263.509583 227.217682,249.269714 \n' +
            '\tC227.577484,248.923172 227.924988,248.563904 228.282852,248.215332 \n' +
            '\tC241.130295,235.700485 253.931122,223.137299 266.838287,210.684326 \n' +
            '\tC282.823364,195.261688 298.882690,179.915802 314.936127,164.564178 \n' +
            '\tC329.304688,150.823761 343.723206,137.135590 358.093414,123.396896 \n' +
            '\tC374.028320,108.162254 389.898621,92.859909 405.863281,77.656586 \n' +
            '\tC417.245209,66.817451 428.821594,56.181747 440.156372,45.294075 \n' +
            '\tC452.835052,33.115471 474.645020,30.204197 489.949005,39.031540 \n' +
            '\tC493.722839,41.208294 497.213013,43.876896 500.971741,46.640503 \n' +
            'z"/>\n' +
            '<path fill="#FFAA21" opacity="1.000000" stroke="none" \n' +
            '\td="\n' +
            'M231.033325,315.163269 \n' +
            '\tC231.200424,314.858215 231.632141,314.880493 231.848648,314.886536 \n' +
            '\tC244.919571,328.735352 253.022003,344.928375 256.438049,363.824890 \n' +
            '\tC258.916351,383.433411 256.629150,402.162140 247.574219,419.571991 \n' +
            '\tC235.501358,442.784363 216.198639,458.092194 192.345459,467.896729 \n' +
            '\tC167.999100,477.903931 142.418396,481.687927 116.364510,479.617798 \n' +
            '\tC102.444054,478.511780 88.762367,474.400787 74.702728,471.343262 \n' +
            '\tC75.616302,470.174011 76.938004,469.445557 77.964073,468.421051 \n' +
            '\tC128.509888,417.953674 179.030563,367.461090 229.549576,316.966858 \n' +
            '\tC230.018890,316.497772 230.428665,315.969147 231.033325,315.163269 \n' +
            'z"/>\n' +
            '</svg></div>';
          applyButton.addEventListener('click', () => {
            this.applyFormat()
          });
        })

        document.querySelectorAll('.ql-button').forEach((qlBtn) => {
          qlBtn.innerHTML = '<div title="Add/Edit a button"><svg viewBox="0 0 18 18"><rect width="16" height="10" x="1" y="4" rx="2" ry="2" stroke-width="1.5" stroke="currentColor" fill="none"></rect><path d="M5,9 L13,9" stroke-width="1.5" stroke="currentColor"></path></svg></div>';
        })

        document.querySelectorAll('.ql-table-button').forEach((tableBtn) => {
          tableBtn.innerHTML = `
          <div title="Insert 3x3 Table">
            <svg viewBox="0 0 18 18" width="18" height="18">
              <rect x="2" y="2" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.5" />
              <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </div>
        `;
        })
        var tableButton = document.querySelectorAll('.ql-table-button');
        tableButton.forEach((tableButton) => {
          tableButton.addEventListener('click', () => {
            this.$refs.myQuillEditor.quill.getModule('table').insertTable(3, 3);
          });
        })

        var additionalButton = this.$el.querySelectorAll('.ql-show-additional');
        additionalButton.forEach((additionalButton) => {
          additionalButton.innerHTML = `
          <div title="Show additional options">
            >
          </div>
        `;
          additionalButton.addEventListener('click', (e) => {
            const rootEl = e.currentTarget.closest('.quill-editor'); // or whatever wraps your editor
            const formats = rootEl?.querySelectorAll('.ql-toolbar.ql-snow .ql-formats') || [];

            formats.forEach((el) => {
              if (
                el.querySelector('button.ql-formula') ||
                el.querySelector('button.ql-blockquote') ||
                el.querySelector('button.ql-code-block') ||
                el.querySelector('button.ql-script') ||
                el.querySelector('button.ql-direction') ||
                el.querySelector('button.ql-emoji') ||
                el.querySelector('button.ql-button') ||
                el.querySelector('button.ql-html') ||
                el.querySelector('button.ql-table-button')
              ) {
                if (el.style.display === 'inline-block') {
                  el.style.display = 'none';
                  additionalButton.innerHTML = `
          <div title="Show additional options">
            >
          </div>
        `;
                } else {
                  el.style.display = 'inline-block';
                  additionalButton.innerHTML = `
          <div title="Hide additional options">
            <
          </div>
        `;
                }
              }
            });
          });
        })

        await this.initializeLottie(this.$refs.myQuillEditor?.$el)

      })
    })
  },
  methods: {
    validate() {
      return true;
    },
    uploadFunction(mediaId = null) {
      this.$refs.sectionsMediaComponent.openModal(mediaId || this.editableMediaId, null)
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
    },
    handleLottieClick(event) {
      const mediaId = event.target.getAttribute('media-id');

      if (mediaId) {
        this.editableMediaId = mediaId;
      }
    },
    async initializeLottie(htmlElement) {
      try {
        if (this.$loadScript) {
          const lottieDivs = htmlElement.querySelectorAll('div[lottie-id][media-type="lottie"]');
          if (lottieDivs && lottieDivs.length > 0) {
            await this.$loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js', true)
          }
          await this.$nextTick()
          lottieDivs.forEach(div => {
            div.addEventListener('click', this.handleLottieClick);
          });
          initLottieFromHtml(htmlElement)
        }
      } catch {}
    }
  }
};
</script>

<style>
.ql-toolbar.ql-snow .ql-formats button.ql-save-format, .ql-toolbar.ql-snow .ql-formats button.ql-apply-format {
  width: auto !important;
  padding: 0 2px 0 8px !important
}
.ql-apply-format:after, .ql-save-format:after {
  content: "" !important;
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
.ql-picker.ql-size .ql-picker-label[data-value]::before, .ql-picker.ql-size .ql-picker-item[data-value]::before {
  content: attr(data-value) !important;
}
.ql-editor p {
  font-size: 1rem;
}
.ql-snow .ql-size.ql-picker.ql-expanded .ql-picker-options {
  max-height: 250px;
  overflow-y: scroll;
}
.ql-toolbar.ql-snow .ql-formats:has(button.ql-formula),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-blockquote),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-code-block),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-script),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-direction),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-emoji),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-button),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-html),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-table-button) {
  display: none;
}
</style>
