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

const Page = { render: () => null }
const pieceTitle = (piece: string) =>
  ({ 1: 'Formulaire Cerfa n° 13406*09 signé', 2: 'Plan de situation du terrain et plan de masse des constructions', 3: 'Notice décrivant le terrain et le projet' } as Record<string, string>)[piece] ?? `Pièce ${piece}`

// This is the exact install sequence a consuming app follows (see README).
const router = createRouter({
  // Hash history: works on static hosting (GitHub Pages) without server rewrites.
  history: createWebHashHistory(),
  // App renders every page itself (PageBody); routes only carry titles, which drive the
  // breadcrumb (DsaasfrBreadcrumbBar) and the page <h1>.
  routes: [
    { path: '/', component: Page, meta: { title: 'Tableau de bord' } },
    { path: '/dossiers', component: Page, meta: { title: 'Dossiers' } },
    { path: '/dossiers/:id', component: Page, meta: { title: route => `Dossier ${route.params.id}` } },
    { path: '/dossiers/:id/pieces', component: Page, meta: { title: 'Pièces justificatives' } },
    {
      path: '/dossiers/:id/pieces/:piece',
      component: Page,
      meta: { title: route => pieceTitle(String(route.params.piece)) },
    },
    { path: '/usagers', component: Page, meta: { title: 'Usagers' } },
    { path: '/admin', redirect: '/admin/agents', meta: { breadcrumb: false } },
    { path: '/admin/agents', component: Page, meta: { title: 'Agents' } },
    { path: '/admin/parametres', component: Page, meta: { title: 'Paramètres' } },
    { path: '/departements', component: Page, meta: { title: 'Tous les départements' } },
    { path: '/profil', component: Page, meta: { title: 'Mon profil' } },
    { path: '/preferences', component: Page, meta: { title: 'Préférences' } },
    { path: '/notifications', component: Page, meta: { title: 'Notifications' } },
    { path: '/:pathMatch(.*)*', component: Page, meta: { title: 'Page introuvable' } },
  ],
})

createApp(App).use(router).use(VueDsfr).use(DSaaSFR).mount('#app')
