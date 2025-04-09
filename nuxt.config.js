// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Global page headers
  app: {
    head: {
      title: 'vue-components',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Global CSS
  css: [
    "~/assets/icons/icomoon/style.css"
  ],

  // Plugins
  plugins: [

  ],

  // Auto import components
  components: {
    global: true,
    dirs: ['~/components']
  },

  // Modules
  modules: [
    // Content
    '@nuxt/content',
    // i18n
    '@nuxtjs/i18n',
    // Tailwind CSS
    '@nuxtjs/tailwindcss',
    // Pinia
    '@pinia/nuxt',
    // VueUse
    '@vueuse/nuxt',
    // Tailvue
    'nuxt-tailvue',
  ],

  // i18n configuration
  i18n: {
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
    locales: [
      {
        name: "French",
        code: "fr",
        iso: "fr",
        file: "fr.js"
      },
      {
        name: "English",
        code: "en",
        iso: "en",
        file: "en.js"
      }
    ]
  },

  // Tailvue configuration
  tailvue: {
    toast: true
  },

  // Content configuration
  content: {
    // Configuration
  },

  // Build Configuration
  build: {
    transpile: ['quill']
  },

  // Development tools
  devtools: {
    enabled: true
  },

  // Experimental features
  experimental: {
    // Vue features
    componentIslands: true,
  },

  // TypeScript
  typescript: {
    strict: true
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['quill']
    }
  }
})
