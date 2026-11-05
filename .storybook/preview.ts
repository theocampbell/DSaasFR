import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import VueDsfr from '@gouvminint/vue-dsfr'
import { createMemoryHistory, createRouter } from 'vue-router'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvminint/vue-dsfr/styles'
import '../src/styles/index.css'

// Vue DSFR links are RouterLinks: give stories a router whose current path can be
// set per story with `parameters.route` (default '/').
export const storyRouter = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
})

setup((app) => {
  app.use(storyRouter)
  app.use(VueDsfr)
})

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Documentation', ['Accueil', 'Pour commencer', 'Contribuer'], 'Shell', 'Briques'],
      },
    },
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
      storyRouter.replace(context.parameters.route ?? '/')
      document.documentElement.setAttribute('data-fr-scheme', context.globals.theme)
      document.documentElement.setAttribute('data-fr-theme', context.globals.theme)
      return story()
    },
  ],
}

export default preview
