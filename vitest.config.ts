import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

export default defineVitestConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'nuxt',
    setupFiles: [],
    server: {
      deps: {
        inline: [/vue-router/, '#app', '@nuxt/test-utils'],
      },
    },
    testTimeout: 5000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/runtime/components/**/*.{js,ts,vue}', 'src/runtime/utils/**/*.js'],
      exclude: [
        '**/node_modules/**',
        '**/.nuxt/**',
        '**/dist/**',
        '**/tests/**',
        '**/*.spec.js',
        '**/*.spec.ts',
        '**/*.test.js',
        '**/*.test.ts',
        '**/playground/**',
        '**/coverage/**',
        '**/*.config.*',
        '**/*.stories.js',
        'src/runtime/components/icons/**',
      ],
      all: true,
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '#app': fileURLToPath(new URL('./node_modules/nuxt/dist/app', import.meta.url)),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
