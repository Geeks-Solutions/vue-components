import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['components/**/*.vue'],
            exclude: ['node_modules/']
        },
        deps: {
            inline: ['quill', '@vueuse/core']
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            '~': resolve(__dirname, './'),
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
})