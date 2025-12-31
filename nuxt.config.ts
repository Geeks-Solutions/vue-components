// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
  ],
  i18n: {
    lazy: true,
    locales: [
      {
        name: 'French',
        code: 'fr',
        iso: 'fr',
        file: 'fr.json',
      },
      {
        name: 'English',
        code: 'en',
        iso: 'en',
        file: 'en.json',
      },
    ],
    langDir: resolve(__dirname, 'src/runtime/lang'),
    defaultLocale: 'en',
  },
  imports: {
    autoImport: false,
  },
  build: {
    transpile: ['quill'],
  },
  vite: {
    optimizeDeps: {
      exclude: ['quill'],
    },
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
})
