import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import VueDsfr from '@gouvminint/vue-dsfr'
import DSaaSFR from 'dsaasfr'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvminint/vue-dsfr/styles'
import 'dsaasfr/styles'
import App from './App.vue'

// This is the exact install sequence a consuming app follows (see README).
const router = createRouter({
  // Hash history: works on static hosting (GitHub Pages) without server rewrites.
  history: createWebHashHistory(),
  // Every path renders App's content; the sidebar derives its active item from the URL.
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
})

createApp(App).use(router).use(VueDsfr).use(DSaaSFR).mount('#app')
