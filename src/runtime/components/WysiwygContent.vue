<template>
  <div :class="[wrapperDefaultClasses, wrapperClasses]">
    <article ref="articleContainerRef" :class="[defaultClasses, classes]" v-html="htmlContent" />
  </div>
</template>

<script setup>
import { useRouter, onMounted, watch, ref, inject, nextTick } from '#imports'
import { initLottieFromHtml } from '../components/media/medias.js'

const props = defineProps({
  htmlContent: {
    type: String,
    default: '',
  },
  wrapperDefaultClasses: {
    type: String,
    default: 'ql-snow',
  },
  wrapperClasses: {
    type: String,
    default: '',
  },
  defaultClasses: {
    type: String,
    default: 'ql-editor',
  },
  classes: {
    type: String,
    default: '',
  },
})

const articleContainerRef = ref(null)
const router = useRouter()

import('quill/dist/quill.snow.css')

const loadScript = inject('loadScript')

// Global set to track injected font styles across all component instances
const injectedFonts = new Set()

// Function to inject font styles only once globally
const injectFontStyles = (htmlContent) => {
  try {
    if (!htmlContent) return

    // Regular expression to find ql-font-{fontName} classes (including dashes)
    const fontClassRegex = /ql-font-([\w-]+)/g
    const matches = htmlContent.matchAll(fontClassRegex)
    const fontNames = new Set()

    for (const match of matches) {
      fontNames.add(match[1])
    }

    if (fontNames.size === 0) return

    // Check if styles already exist in the HTML content
    const existingStyles = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
    const existingStyleContent = existingStyles.join('')

    // Get or create the global style element for font styles
    let styleElement = document.getElementById('quill-font-styles')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = 'quill-font-styles'
      document.head.appendChild(styleElement)
    }

    // Generate CSS for fonts that haven't been injected yet
    let newCss = ''
    for (const fontName of fontNames) {
      const stylePattern = new RegExp(`\\.ql-font-${fontName.replace(/_/g, '\\-')}\\s*{`, 'i')

      // Check if style exists in HTML content or already injected globally
      if (!existingStyleContent.match(stylePattern) && !injectedFonts.has(fontName)) {
        // Convert fontName to a proper font family name (e.g., open-sans -> Open Sans)
        const fontFamily = fontName
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        newCss += `.ql-font-${fontName} {\n  font-family: '${fontFamily}', sans-serif;\n}\n`
        injectedFonts.add(fontName)
      }
    }

    if (newCss) {
      styleElement.textContent += newCss
    }
  } catch {}
}

onMounted(async () => {
  // Inject font styles
  injectFontStyles(props.htmlContent)

  // Handle internal link clicks
  const quillEditor = document.querySelector('.ql-editor')
  if (quillEditor) {
    const anchorTags = quillEditor.querySelectorAll('a')
    anchorTags.forEach((anchorTag) => {
      const link = anchorTag.getAttribute('href')
      if (link && !link.startsWith('http')) {
        anchorTag.addEventListener('click', (event) => {
          event.preventDefault()
          router.push(link)
        })
      }
    })
  }
  if (loadScript) {
    await nextTick()
    const lottieDivs = articleContainerRef.value.querySelectorAll(
      'div[lottie-id][media-type="lottie"]'
    )
    if (lottieDivs && lottieDivs.length > 0) {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js',
        true
      )
    }
  }
  await nextTick()
  initLottieFromHtml(articleContainerRef.value)
})

watch(
  () => props.htmlContent,
  async () => {
    // Inject font styles when content changes
    injectFontStyles(props.htmlContent)

    if (loadScript) {
      await nextTick()
      const lottieDivs = articleContainerRef.value.querySelectorAll(
        'div[lottie-id][media-type="lottie"]'
      )
      if (lottieDivs && lottieDivs.length > 0) {
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js',
          true
        )
      }
    }
    await nextTick()
    initLottieFromHtml(articleContainerRef.value)
  }
)
</script>

<style>
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6,
.ql-editor ol,
.ql-editor p,
.ql-editor pre,
.ql-editor ul {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  margin: 0;
  padding: 0;
}
.ql-editor ol,
.ql-editor ul {
  padding-left: 1.5em;
}
.ql-editor ul > li:before {
  content: '\2022';
}
.ql-editor
  ol
  li:not([data-list='bullet']):not([data-list='checked']):not([data-list='unchecked']):not(
    :has(span.ql-ui)
  ):before {
  content: counter(list-0, decimal) '. ';
}
.ql-editor ol li {
  counter-increment: list-0;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor li:before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}
.ql-editor ol > li,
.ql-editor ul > li {
  list-style-type: none;
}
.ql-editor ol li:not(.ql-direction-rtl),
.ql-editor ul li:not(.ql-direction-rtl) {
  padding-left: 1.5em;
}
.ql-editor li:not(.ql-direction-rtl):before {
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}
.ql-snow .ql-editor pre.ql-syntax {
  background-color: #23241f;
  color: #f8f8f2;
  overflow: visible;
}
.ql-snow .ql-editor pre {
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 5px 10px;
  white-space: pre-wrap;
}
section .ql-editor img {
  display: inline !important;
}
.quill-button-wrapper {
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
}
button.quill-button-container {
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  padding: 3px 10px !important;
  border-radius: 4px !important;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  transition: background-color 0.3s;
  display: inline-block;
}
.ql-a-button {
  color: inherit !important;
  text-decoration: none !important;
  cursor: pointer;
  display: inline-block;
}
.ql-button {
  width: 28px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
.ql-button svg {
  width: 18px;
  height: 18px;
}
.ql-editor p {
  font-size: 1rem;
}
.ql-editor .html-edit-overlay {
  display: none;
}
div .ql-editor {
  word-wrap: normal;
}
</style>
