import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import VueDsfr from '@gouvminint/vue-dsfr'
import DSaaSFR from '@dsaasfr/vue'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@dsaasfr/vue/styles'
import App from './App.vue'
const Page = { template: '<p>Page</p>' }
const router = createRouter({ history: createWebHashHistory(), routes: [{ path: '/', component: Page, meta: { title: 'Accueil' } }, { path: '/dossiers', component: Page, meta: { title: 'Dossiers' } }] })
createApp(App).use(router).use(VueDsfr).use(DSaaSFR).mount('#app')
