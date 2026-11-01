import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import VueDsfr from '@gouvminint/vue-dsfr'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import '../src/styles/index.css'

setup((app) => {
  app.use(VueDsfr)
})

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    a11y: {
      // Fail stories on a11y violations rather than just reporting them.
      test: 'error',
    },
  },
  globalTypes: {
    theme: {
      description: 'Thème DSFR',
      toolbar: {
        title: 'Thème',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Clair' },
          { value: 'dark', title: 'Sombre' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.setAttribute('data-fr-scheme', context.globals.theme)
      document.documentElement.setAttribute('data-fr-theme', context.globals.theme)
      return story()
    },
  ],
}

export default preview
