import '../src/runtime/assets/icons/icomoon/style.css'
import { setup } from '@storybook/vue3'

// Import your auto-imported components
import AutoComplete from '../src/runtime/components/AutoComplete.vue'
import Buttons from '../src/runtime/components/Buttons.vue'
import Card from '../src/runtime/components/media/Card.vue'
import CreateMedia from '../src/runtime/components/media/CreateMedia.vue'
import EditMedia from '../src/runtime/components/media/EditMedia.vue'
import Folder from '../src/runtime/components/media/Folder.vue'
import ListMedias from '../src/runtime/components/media/ListMedias.vue'
import MainFilter from '../src/runtime/components/MainFilter.vue'
import FilterSelect from '../src/runtime/components/FilterSelect.vue'
import HeaderContainer from '../src/runtime/components/HeaderContainer.vue'
import UniversalViewer from '../src/runtime/components/UniversalViewer.vue'
import LottieAnimation from '../src/runtime/components/LottieAnimation.client.vue'

// Global component registration
setup((app) => {
  // Register components that are auto-imported in Nuxt
  app.component('LazyGAutoComplete', AutoComplete)
  app.component('GAutoComplete', AutoComplete)
  app.component('LazyGButtons', Buttons)
  app.component('GButtons', Buttons)

  app.component('LazyGMediaCard', Card)
  app.component('GMediaCard', Card)
  app.component('MediaCard', Card)
  app.component('LazyGMediaCreateMedia', CreateMedia)
  app.component('GMediaCreateMedia', CreateMedia)
  app.component('MediaCreateMedia', CreateMedia)
  app.component('LazyGMediaEditMedia', EditMedia)
  app.component('GMediaEditMedia', EditMedia)
  app.component('MediaEditMedia', EditMedia)
  app.component('LazyGMediaFolder', Folder)
  app.component('GMediaFolder', Folder)
  app.component('MediaFolder', Folder)
  app.component('LazyGMediaListMedias', ListMedias)
  app.component('GMediaListMedias', ListMedias)
  app.component('MediaListMedias', ListMedias)
  app.component('LazyGMainFilter', MainFilter)
  app.component('LazyGFilterSelect', FilterSelect)
  app.component('LazyGHeaderContainer', HeaderContainer)
  app.component('LazyGUniversalViewer', UniversalViewer)
  app.component('LazyGLottieAnimation', LottieAnimation)
})

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
