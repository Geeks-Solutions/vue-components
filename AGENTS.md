# AGENTS.md

This document provides guidelines for agentic coding agents working on this Vue Components Nuxt module.

## Build, Lint, and Test Commands

### Development

- `npm run dev` - Start playground in dev mode
- `npm run dev:build` - Build playground
- `npm run dev:prepare` - Prepare stubs for development

### Code Quality

- `npm run lint` - Run ESLint (auto-fixes with `npm run format`)
- `npm run format` - Format code with Prettier
- `npm run test:types` - Run TypeScript type checking (vue-tsc)

### Testing

- `npm run test` - Run all tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npx vitest run <path-to-test>` - Run a specific test file
  Example: `npx vitest run src/runtime/components/__tests__/UniversalViewer.spec.js`

## Code Style Guidelines

### General Formatting

- **No semicolons** (Prettier: `semi: false`)
- **Single quotes** (Prettier: `singleQuote: true`)
- **2-space indentation** (Prettier: `tabWidth: 2`)
- **Line length**: 100 characters (Prettier: `printWidth: 100`)
- **Trailing commas**: ES5 style (Prettier: `trailingComma: 'es5'`)

### Import Style

- Use ES6 imports with named exports
- For Vue composables in Nuxt components: `import { ref, computed, watch, defineAsyncComponent } from '#imports'`
- Test files use relative imports: `import UniversalViewer from '../UniversalViewer.vue'`
- Order: 1) External libs, 2) Internal modules, 3) Vue imports

### Component Structure

Vue components use `<script setup>` syntax:

```vue
<script setup>
import { ref, computed } from '#imports'

const props = defineProps({
  // Prop definitions
})

const emit = defineEmits(['event-name'])

const localState = ref(null)
const computedValue = computed(() => {
  /* ... */
})

// Expose methods if needed
defineExpose({ methodName })
</script>
```

### Naming Conventions

- **Components**: PascalCase (e.g., `AlertPopup.vue`, `AutoComplete.vue`, `MediaComponent.vue`)
- **Icons**: lowercase or kebab-case (e.g., `close.vue`, `mediaDocument.vue`)
- **Props**: camelCase (e.g., `showPopupCode`, `canBeDeleted`, `filterModel`)
- **Events**: kebab-case (e.g., `item-selected`, `cancel`, `apply`)
- **CSS classes**: kebab-case or camelCase for utility classes (Tailwind convention)
- **Functions/variables**: camelCase (e.g., `scrollToFirstError`, `isFileTypeSupported`)
- **Constants**: PascalCase or UPPER_SNAKE_CASE for constants (e.g., `languagesList`)

### TypeScript/Types

- Type definitions go alongside props using `defineProps({ type: Type })`
- `@typescript-eslint/no-explicit-any` is disabled, but prefer explicit types when possible
- Test files use `.spec.js` or `.spec.ts` extension
- Module is ES module (`"type": "module"` in package.json)

### Error Handling

- Use `try/catch` for async operations
- Console logs are disallowed (`no-console: 'error'`)
- Debugger statements are disallowed (`no-debugger: 'error'`)
- Use proper error boundaries and user-friendly error messages
- Toast notifications for user-facing errors (see `medias.showToast` in tests)

### Vue-Specific Rules

- **Multi-word component names**: Disabled (`vue/multi-word-component-names: 'off'`)
- **v-html**: Allowed (`vue/no-v-html: 'off'`)
- **v-if with v-for**: Allowed (`vue/no-use-v-if-with-v-for: 'off'`)
- **CRITICAL**: Multiline v-on handlers restricted by custom rule `local-rules/no-multiline-v-on`
  - Only allowed if handler contains a single statement/expression
  - Move complex logic to methods to avoid build crashes with unplugin-vue-i18n
  - Arrow functions in v-on handlers are allowed exceptions

### Testing Guidelines

- Use Vitest with `@nuxt/test-utils` and `@vue/test-utils`
- Test files located in `__tests__/` directories adjacent to components
- Test file naming: `*.spec.js` or `*.spec.ts`
- Mock Nuxt components like `NuxtImg`, Lazy-prefixed components in tests
- Use `describe`, `it`, `expect`, `vi` from vitest
- Example mock structure:
  ```javascript
  const NuxtImg = { template: '<img :src="src" />', props: ['src'] }
  const LazyGLottieAnimation = { template: '<div class="lottie"></div>' }
  ```
- Stub components that are not under test to isolate functionality
- Test file examples: `src/runtime/components/__tests__/UniversalViewer.spec.js`

### Component Registration

- All components auto-registered with `g` prefix globally
- Usage: `<GAlertPopup />`, `<GButtons />`, `<GAutoComplete />`
- Configured via `addComponentsDir` in `src/module.ts` with `prefix: 'g'`

### File Organization

- `src/runtime/components/` - Vue component files
- `src/runtime/components/__tests__/` - Component test files
- `src/runtime/utils/` - Utility functions and constants (e.g., `constants.js`)
- `src/runtime/lang/` - i18n locale files (en.json, fr.json)
- `src/runtime/assets/icons/icomoon/` - Icon font styles
- Icons have dedicated subdirectory: `src/runtime/components/icons/`

### Localization

- Module uses `@nuxtjs/i18n`
- Locales: English (en) and French (fr)
- Default locale: English
- Language files in `src/runtime/lang/`

### Vue 3 Composables

- Prefer Composition API with `<script setup>`
- Use Nuxt auto-imports from `#imports` (not from 'vue' directly)
- Use `defineAsyncComponent` for lazy-loaded components

### Client-Side Components

- Components ending with `.client.vue` are client-side only (e.g., `LottieAnimation.client.vue`)
- Use `defineAsyncComponent` to lazy-load components when needed

### CSS/Styling

- Tailwind CSS is used (`@nuxtjs/tailwindcss`)
- Utility-first approach in templates
- Scoped styles in `<style scoped>` blocks when needed
- Icomoon icon fonts registered globally in `src/runtime/assets/icons/icomoon/style.css`

### Build & Release

- Build: `npm run prepack` (uses `nuxt-module-build`)
- Release: `npm run release` (runs lint, test, prepack, changelogen, publish)
- Type stubs: `npm run dev:prepare` generates stubs pointing to `src` for development

### Important Notes

- Components use `.client.vue` suffix for client-only components
- Quill editor requires special transpilation (configured in nuxt.config.ts)
- Components with "Lazy" prefix are auto-imported by Nuxt
- Storybook available via `npm run storybook` on port 6006
