<template>
  <div title="" class="quill-editor wyzywig input wyzywig-wrapper" ref="myQuillEditorRef">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>

    <ClientOnly>
      <div
        ref="quillContainer"
        :key="props.quillKey"
        :options="editorOptionsObject"
        class="wyzywig"
      />
      <template #fallback>
        <p>Loading editor...</p>
      </template>
    </ClientOnly>

    <LazyGMediaComponent
      ref="sectionsMediaComponentRef"
      :content-used-key="props.contentUsedKey"
      :auth-token="props.authToken"
      :server-url="props.serverUrl"
      :project-id="props.projectIdProp"
      :sections-user-id="props.sectionsUserId"
      :selected-media-id="route.query.id"
      :media-translation-prefix="props.mediaTranslationPrefix"
      :alter-error-received="alterErrorReceived"
      :response-received="responseReceived"
      :request-pre-sent="requestPreSent"
      :accepted-file-types="acceptedFileTypes"
      @emittedMedia="handleEmittedMedia"
    ></LazyGMediaComponent>
  </div>
</template>

<script setup>
import {ref, useRoute, useCookie, onMounted, onBeforeUnmount, watch, inject, nextTick} from '#imports'
import {initLottieFromHtml} from "../components/media/medias.js";

// Variables to hold dynamically imported components and libraries
let QuillEditorComponent;
let Quill;
let EmojiLib;
let QuillTableUILib;

