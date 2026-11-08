# Pour commencer

DSaaSFR **complète** Vue DSFR. Votre application utilise Vue DSFR comme d’habitude
(`DsfrButton`, `DsfrTable`, `DsfrModal`…) et DSaaSFR ajoute la structure d’une application
métier autour : barre latérale, fil d’Ariane avec l’action principale, barre d’outils,
panneau d’aperçu.

::: warning Proposition communautaire
DSaaSFR est une preuve de concept, pas un produit officiel du DSFR. Les composants sont au
stade de brouillon et leurs interprétations du DSFR sont décrites dans les
[fiches de décision](/decisions/), au statut « Proposé ».
:::

## Prérequis

DSaaSFR s’appuie sur les mêmes briques qu’un projet Vue DSFR. Ce sont des dépendances pair
(_peer dependencies_) : c’est votre application qui les installe.

| Paquet | Version |
|---|---|
| `vue` | 3.5 ou plus |
| `vue-router` | 5 |
| `@gouvminint/vue-dsfr` | 8.21 ou plus |

vue-router est obligatoire : la barre latérale déduit la page active de la route, et le fil
d’Ariane se construit à partir des routes.

## Installation

```bash
npm install @gouvminint/vue-dsfr @gouvfr/dsfr vue-router @dsaasfr/vue
```

::: tip Pourquoi `@gouvfr/dsfr` ?
Vue DSFR l’installe déjà, mais votre code importe directement ses feuilles de style : il doit
donc figurer dans vos propres dépendances (indispensable avec pnpm, qui n’expose que les
dépendances déclarées). Prenez la version attendue par Vue DSFR.
:::

## Déclarer les plugins et les styles

```ts
// main.ts
import { createApp } from 'vue'
import VueDsfr from '@gouvminint/vue-dsfr'
import DSaaSFR from '@dsaasfr/vue'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@dsaasfr/vue/styles'

import App from './App.vue'
import router from './router'

createApp(App).use(router).use(VueDsfr).use(DSaaSFR).mount('#app')
```

Deux points sur les feuilles de style :

- **`utility.main.min.css`, pas `utility.min.css`.** Ce dernier contient une ancienne
  requête média que Vite 8 (lightningcss) refuse à la compilation.
- **`scheme.min.css` est nécessaire pour le thème sombre.** `core.main.min.css` ne contient
  que la palette claire. Les composants DSaaSFR n’utilisent que les variables de couleur du
  DSFR : ils suivent le thème choisi sans réglage supplémentaire.

## Plugin ou imports un par un

`app.use(DSaaSFR)` enregistre globalement tous les composants `Dsaasfr*`. Vous pouvez aussi
les importer là où vous en avez besoin :

```ts
import { DsaasfrAppShell, DsaasfrSidebar } from '@dsaasfr/vue'
import type { DsaasfrSidebarItem } from '@dsaasfr/vue'
```

Dans ce cas, `app.use(DSaaSFR)` n’est pas nécessaire, mais gardez l’import
`@dsaasfr/vue/styles`. Le plugin accepte aussi l’option `registerComponents: false`, qui
désactive l’enregistrement global.

Les composables `useRouteBreadcrumb` et `usePreviewQuery` s’importent toujours depuis
`@dsaasfr/vue`.

## Premier écran

La mise en page se place dans une **route parente**. Toutes les pages authentifiées
s’affichent dans son `<RouterView />` ; la page de connexion reste en dehors.

```vue
<!-- src/layouts/AppLayout.vue -->
<script setup lang="ts">
import type { DsaasfrSidebarItem, DsaasfrUserMenuItem } from '@dsaasfr/vue'

const nav: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]

const account: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true, action: () => {} },
]
</script>

<template>
  <DsaasfrAppShell>
    <template #sidebar>
      <DsaasfrSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="nav"
      >
        <template #footer>
          <DsaasfrUserMenu
            name="Camille Martin"
            description="Instructrice · DDT 33"
            :items="account"
          />
        </template>
      </DsaasfrSidebar>
    </template>

    <template #breadcrumb>
      <DsaasfrBreadcrumbBar />
    </template>

    <RouterView />
  </DsaasfrAppShell>
</template>
```

```ts
// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/connexion', component: () => import('./pages/Connexion.vue') },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: () => import('./pages/TableauDeBord.vue'), meta: { title: 'Tableau de bord' } },
        { path: 'dossiers', component: () => import('./pages/Dossiers.vue'), meta: { title: 'Dossiers' } },
        {
          path: 'dossiers/:id',
          component: () => import('./pages/Dossier.vue'),
          meta: { title: route => `Dossier ${route.params.id}` },
        },
      ],
    },
  ],
})
```

## Titres de route et fil d’Ariane

`DsaasfrBreadcrumbBar` construit le fil d’Ariane à partir de l’URL : chaque préfixe du
chemin (`/`, `/dossiers`, `/dossiers/D-2026-2041`) est résolu par le routeur, et le
`meta.title` (ou `meta.breadcrumb`) de la route trouvée donne le libellé du niveau.

- Une chaîne : `meta: { title: 'Dossiers' }`.
- Une fonction de la route, pour les paramètres : ``meta: { title: route => `Dossier ${route.params.id}` }``.
- `meta: { breadcrumb: false }` masque un niveau (par exemple `/admin`, qui redirige).

Le détail est dans [useRouteBreadcrumb](/composants/use-route-breadcrumb).

Chaque page affiche aussi son titre complet dans un `<h1>`. Le dernier niveau du fil peut
être tronqué visuellement et ne reçoit pas le focus : le `<h1>` est le seul endroit où le
titre complet est toujours lisible.

```vue
<!-- src/pages/Dossiers.vue -->
<template>
  <h1 class="fr-h3">Dossiers</h1>
  …
</template>
```

## Points à connaître

- Les composants sont **présentationnels** : l’authentification, les droits et les données
  restent dans votre application. Filtrez par exemple les entrées de navigation selon le rôle
  avant de les passer à `DsaasfrSidebar` (voir [Navigation selon les rôles](/recettes/roles)).
- N’affichez pas `DsfrHeader` en plus de la barre latérale : le bloc-marque est déjà en haut de
  `DsaasfrSidebar`, qui porte la région `banner` de la page.
- Une seule action principale (bouton primaire) par vue, dans l’emplacement `actions` du fil
  d’Ariane. La barre d’outils utilise des boutons secondaires ou tertiaires.
- Sous 62em (fenêtre étroite ou zoom fort), la barre latérale devient l’en-tête mobile du DSFR
  et rien n’est plus fixé à l’écran.
- Les textes par défaut sont en français et se remplacent par des props (`navLabel`,
  `closeLabel`…).

## Et ensuite

- [Intégrer dans une application existante](/guide/integration)
- [Vue d’ensemble des composants](/composants/)
- [Bac à sable](https://theocampbell.github.io/DSaasFR/playground/) : une fausse application
  de back-office qui utilise tous les composants.
