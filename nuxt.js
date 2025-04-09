// https://nuxt.com/docs/guide/directory-structure/plugins
import { join } from 'path'

export default defineNuxtPlugin((nuxtApp) => {
  // Register components with prefix
  nuxtApp.hook('components:extend', (components) => {
    components.push({
      path: join(process.cwd(), 'components'),
      prefix: 'g'
    })
  })

  // Add i18n messages
  const { $i18n } = useNuxtApp()
  if ($i18n) {
    $i18n.mergeLocaleMessage('en', {
      quillEditor: {
        quillDesc: "To edit an image added to your editor, you need to select it and click on the image icon of the toolbar"
      },
      mediaTooLarge: "The size of your media exceeds the authorized limit. Please refer to your package details to check the maximum supported size."
    })

    $i18n.mergeLocaleMessage('fr', {
      quillEditor: {
        quillDesc: "Pour éditer une image ajoutée à votre éditeur, vous devez la sélectionner et cliquer sur l'icone image de la barre d'outil"
      },
      mediaTooLarge: "La taille de votre média dépasse la limite autorisée. Veuillez vous référer aux détails de votre colis pour vérifier la taille maximale prise en charge."
    })
  }
})