const props = defineProps({
  html: { type: String, default: "" },
  quillKey: { type: String, default: "quillKey" },
  editorOptions: { type: Object, default: () => ({}) },
  sectionsWysiwygEditorOptions: { type: Object, default: () => ({}) },
  authToken: { type: String, default: '' },
  sectionsUserId: { type: String, default: '' },
  projectIdProp: { type: String, default: '' },
  serverUrl: { type: String, default: '' },
  selectedMediaId: { type: String, default: '' },
  contentUsedKey: { type: String, default: "title" },
  mediaTranslationPrefix: { type: String, default: "mediaT." },
  alterErrorReceived: {
    type: Function,
    default: () => {}
  },
  responseReceived: {
    type: Function,
    default: () => {}
  },
  requestPreSent: {
    type: Function,
    default: () => {}
  },
  fontFamilies: {
    type: Array,
    default() {
      return []
    }
  },
  acceptedFileTypes: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['settingsUpdate', 'wysiwygMedia']);
const route = useRoute();
const sectionsQuillFormatCookie = useCookie('sections-quill-format');

const settings = ref(props.html || "");
const selectedMedia = ref(null);
const editorOptionsObject = ref(null);
const selectedRange = ref(null);
const myQuillEditorRef = ref(null);
const quillContainer = ref(null);
const sectionsMediaComponentRef = ref(null);
const editableMediaId = ref(null);

const fontsArray = [
  "0.25rem", "0.5rem", "0.75rem", false, "1.25rem", "1.5rem", "1.75rem", "2rem",
  "2.25rem", "2.5rem", "2.75rem", "3rem", "3.25rem", "3.5rem", "3.75rem", "4rem",
  "4.25rem", "4.5rem", "4.75rem", "5rem", "5.25rem", "5.5rem", "5.75rem", "6rem",
  "6.25rem", "6.5rem", "6.75rem", "7rem", "7.25rem", "7.5rem", "7.75rem", "8rem"
];

// HTML Modal elements
let htmlModalElement = null;
let htmlEditorTextareaElement = null;

let showHTMLFunction = null;

// Define Quill modules and custom blots
const defineQuillModules = async () => {
  if (!Quill) {
    return;
  }

  // Add pasteHTML method if not exists
  if (!Quill.prototype.pasteHTML) {
    Quill.prototype.pasteHTML = function (html) {
      if (this.clipboard && this.clipboard.convert) {
        const delta = this.clipboard.convert({ html: html, text: '\n' });
        this.setContents(delta);
      }
    };
  }

  // Load and register EmojiJS library
  if (!EmojiLib) {
    try {
      await import("@devdcodes9/quill-emojijs/dist/quill-emoji.css")
      EmojiLib = await import("@devdcodes9/quill-emojijs");
      Quill.register("modules/emoji-toolbar", EmojiLib.default.ToolbarEmoji);
      Quill.register('formats/emoji', EmojiLib.default.EmojiBlot);
    } catch {}
  }

  // Load and register Table UI library
  if (!QuillTableUILib) {
    try {
      await import('quill-table-ui/dist/index.css');
      QuillTableUILib = await import('quill-table-ui');
      Quill.register({ 'modules/tableUI': QuillTableUILib.default }, true);
    } catch {}
  }

  // Register custom image blot
  const ImageBlot = Quill.import("formats/image");
  class CustomImageBlot extends ImageBlot {
    static blotName = "customImage";
    static tagName = "img";
    static create(value) {
      let node = super.create(value.src);
      Object.keys(value).forEach(attr => {
        if (attr !== 'src') node.setAttribute(attr, value[attr]);
      });
      return node;
    }
    static value(node) {
      const value = { src: node.getAttribute('src') };
      if (node.hasAttribute('alt')) value.alt = node.getAttribute('alt');
      if (node.hasAttribute('media-id')) value['media-id'] = node.getAttribute('media-id');
      if (node.hasAttribute('loading')) value.loading = node.getAttribute('loading');
      return value;
    }
  }
  Quill.register(CustomImageBlot, true);

  // Register button blot
  const Embed = Quill.import('blots/embed');
  class ButtonBlot extends Embed {
    static blotName = 'button';
    static tagName = 'span';
    static className = 'quill-button-wrapper';
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
      buttonContainer.setAttribute('data-label', value.label || 'Button');
      buttonContainer.setAttribute('data-link', value.link || '#');
      buttonContainer.appendChild(anchor);
      node.appendChild(buttonContainer);
      return node;
    }
    static value(node) {
      const buttonContainer = node.querySelector('.quill-button-container');
      return buttonContainer ? {
        label: buttonContainer.getAttribute('data-label') || '',
        link: buttonContainer.getAttribute('data-link') || '#'
      } : {};
    }
  }
  Quill.register(ButtonBlot);

  // Register button toolbar module
  class ButtonToolbarModule {
    constructor(q, opts) {
      this.quill = q; this.options = opts; this.toolbar = q.getModule('toolbar');
      if (this.toolbar) this.toolbar.addHandler('button', this.handleButtonAction.bind(this));
      this.selectedButtonId = null;
      this.quill.on('selection-change', this.handleSelectionChange.bind(this));
    }
    handleSelectionChange(range) {
      this.selectedButtonId = null; if (!range) return;
      const [blot] = this.quill.getLeaf(range.index); if (!blot) return;
      let currentNode = blot.domNode;
      while (currentNode && !this.selectedButtonId) {
        if (currentNode.classList && currentNode.classList.contains('quill-button-wrapper')) {
          const btnContainer = currentNode.querySelector('.quill-button-container');
          if (btnContainer) this.selectedButtonId = btnContainer.getAttribute('data-button-id');
          break;
        }
        currentNode = currentNode.parentNode;
      }
    }
    handleButtonAction() {
      if (this.selectedButtonId) {
        const btnEl = this.quill.root.querySelector(`.quill-button-container[data-button-id="${this.selectedButtonId}"]`);
        if (btnEl) { this.editButton(btnEl); return; }
      }
      this.createButton();
    }
    createButton() {
      const label = prompt('Button Label:', ''); if (!label) return;
      const link = prompt('Button Link:', '');
      const range = this.quill.getSelection(true);
      this.quill.insertEmbed(range.index, 'button', { label: label, link: link }, Quill.sources.USER);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    editButton(buttonElement) {
      if (!buttonElement) return;
      const currentLabel = buttonElement.getAttribute('data-label');
      const currentLink = buttonElement.getAttribute('data-link');
      const newLabel = prompt('Edit Button Label:', currentLabel); if (newLabel === null) return;
      const newLink = prompt('Edit Button Link:', currentLink);
      const anchorElement = buttonElement.querySelector('a');
      anchorElement.innerText = newLabel; anchorElement.href = newLink;
      buttonElement.setAttribute('data-label', newLabel); buttonElement.setAttribute('data-link', newLink);
      this.selectedButtonId = null;
    }
  }
  Quill.register('modules/buttonToolbar', ButtonToolbarModule);

  const BlockEmbed = Quill.import('blots/block/embed');

  class HTMLBlot extends BlockEmbed {
    static blotName = 'html';
    static tagName = 'div';
    static className = 'ql-custom-html';

    static create(value) {
      const node = super.create();
      node.setAttribute('data-html', value);
      node.setAttribute('contenteditable', 'false');

      // Create content wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.innerHTML = value;
      node.appendChild(contentWrapper);

      // Add edit button
      const overlay = document.createElement('span');
      node.appendChild(overlay);
      overlay.className = 'overlay';
      const editBtn = document.createElement('span');
      editBtn.className = 'html-edit-overlay';
      editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="white"><path d="M29.535 20.102c-0.44 0-0.797 0.357-0.797 0.797v7.076c-0.002 1.32-1.071 2.39-2.391 2.391h-22.362c-1.32-0.001-2.389-1.071-2.391-2.391v-20.768c0.002-1.32 1.071-2.389 2.391-2.391h7.076c0.44 0 0.797-0.357 0.797-0.797s-0.357-0.797-0.797-0.797h-7.076c-2.2 0.002-3.982 1.785-3.985 3.985v20.768c0.003 2.2 1.785 3.982 3.985 3.985h22.362c2.2-0.003 3.982-1.785 3.985-3.985v-7.076c0-0.44-0.357-0.797-0.797-0.797z"/><path d="M30.016 1.172c-1.401-1.401-3.671-1.401-5.072 0l-14.218 14.218c-0.097 0.097-0.168 0.218-0.205 0.351l-1.87 6.75c-0.077 0.277 0.001 0.573 0.204 0.776s0.5 0.281 0.776 0.205l6.75-1.87c0.133-0.037 0.253-0.107 0.351-0.205l14.218-14.219c1.398-1.402 1.398-3.67 0-5.072zM12.462 15.908l11.637-11.637 3.753 3.753-11.637 11.637zM11.713 17.412l2.998 2.999-4.147 1.149zM29.824 6.052l-0.845 0.845-3.753-3.753 0.846-0.845c0.778-0.778 2.039-0.778 2.817 0l0.936 0.935c0.777 0.779 0.777 2.039 0 2.818z"/></svg>';
      editBtn.setAttribute('contenteditable', 'false');

      // Store reference to the HTMLBlot instance for later access
      editBtn.setAttribute('data-blot-id', Math.random().toString(36).substr(2, 9));

      editBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Find the HTMLModule instance associated with this blot
        const quillContainer = node.closest('.ql-container');
        if (quillContainer && quillContainer.__quill_html_module) {
          const htmlModule = quillContainer.__quill_html_module;
          const currentHTML = node.getAttribute('data-html') || '';
          htmlModule.showHTMLEditor(currentHTML, node);
        }
      };

      node.appendChild(editBtn);
      return node;
    }

    static value(node) {
      return node.getAttribute('data-html');
    }

    length() {
      return 1;
    }
  }

  Quill.register(HTMLBlot);

// Register HTML module
  class HTMLModule {
    constructor(quill, opts) {
      this.quill = quill;
      this.options = opts || {};
      this.toolbar = quill.getModule('toolbar');
      this.currentEditingNode = null; // Track which node is being edited

      // Store reference to this module instance on the quill container
      const container = this.quill.container;
      container.__quill_html_module = this;

      if (this.toolbar) {
        this.toolbar.addHandler('html', this.handleHTMLPlus.bind(this));
      }

      this.createHTMLEditor();
    }

    createHTMLEditor() {
      // Create instance-specific modal elements
      this.htmlModalElement = document.createElement('div');
      this.htmlModalElement.className = 'ql-html-editor-modal';

      const modalContent = document.createElement('div');
      modalContent.className = 'ql-html-editor-content';

      this.htmlEditorTextareaElement = document.createElement('textarea');
      this.htmlEditorTextareaElement.className = 'ql-html-editor-textarea';

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'ql-html-editor-buttons';

      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.className = 'ql-html-editor-save';

      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.className = 'ql-html-editor-cancel';

      const noteText = document.createElement('div');
      noteText.textContent = 'Use with cautions, when adding a new html content, make sure to wrap it with a <p></p> tag';
      noteText.className = 'ql-html-editor-noteText';

      buttonContainer.appendChild(saveButton);
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(noteText);

      modalContent.appendChild(this.htmlEditorTextareaElement);
      modalContent.appendChild(buttonContainer);
      this.htmlModalElement.appendChild(modalContent);

      // Bind event handlers to this instance
      saveButton.addEventListener('click', () => this.saveHTMLPlus());
      cancelButton.addEventListener('click', () => this.hideHTMLEditor());

      this.htmlModalElement.addEventListener('click', (event) => {
        if (event.target === this.htmlModalElement) {
          this.hideHTMLEditor();
        }
      });

      document.body.appendChild(this.htmlModalElement);
      this.htmlModalElement.style.display = 'none';
    }

    handleHTMLPlus() {
      const range = this.quill.getSelection(true);
      const [blot, offset] = this.quill.scroll.descendant(HTMLBlot, range.index);

      let currentHTML = '';
      if (blot !== null) {
        currentHTML = blot.domNode.getAttribute('data-html') || '';
        this.currentEditingNode = blot.domNode;
      } else {
        this.currentEditingNode = null;
      }

      this.showHTMLEditor(currentHTML);
    }

    showHTMLEditor(html, editingNode = null) {
      this.htmlEditorTextareaElement.value = html;
      this.htmlModalElement.style.display = 'flex';

      // Set the current editing node if provided (from edit button click)
      if (editingNode) {
        this.currentEditingNode = editingNode;
      }

      setTimeout(() => this.htmlEditorTextareaElement.focus(), 0);
    }

    hideHTMLEditor() {
      this.htmlModalElement.style.display = 'none';
      this.currentEditingNode = null;
    }

    saveHTMLPlus() {
      const userHTML = this.htmlEditorTextareaElement.value;

      if (userHTML === null || userHTML === '') {
        this.hideHTMLEditor();
        return;
      }

      if (this.currentEditingNode) {
        // Update existing blot
        this.currentEditingNode.setAttribute('data-html', userHTML);
        const contentWrapper = this.currentEditingNode.querySelector('div');
        if (contentWrapper) {
          contentWrapper.innerHTML = userHTML;
        }
      } else {
        // Insert new blot
        const range = this.quill.getSelection(true);
        const insertIndex = range.index;
        this.quill.insertEmbed(insertIndex, 'html', userHTML, Quill.sources.USER);

        // Position cursor after the HTML block
        this.quill.setSelection(insertIndex + 2, 0, Quill.sources.SILENT);
      }

      this.hideHTMLEditor();
    }

    // Cleanup method to remove modal when module is destroyed
    destroy() {
      if (this.htmlModalElement && this.htmlModalElement.parentNode) {
        this.htmlModalElement.parentNode.removeChild(this.htmlModalElement);
      }

      // Remove reference from container
      const container = this.quill.container;
      if (container.__quill_html_module === this) {
        delete container.__quill_html_module;
      }
    }
  }

  Quill.register('modules/html', HTMLModule);
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
    background-color: #03b1c7;
    color: white;
  }
  .quill-editor .ql-custom-html .overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: all; /* This blocks interactions */
  z-index: 10;
}
  .quill-editor .ql-custom-html {
      position: relative;
      white-space: normal;
      width: fit-content;
      min-width: 250px;
      min-height: 250px;
    }
    .quill-editor .ql-custom-html:hover {
      border: 2px dashed #03b1c7;
      padding: 15px;
      margin: 10px 0;
      background-color: #f8f9fa;
    }
    .quill-editor .ql-custom-html::before {
      content: "Custom HTML Block";
      position: absolute;
      top: -10px;
      left: 10px;
      background: #03b1c7;
      color: white;
      padding: 2px 8px;
      font-size: 12px;
      border-radius: 3px;
      font-weight: bold;
      visibility: hidden;
    }
    .quill-editor .ql-custom-html:hover::before {
      visibility: visible;
    }
    .quill-editor .html-edit-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #03b1c7;
      color: white;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 3px;
      font-size: 11px;
      font-weight: bold;
      z-index: 10;
      transition: background-color 0.2s;
      visibility: hidden;
    }
    .quill-editor .ql-custom-html:hover .html-edit-overlay {
      visibility: visible;
    }
    .quill-editor .ql-editor .ql-custom-html + * {
      margin-top: 10px;
    }
    .quill-editor .ql-editor .ql-custom-html {
      margin: 15px 0;
    }
    .quill-editor .ql-custom-html * {
      max-width: 100%;
    }
    .quill-editor .ql-custom-html img {
      max-width: 100%;
      height: auto;
    }
