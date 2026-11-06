# Navigation selon les rôles

Cette recette montre comment adapter la navigation et les actions aux droits de la personne
connectée : entrées de la barre latérale, action principale de la page, accès aux routes.

::: warning Code d’application
Rien de ce qui suit n’est dans la bibliothèque. DSaaSFR affiche les entrées et les boutons que
vous lui donnez ; la session, les rôles et les règles d’accès sont à écrire dans votre
application. Le code ci-dessous est un exemple, à adapter à votre système d’authentification.
:::

Masquer une entrée ou un bouton n’est pas une protection : c’est un confort pour
l’utilisateur. Le serveur doit refuser toute action non autorisée, quelle que soit l’interface.

## 1. La session (application)

Un store qui expose la personne connectée et une fonction de vérification des droits. Voir
[Intégrer dans une application](/guide/integration#l-etat-d-authentification) pour un
exemple complet avec Pinia.

```ts
// src/stores/session.ts (extrait)
export type Role = 'instructeur' | 'administrateur'

export const useSession = defineStore('session', () => {
  const agent = ref<{ nom: string, service: string, roles: Role[] } | null>(null)
  const connecte = computed(() => agent.value !== null)
  const aLeRole = (role: Role) => agent.value?.roles.includes(role) ?? false
  // charger(), deconnecter()…
  return { agent, connecte, aLeRole }
})
```

## 2. Les routes et leurs rôles (application)

Déclarez les rôles requis dans `meta.roles`. La page de connexion est **en dehors** de la
route de mise en page : elle s’affiche sans barre latérale et reste accessible sans session.

```ts
// src/router.ts
const routes = [
  { path: '/connexion', component: Connexion, meta: { public: true, title: 'Connexion' } },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: TableauDeBord, meta: { title: 'Tableau de bord' } },
      { path: 'dossiers', component: Dossiers, meta: { title: 'Dossiers' } },
      { path: 'dossiers/:id', component: Dossier, meta: { title: route => `Dossier ${route.params.id}` } },
      { path: 'admin', redirect: '/admin/agents', meta: { breadcrumb: false, roles: ['administrateur'] } },
      { path: 'admin/agents', component: Agents, meta: { title: 'Agents', roles: ['administrateur'] } },
      { path: 'admin/parametres', component: Parametres, meta: { title: 'Paramètres', roles: ['administrateur'] } },
    ],
  },
]
```

Pour que TypeScript connaisse `meta.roles` et `meta.public`, étendez `RouteMeta`. DSaaSFR y
déclare déjà `title` et `breadcrumb`.

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

## 3. La garde de navigation (application)

```ts
router.beforeEach(async (to) => {
  const session = useSession()
  if (to.meta.public) return true

  if (!session.connecte) await session.charger()
  if (!session.connecte) return { path: '/connexion', query: { retour: to.fullPath } }

  // Rôles demandés par la route et ses parents.
  const roles = to.matched.flatMap(record => record.meta.roles ?? [])
  if (roles.length && !roles.some(role => session.aLeRole(role))) return { path: '/' }

  return true
})
```

Plutôt qu’une redirection silencieuse vers l’accueil, vous pouvez afficher une page « Accès
refusé » qui explique pourquoi la page n’est pas disponible.

## 4. La navigation filtrée (application)

Construisez les entrées de `DsaasfrSidebar` avec un `computed`. Il est recalculé quand la
session change (connexion, changement de rôle).

```vue
<!-- src/layouts/AppLayout.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { DsaasfrSidebarItem, DsaasfrUserMenuItem } from '@dsaasfr/vue'
import { useSession } from '@/stores/session'
import { useRouter } from 'vue-router'

const session = useSession()
const router = useRouter()

const nav = computed<DsaasfrSidebarItem[]>(() => [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  ...(session.aLeRole('administrateur')
    ? [{
        text: 'Administration',
        menuItems: [
          { text: 'Agents', to: '/admin/agents' },
          { text: 'Paramètres', to: '/admin/parametres' },
        ],
      }]
    : []),
])

const account: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  {
    text: 'Se déconnecter',
    icon: 'fr-icon-logout-box-r-line',
    separated: true,
    action: async () => {
      await session.deconnecter()
      await router.push('/connexion')
    },
  },
]
</script>

<template>
  <DsaasfrAppShell>
    <template #sidebar>
      <DsaasfrSidebar service-title="Démarches Pro" :items="nav">
        <template #footer>
          <DsaasfrUserMenu
            :name="session.agent?.nom ?? ''"
            :description="session.agent?.service"
            :items="account"
          />
        </template>
      </DsaasfrSidebar>
    </template>
    <!-- … -->
  </DsaasfrAppShell>
</template>
```

Si un groupe n’a plus aucune entrée visible, retirez le groupe entier plutôt que d’afficher
un groupe vide.

Pour éviter de répéter les rôles, vous pouvez dériver la navigation des routes
(`router.getRoutes()` et `meta.roles`). La liste explicite ci-dessus reste plus lisible tant
que la navigation est courte.

## 5. L’action principale selon le rôle (application)

L’action principale est dans l’emplacement `actions` de `DsaasfrBreadcrumbBar`. Conditionnez
l’emplacement avec `v-if` : sans action, rien n’est affiché à droite.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSession } from '@/stores/session'

const route = useRoute()
const session = useSession()

const keyAction = computed(() => {
  if (route.path === '/dossiers' && session.aLeRole('instructeur'))
    return { label: 'Nouveau dossier', icon: 'fr-icon-add-line', to: '/dossiers/nouveau' }
  if (route.path === '/admin/agents' && session.aLeRole('administrateur'))
    return { label: 'Ajouter un agent', icon: 'fr-icon-user-add-line', to: '/admin/agents/nouveau' }
  return undefined
})
</script>

<template>
  <DsaasfrBreadcrumbBar>
    <template v-if="keyAction" #actions>
      <RouterLink
        :to="keyAction.to"
        :class="['fr-btn', 'fr-btn--sm', 'fr-btn--icon-left', keyAction.icon]"
      >
        {{ keyAction.label }}
      </RouterLink>
    </template>
  </DsaasfrBreadcrumbBar>
</template>
```

Les deux actions mènent à une page de création : ce sont des liens (`RouterLink`) avec
l’apparence d’un bouton DSFR. Une action qui s’exécute sur place (« Rendre une décision » qui
ouvre une modale) est un `DsfrButton`.

Pour les actions dans les pages (boutons d’une ligne de tableau, actions de la barre
d’outils), appliquez la même règle avec `v-if`.

### Masquer ou désactiver ?

- **Masquez** une action que la personne n’aura jamais le droit de faire (son rôle ne le
  permet pas). Un bouton désactivé en permanence encombre l’écran.
- **Désactivez**, avec une explication visible à côté, une action temporairement impossible
  (dossier incomplet, délai dépassé). Un bouton désactivé ne reçoit pas le focus et n’est pas
  toujours annoncé : l’explication ne doit pas dépendre d’une infobulle.

## Voir aussi

- [Intégrer dans une application](/guide/integration)
- [DsaasfrSidebar](/composants/sidebar), [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar),
  [DsaasfrUserMenu](/composants/user-menu)
