# useRouteBreadcrumb

Construit les niveaux du fil d’Ariane à partir de l’URL courante et des titres déclarés dans
les routes. [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar) l’utilise quand vous ne lui
passez pas `items`. Vous pouvez aussi l’appeler vous-même, par exemple pour afficher le titre
de la page dans le `<h1>`.

## Signature

```ts
import { useRouteBreadcrumb } from '@dsaasfr/vue'

function useRouteBreadcrumb(): ComputedRef<DsaasfrBreadcrumbItem[]>
```

Le résultat est un `computed` en lecture seule, recalculé à chaque changement de route. Chaque
élément a la forme `{ text: string, to?: string }`. Le dernier élément est la page courante :
il n’a pas de `to`.

Si l’application n’a pas de routeur (`app.use(router)`), le résultat est une liste vide.

## Fonctionnement

Pour l’URL `/dossiers/D-2026-2041/pieces`, le composable :

1. découpe le chemin en préfixes : `/`, `/dossiers`, `/dossiers/D-2026-2041`,
   `/dossiers/D-2026-2041/pieces` ;
2. résout chaque préfixe avec le routeur ;
3. lit, sur la route trouvée (la plus profonde), `meta.breadcrumb`, ou à défaut `meta.title` ;
4. ignore les préfixes sans libellé, ou dont le libellé vaut `false`.

Cela fonctionne avec des routes à plat comme avec des routes imbriquées. Avec une route de
mise en page parente, mettez `meta` sur les routes enfants : c’est la route la plus profonde
qui est lue.

## Déclarer les titres

DSaaSFR étend le type `RouteMeta` de vue-router avec deux propriétés :

```ts
declare module 'vue-router' {
  interface RouteMeta {
    /** Libellé du niveau dans le fil d’Ariane. À défaut, `title`. `false` masque le niveau. */
    breadcrumb?: string | ((route: RouteLocationNormalizedLoaded) => string) | false
    /** Titre de la page, utilisé par le fil d’Ariane si `breadcrumb` est absent. */
    title?: string | ((route: RouteLocationNormalizedLoaded) => string)
  }
}
```

Le type de `breadcrumb` est exporté sous le nom `DsaasfrRouteBreadcrumb`.

### Une chaîne

```ts
{ path: '/dossiers', component: Dossiers, meta: { title: 'Dossiers' } }
```

### Une fonction de la route

Pour les paramètres de l’URL. La fonction reçoit la route résolue pour ce préfixe.

```ts
{
  path: '/dossiers/:id',
  component: Dossier,
  meta: { title: route => `Dossier ${route.params.id}` },
}
```

La fonction est synchrone : elle ne peut pas attendre une donnée chargée. Pour un libellé qui
dépend du serveur (« Dossier de Alix Petit »), passez `items` à `DsaasfrBreadcrumbBar` (voir
[Intégrer dans une application](/guide/integration#libelles-du-fil-d-ariane-qui-dependent-de-donnees-chargees)).

### Un libellé de fil différent du titre

```ts
{
  path: '/dossiers/:id/pieces/:piece',
  component: Piece,
  meta: {
    title: 'Pièce justificative',
    breadcrumb: route => `Pièce ${route.params.piece}`,
  },
}
```

### Masquer un niveau

`false` masque le niveau. Utile pour un préfixe qui n’est pas une vraie page, par exemple une
redirection :

```ts
{ path: '/admin', redirect: '/admin/agents', meta: { breadcrumb: false } },
{ path: '/admin/agents', component: Agents, meta: { title: 'Agents' } },
```

Sur `/admin/agents`, le fil affiche « Tableau de bord › Agents ».

::: tip Route « page introuvable »
Une route attrape-tout (`/:pathMatch(.*)*`) n’ajoute pas de niveau au milieu du fil : un
préfixe qui ne correspond qu’à elle est ignoré. Elle n’apparaît que lorsqu’elle est la page
courante (« Tableau de bord › Page introuvable »).
:::

## Exemple : le `<h1>` de la page

Le même fil fournit le titre de la page, comme dans le bac à sable :

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRouteBreadcrumb } from '@dsaasfr/vue'

const trail = useRouteBreadcrumb()
const pageTitle = computed(() => trail.value[trail.value.length - 1]?.text ?? '')
</script>

<template>
  <h1 class="fr-h3">{{ pageTitle }}</h1>
</template>
```

## Voir aussi

- [Fiche de décision 0006](/decisions/0006-breadcrumb-bar)
- [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar)
- [Pour commencer](/guide/pour-commencer#titres-de-route-et-fil-d-ariane)