`;
  document.head.appendChild(style);


  // Register size format
  const Size = Quill.import('attributors/style/size');
  Size.whitelist = fontsArray;
  Quill.register(Size, true);

  // Register custom link format
  const LinkFormat = Quill.import('formats/link');
  class MyLink extends LinkFormat {
    static create(value) {
      let node = super.create(value);
      value = this.sanitize(value); node.setAttribute('href', value);
      if(!value.startsWith("http")) node.removeAttribute('target'); else node.setAttribute('target', '_blank');
      return node;
    }
  }
  Quill.register(MyLink, true);

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

};

const setupFontFamilies = () => {
  const styleId = 'custom-quill-fonts';

  function getFontName(font) {
    return font.toLowerCase().replace(/\s/g, "_");
  }

  const fontNames = props.fontFamilies.map(font => getFontName(font));

  if (Quill) {
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = fontNames;
    Quill.register(FontAttributor, true);
  }

  // Check if the style node already exists
  if (document.getElementById(styleId)) {
    return fontNames;
  }

  let fontStyles = "";
  props.fontFamilies.forEach(function(font) {
    const fontName = getFontName(font);
    fontStyles += `
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="${fontName}"]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="${fontName}"]::before {
        content: '${font}';
        font-family: '${font}', sans-serif;
      }
      .ql-font-${fontName} {
        font-family: '${font}', sans-serif;
      }
    `;
  });

  const node = document.createElement('style');
  node.id = styleId;
  node.innerHTML = fontStyles;
  document.body.appendChild(node);

  return fontNames;
}

// Initialize editor options
const initEditorOptions = () => {
  let fontNames = props.fontFamilies
  if (props.fontFamilies && props.fontFamilies.length > 0) {
    fontNames = setupFontFamilies()
  }

  if (props.editorOptions && Object.keys(props.editorOptions).length > 0 && props.editorOptions.modules) {
    editorOptionsObject.value = props.editorOptions;
  } else if (props.sectionsWysiwygEditorOptions && Object.keys(props.sectionsWysiwygEditorOptions).length > 0 && props.sectionsWysiwygEditorOptions.modules) {
    editorOptionsObject.value = props.sectionsWysiwygEditorOptions;
  } else {
    editorOptionsObject.value = {
      theme: 'snow',
      placeholder: 'Compose an epic...',
      modules: {
        toolbar: {
          container: [
            ["save-format", "apply-format"],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': fontNames }],
            [{ 'size': fontsArray }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': ['#51aec3', '#fce085', '#03b1c7', '#61035b', '#ffffff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#51aec3', '#fce085', '#03B1C7', '#61035B', '#ffffff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
            ['link', 'image', 'video'],
            [{ 'align': [] }],
            [{ 'list': 'bullet' }, { 'list': 'ordered'}],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['clean'],
            ['show-additional'],
            ['formula'],
            ['blockquote', 'code-block'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'direction': 'rtl' }],
            ['emoji'],
            ["button"],
            ['html'],
            ['table-button'],
          ],
          handlers: {} // To be populated after Quill is loaded
        },
        "emoji-toolbar": true,
        buttonToolbar: true,
        html: true,
        table: true,
        tableUI: true
      }
    };

  }

  if (Quill) {
    QuillEditorComponent = new Quill(quillContainer.value, editorOptionsObject.value)
  }

};

const handleLottieClick = (event) => {
  const mediaId = event.target.getAttribute('media-id');

  if (mediaId) {
    editableMediaId.value = mediaId;
  }
};

const initializeLottie = async (htmlElement) => {
  try {
    if (loadScript) {
      const lottieDivs = htmlElement.querySelectorAll('div[lottie-id][media-type="lottie"]');
      if (lottieDivs && lottieDivs.length > 0) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js', true)
      }
      await nextTick()
      lottieDivs.forEach(div => {
        div.addEventListener('click', handleLottieClick);
      });
      initLottieFromHtml(htmlElement)
    }
  } catch {}
}

// Watch for changes to settings
watch(settings, (newSettings) => {
  // Avoid emitting for initial empty state from Quill or if unchanged from prop
  if (newSettings !== props.html) {
    emit('settingsUpdate', newSettings);
  }
});

// Watch for changes to props.html
watch(() => props.html, async (newHtml) => {
  if (settings.value !== newHtml) {
    const htmlContent = appendEmptyParagraphIfOnlyRawHtmlContainer (newHtml)
    settings.value = htmlContent;
    // If Quill instance is ready, update content directly if needed
    const quill = QuillEditorComponent;
    if (quill && quill.root.innerHTML !== htmlContent) {
      if (htmlContent === "<p><br></p>" && quill.getLength() <= 1) {
        // Do nothing if newHTML is empty placeholder and quill is already empty
      } else {
        quill.setContents([]);
        const delta = quill.clipboard.convert({ html: htmlContent, text: '\n' });
        quill.setContents(delta);
      }
    }
    await initializeLottie(quillContainer.value)
  }
}, { immediate: true });

const loadScript = inject('loadScript')
// Watch for changes to selectedMedia
watch(selectedMedia, async (mediaObject) => {
  editableMediaId.value = null;
  const quill = QuillEditorComponent;
  if (!mediaObject || !quill) {
    return;
  }

  const media = {
    media_id: "", url: "", seo_tag: "", files: [{ filename: "", url: "" }], headers: {}
  };

  if (mediaObject.files && mediaObject.files[0]) {
    media.files[0].filename = mediaObject.files[0].filename;
    if (mediaObject.files[0].headers) media.headers = mediaObject.files[0].headers;
  }
  media.media_id = mediaObject.id;
  media.url = mediaObject.url || (mediaObject.files && mediaObject.files[0] ? mediaObject.files[0].url : '');
  media.seo_tag = mediaObject.seo_tag;
  media.metadata = mediaObject.metadata

  const range = selectedRange.value || quill.getSelection();
  let insertIndex = range ? range.index : (quill.getLength() > 0 ? quill.getLength() -1 : 0);
  let lengthIndex

  let linkAttr = null;
  const [leaf, offset] = quill.getLeaf(insertIndex);
  if (leaf?.parent?.domNode?.href) {
    linkAttr = leaf?.parent?.domNode?.href;
  }

  if (selectedRange.value && selectedRange.value.length > 0) {
    quill.deleteText(selectedRange.value.index, selectedRange.value.length, Quill.sources.USER);
    insertIndex = selectedRange.value.index;
    lengthIndex = selectedRange.value.length
  }
  selectedRange.value = null;

  if (media.metadata?.type === 'lottie') {
    quill.insertEmbed(insertIndex, 'lottie', {
      'lottie-id': `lottie-${media.media_id}`,
      src: media.url,
      'media-id': media.media_id,
      'media-type': media.metadata?.type || 'image',
    }, Quill.sources.USER);
    await initializeLottie(quillContainer.value)
  } else {
    quill.insertEmbed(insertIndex, 'customImage', {
      src: media.url,
      'media-id': media.media_id,
      'media-type': media.metadata?.type || 'image',
      alt: media.seo_tag || '',
      loading: 'lazy'
    }, Quill.sources.USER);
  }

  if (linkAttr && lengthIndex) {
    quill.formatText(insertIndex, lengthIndex, 'link', linkAttr);
  }

  quill.setSelection(insertIndex + 1, 0, Quill.sources.SILENT);
  emit('wysiwygMedia', media);
  try {
    sectionsMediaComponentRef.value?.closeModal();
  } catch {}
});

// Helper functions
function handleEmittedMedia(media) {
  selectedMedia.value = media;
}

function validate() {
  return true;
}

function uploadFunction(mediaId = null) {
  sectionsMediaComponentRef.value?.openModal(mediaId || editableMediaId.value, null);
}

function saveFormat() {
  const quill = QuillEditorComponent;
  if (quill) {
    const selection = quill.getSelection();
    if (selection) {
      const format = quill.getFormat(selection);
      sectionsQuillFormatCookie.value = JSON.stringify(format);
    }
  }
}

function applyFormat() {
  const savedFormatJson = sectionsQuillFormatCookie.value;
  const quill = QuillEditorComponent;
  if (quill && savedFormatJson) {
    const selection = quill.getSelection();
    if (selection) {
      try {
        const savedFormat = typeof savedFormatJson === 'string'
            ? JSON.parse(savedFormatJson)
            : savedFormatJson;
        quill.formatText(selection.index, selection.length, savedFormat, Quill.sources.USER);
      } catch (e) {
        sectionsQuillFormatCookie.value = null;
      }
    }
  }
}

// Quill editor ready callback
const onQuillEditorReady = async (quillInstance) => {

  const quill = quillInstance;

  quill.on('text-change', function() {
    settings.value = quill.root.innerHTML;
  });

  // Setup toolbar handlers
  const toolbar = quill.getModule('toolbar');
  if (toolbar) {
    toolbar.addHandler('image', () => {
      selectedRange.value = null;
      let mediaIdToEdit = null;
      const currentRange = quill.getSelection();
      if (currentRange) {
        selectedRange.value = currentRange;
        if (currentRange.length > 0) {
          const delta = quill.getContents(currentRange.index, currentRange.length);
          if (delta?.ops?.length === 1 && delta.ops[0].insert?.customImage?.['media-id']) {
            mediaIdToEdit = delta.ops[0].insert.customImage['media-id'];
          } else if (delta?.ops?.length === 1 && delta.ops[0].insert?.lottie?.['media-id']) {
            mediaIdToEdit = delta.ops[0].insert.lottie['media-id'];
          }
        }
      }
      uploadFunction(mediaIdToEdit);
    });
  }

  // Setup custom toolbar buttons
  const editorElement = myQuillEditorRef.value;
  if (editorElement) {
    editorElement.querySelectorAll('.ql-save-format').forEach(btn => {
      btn.innerHTML = '<div title="Save format"><svg version="1.0" style="width: 20px;" xmlns="http://www.w3.org/2000/svg"\n' +
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
      btn.addEventListener('click', saveFormat);
    });

    editorElement.querySelectorAll('.ql-apply-format').forEach(btn => {
      btn.innerHTML = '<div title="Apply format"><svg version="1.1" id="Layer_1" style="width: 20px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
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
      btn.addEventListener('click', applyFormat);
    });

    editorElement.querySelectorAll('.ql-button').forEach(btn => {
      btn.innerHTML = '<div title="Add/Edit a button"><svg viewBox="0 0 18 18"><rect width="16" height="10" x="1" y="4" rx="2" ry="2" stroke-width="1.5" stroke="currentColor" fill="none"></rect><path d="M5,9 L13,9" stroke-width="1.5" stroke="currentColor"></path></svg></div>';
    });


    editorElement.querySelectorAll('.ql-table-button').forEach(btn => {
      btn.innerHTML = `
          <div title="Insert 3x3 Table">
            <svg viewBox="0 0 18 18" width="18" height="18">
              <rect x="2" y="2" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.5" />
              <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </div>
        `;
      btn.addEventListener('click', () => {
        quill.getModule('table').insertTable(3, 3)
      });
    });

    const additionalButton = editorElement.querySelector('.ql-show-additional');
    if(additionalButton){
      additionalButton.innerHTML = '<div title="Show additional options">&gt;</div>';
      additionalButton.addEventListener('click', (e) => {
        const rootEl = editorElement;
        const formatGroups = rootEl?.querySelectorAll('.ql-toolbar.ql-snow .ql-formats') || [];
        let anyVisible = false;
        formatGroups.forEach((el) => {
          const isAdditional = el.querySelector('button.ql-formula, button.ql-blockquote, button.ql-code-block, button.ql-script, button.ql-direction, button.ql-emoji, button.ql-button, button.ql-html, button.ql-table-button');
          if (isAdditional) {
            if (el.style.display === 'inline-block' || el.style.display === '') {
              el.style.display = 'none';
            } else {
              el.style.display = 'inline-block';
              anyVisible = true;
            }
          }
        });
        additionalButton.innerHTML = `<div title="${anyVisible ? 'Hide' : 'Show'} additional options">${anyVisible ? '&lt;' : '&gt;'}</div>`;
      });

      // Initially hide additional groups
      editorElement.querySelectorAll('.ql-toolbar.ql-snow .ql-formats').forEach(el => {
        const isAdditional = el.querySelector('button.ql-formula, button.ql-blockquote, button.ql-code-block, button.ql-script, button.ql-direction, button.ql-emoji, button.ql-button, button.ql-html, button.ql-table-button');
        if (isAdditional) el.style.display = 'none';
      });
    }
  }

  // Set initial content if needed
  if (quill.root.innerHTML !== props.html) {
    if (props.html === "<p><br></p>" && quill.getLength() <= 1) {
      // Do nothing if both are empty
    } else {
      const htmlContent = appendEmptyParagraphIfOnlyRawHtmlContainer (props.html)
      const delta = quill.clipboard.convert({ html: htmlContent, text: '\n' });
      quill.setContents(delta);
      // quill.clipboard.dangerouslyPasteHTML(0, htmlContent);
    }
  }

  await initializeLottie(quillContainer.value)
};

const appendEmptyParagraphIfOnlyRawHtmlContainer  = (htmlContent) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const bodyChildren = Array.from(doc.body.children);

    const isQLOne = (el) =>
        el.tagName === 'DIV' && el.classList.contains('ql-custom-html');

    const len = bodyChildren.length;

    if (
        len === 1 &&
        isQLOne(bodyChildren[0])
    ) {
      // Only element
      htmlContent += '<p>&nbsp;</p>';
    } else if (
        len >= 1 &&
        isQLOne(bodyChildren[len - 1])
    ) {
      // Last element
      htmlContent += '<p>&nbsp;</p>';
    } else if (
        len >= 2 &&
        isQLOne(bodyChildren[len - 2])
    ) {
      // Second-to-last element
      htmlContent += '<p>&nbsp;</p>';
    }

    return htmlContent;
  } catch {
    return htmlContent;
  }
};

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (htmlModalElement && htmlModalElement.parentNode === document.body) {
    document.body.removeChild(htmlModalElement);
    htmlModalElement = null;
  }
});

// Initialize editor on component mount
onMounted(async () => {
  if (process.client) {
    try {
      // Import CSS
      await import('quill/dist/quill.snow.css');

      Quill = (await import('quill')).default;

      // Register Quill modules
      await defineQuillModules();

      // Initialize editor options
      initEditorOptions();

      await onQuillEditorReady(QuillEditorComponent);

    } catch {}
  }
});

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
  z-index: 11;
}
main.sections-main .input.wyzywig-wrapper {
  margin: 0 128px;
}
.ql-html-popupContainer button.ql-html-buttonCancel {
  outline: none;
  max-width: 1000px;
  display: flex;
  background: #03b1c7;
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
  background: #03b1c7;
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
.quill-editor .ql-snow .ql-picker.ql-font {
  width: 168px;
}
</style>
