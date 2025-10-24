export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '../src/module'],
  geeksComponents: {},
  compatibilityDate: '2025-04-08',
  devtools: { enabled: true },
  tailwindcss: {
    exposeConfig: true,
  }
})
