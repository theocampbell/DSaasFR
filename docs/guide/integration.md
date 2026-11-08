# Intégrer dans une application

Cette page s’adresse aux équipes qui ajoutent DSaaSFR à une application existante, et en
particulier aux développeurs qui viennent de React. Elle montre où placer chaque
responsabilité et où se trouvent les frictions connues.

Le principe : **les composants DSaaSFR sont présentationnels**. Ils affichent ce que vous
leur donnez (entrées de navigation, nom de la personne connectée, libellés du fil
d’Ariane) et émettent des événements. L’authentification, les rôles, les données et les
appels au serveur restent dans votre application.

## Correspondances avec React

| En React | En Vue 3 |
|---|---|
| Contexte d’authentification (`AuthContext` + `useAuth()`) | Un store Pinia, ou un composable qui partage un état, ou `provide` / `inject` |
| Composant de mise en page avec `<Outlet />` (React Router) | Route parente dont le composant contient `<RouterView />` |
| Route protégée (`<RequireAuth>`) | Garde de navigation `router.beforeEach` qui lit `meta` |
| `useMemo` sur une liste filtrée | `computed` |
| Rendu conditionnel `{cond && <Button />}` | `v-if` |
| _Props_ de rendu, `children` | Emplacements (slots), y compris avec portée (_scoped slots_) |
| État contrôlé (`value` + `onChange`) | `v-model` (`v-model:preview-open`, `v-model:open`…) |

## L’état d’authentification

Placez la personne connectée et ses droits dans un store. Avec Pinia :

```ts
// src/stores/session.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Role = 'instructeur' | 'administrateur'

export interface Agent {
  nom: string
  service: string
  roles: Role[]
}

export const useSession = defineStore('session', () => {
  const agent = ref<Agent | null>(null)
  const connecte = computed(() => agent.value !== null)
  const aLeRole = (role: Role) => agent.value?.roles.includes(role) ?? false

  async function charger() {
    const reponse = await fetch('/api/session')
    agent.value = reponse.ok ? await reponse.json() : null
  }

  async function deconnecter() {
    await fetch('/api/session', { method: 'DELETE' })
    agent.value = null
  }

  return { agent, connecte, aLeRole, charger, deconnecter }
})
```

Sans Pinia, un composable qui partage un `ref` au niveau du module, ou `provide` dans
`App.vue` et `inject` dans les pages, remplissent le même rôle. DSaaSFR n’impose rien.

## La route de mise en page

Le composant qui contient `DsaasfrAppShell` est le composant d’une route parente. Les pages
sont ses routes enfants et s’affichent dans son `<RouterView />`, à la manière de
`<Outlet />`.

```ts
// src/router.ts
const routes = [
  { path: '/connexion', component: Connexion, meta: { public: true } },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: TableauDeBord, meta: { title: 'Tableau de bord' } },
      { path: 'dossiers', component: Dossiers, meta: { title: 'Dossiers' } },
      { path: 'dossiers/:id', component: Dossier, meta: { title: route => `Dossier ${route.params.id}` } },
      { path: 'admin/agents', component: Agents, meta: { title: 'Agents', roles: ['administrateur'] } },
    ],
  },
]
```

La page de connexion est en dehors de la route parente : elle s’affiche sans barre latérale.

## Les gardes de navigation

Une garde globale remplace le composant de route protégée. Elle lit `meta` sur toutes les
routes correspondantes (`to.matched`), parents compris.

```ts
router.beforeEach(async (to) => {
  const session = useSession()
  if (to.meta.public) return true
  if (!session.connecte) await session.charger()
  if (!session.connecte) return { path: '/connexion', query: { retour: to.fullPath } }

  const roles = to.matched.flatMap(record => record.meta.roles ?? [])
  if (roles.length && !roles.some(role => session.aLeRole(role))) return { path: '/' }
  return true
})
```

Pour typer `meta.roles` et `meta.public`, étendez `RouteMeta` (DSaaSFR y ajoute déjà
`title` et `breadcrumb`) :

```ts
// src/router.d.ts
import 'vue-router'
import type { Role } from './stores/session'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    roles?: Role[]
  }
}
```

## Navigation et actions selon le rôle

Construisez les entrées de la barre latérale avec un `computed` qui filtre selon les droits,
et affichez l’action principale avec `v-if`. La recette
[Navigation selon les rôles](/recettes/roles) donne le code complet.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { DsaasfrSidebarItem } from '@dsaasfr/vue'
import { useSession } from '@/stores/session'

const session = useSession()

const nav = computed<DsaasfrSidebarItem[]>(() => [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  ...(session.aLeRole('administrateur')
    ? [{ text: 'Administration', menuItems: [{ text: 'Agents', to: '/admin/agents' }] }]
    : []),
])
</script>
```

Masquer une entrée ne protège rien : la garde de navigation, et surtout le serveur, doivent
refuser l’accès.

## Les frictions connues

### Libellés du fil d’Ariane qui dépendent de données chargées

`meta.title` peut être une fonction de la route, mais elle est synchrone et ne reçoit que la
route. Pour afficher « Dossier de Alix Petit » plutôt que « Dossier D-2026-2041 », il faut une
donnée chargée par la page. En attendant une solution dans la bibliothèque, passez les
niveaux vous-même avec la prop `items` :

```vue
<DsaasfrBreadcrumbBar
  :items="[
    { text: 'Tableau de bord', to: '/' },
    { text: 'Dossiers', to: '/dossiers' },
    { text: dossier ? `Dossier de ${dossier.demandeur}` : 'Dossier' },
  ]"
/>
```

Comme la barre est dans la mise en page, partagez la donnée entre la page et la mise en page
(store, ou `provide` / `inject`). Le `<h1>` de la page doit porter le même titre complet.

### URL désordonnées

Le fil d’Ariane suit les préfixes de l’URL. Si vos URL ne reflètent pas la hiérarchie
(`/dossier-detail?id=2041`, ou `/dossiers/2041` sans route `/dossiers`), le fil sera
incomplet. Deux solutions :

- déclarer les routes intermédiaires, avec `meta: { breadcrumb: false }` pour celles qui
  ne sont pas des pages (par exemple `/admin`, qui redirige) ;
- ou utiliser la prop `items` sur les pages concernées.

::: tip Route « page introuvable »
Un préfixe qui ne correspond qu’à une route attrape-tout (`/:pathMatch(.*)*`) est ignoré :
« Page introuvable » n’apparaît jamais au milieu du fil, seulement comme page courante.
:::

### Migrer depuis une mise en page avec `DsfrHeader`

- Le bloc-marque et le nom du service passent de `DsfrHeader` à `DsaasfrSidebar`
  (`service-title`, `service-description`, `logo-text`).
- Les liens d’accès rapide liés au compte (profil, déconnexion) passent dans
  `DsaasfrUserMenu`, dans l’emplacement `footer` de la barre latérale.
- La navigation principale (`DsfrNavigation`) devient la prop `items` de la barre latérale ;
  les sous-menus deviennent des groupes (`menuItems`).
- Retirez `DsfrHeader` : une page ne doit avoir qu’une seule région `banner`. Si vous gardez
  temporairement un en-tête, utilisez l’emplacement `header` de `DsaasfrAppShell`, sans
  barre latérale.
- Le contenu n’est plus dans un `fr-container` centré : la page occupe toute la largeur
  disponible.

### vue-router est requis

La barre latérale, le fil d’Ariane, le menu utilisateur et `usePreviewQuery` utilisent
vue-router (page active, liens `RouterLink`, paramètres de l’URL). Une application sans
routeur doit d’abord en ajouter un. Si vous hébergez l’application sur un serveur statique
sans réécriture d’URL, `createWebHashHistory()` fonctionne.

### Conflits de CSS

- Les composants utilisent les classes et variables du DSFR. Une feuille de style globale qui
  redéfinit `button`, `a`, `nav` ou `.fr-*` les modifie aussi.
- Retirez les marges et largeurs maximales globales sur `body` ou `#app` : la mise en page
  occupe toute la fenêtre.
- Une autre bibliothèque de composants (Vuetify, PrimeVue…) chargée en parallèle peut
  réinitialiser les styles de base du DSFR. Chargez les styles du DSFR en dernier et vérifiez
  le rendu dans les deux thèmes.

## Ce qui reste dans votre application

| Sujet | Où |
|---|---|
| Session, rôles, droits | Store ou composable de l’application |
| Protection des routes | Gardes de navigation et serveur |
| Données des listes, filtres, pagination | Application et serveur (voir [Filtres](/recettes/filtres)) |
| Élément affiché dans l’aperçu | Application, à partir de `usePreviewQuery` (voir [Aperçu](/recettes/apercu)) |
| Titre des pages | Routes (`meta.title`) et `<h1>` de chaque page |
| Titre de l’onglet (`document.title`) | Application, par exemple dans `router.afterEach` (pas encore géré par la bibliothèque) |
