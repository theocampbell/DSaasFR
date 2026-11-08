# DsaasfrBreadcrumbBar

La **barre de fil d’Ariane** est la première ligne de la mise en page : le fil d’Ariane à
gauche, l’action principale de la page à droite. Par défaut, les niveaux du fil sont
construits à partir de l’URL et des titres déclarés dans les routes.

## Quand l’utiliser

- Dans l’emplacement `breadcrumb` de [DsaasfrAppShell](/composants/app-shell), sur toutes les
  pages de l’application.
- Pour placer **l’action principale** de la page (un bouton primaire), en haut à droite :
  « Nouveau dossier », « Rendre une décision ».
- Pas dans le contenu d’une page de site public : utilisez `DsfrBreadcrumb` de Vue DSFR.
- Les outils secondaires de la page (« Filtrer », « Exporter ») vont dans la
  [barre d’outils](/composants/toolbar).

## Exemple

<Example story="shell-dsaasfrbreadcrumbbar--with-key-action" title="fil d’Ariane à deux niveaux et bouton Nouveau dossier" :height="110" />

Sans la prop `items`, les niveaux viennent des routes :

```vue
<DsaasfrBreadcrumbBar>
  <template #actions>
    <DsfrButton label="Nouveau dossier" icon="fr-icon-add-line" size="sm" />
  </template>
</DsaasfrBreadcrumbBar>
```

```ts
// router.ts
const routes = [
  { path: '/', component: TableauDeBord, meta: { title: 'Tableau de bord' } },
  { path: '/dossiers', component: Dossiers, meta: { title: 'Dossiers' } },
]
```

Sur `/dossiers`, la barre affiche « Tableau de bord › Dossiers ». Le dernier niveau est la
page courante et n’est pas un lien. Voir [useRouteBreadcrumb](/composants/use-route-breadcrumb)
pour les titres calculés et les niveaux masqués.

Vous pouvez aussi passer les niveaux vous-même :

```vue
<DsaasfrBreadcrumbBar :items="[{ text: 'Tableau de bord', to: '/' }, { text: 'Dossiers' }]" />
```

### Action selon la page

L’emplacement `actions` n’affiche rien s’il n’est pas fourni. Pour n’avoir une action que sur
certaines pages, conditionnez l’emplacement (exemple tiré du bac à sable) :

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const keyAction = computed(() => {
  if (/^\/dossiers\/[^/]+$/.test(route.path)) return { label: 'Rendre une décision', icon: 'fr-icon-check-line' }
  if (route.path === '/dossiers') return { label: 'Nouveau dossier', icon: 'fr-icon-add-line' }
  return undefined
})
</script>

<template>
  <DsaasfrBreadcrumbBar>
    <template v-if="keyAction" #actions>
      <DsfrButton :label="keyAction.label" :icon="keyAction.icon" size="sm" />
    </template>
  </DsaasfrBreadcrumbBar>
</template>
```

### Fil long, replié

<Example story="shell-dsaasfrbreadcrumbbar--deep-collapsed" title="cinq niveaux, niveaux intermédiaires repliés dans un bouton" :height="110" />

Au-delà de `maxItems` niveaux (4 par défaut), les niveaux intermédiaires sont remplacés par
un bouton « … ». Le premier niveau et les derniers restent visibles. Le bouton affiche le fil
complet ; à la page suivante, le fil est de nouveau replié.

```vue
<DsaasfrBreadcrumbBar
  :items="[
    { text: 'Tableau de bord', to: '/' },
    { text: 'Dossiers', to: '/dossiers' },
    { text: 'Dossier D-2026-2041', to: '/dossiers/D-2026-2041' },
    { text: 'Pièces justificatives', to: '/dossiers/D-2026-2041/pieces' },
    { text: 'Plan de situation du terrain et plan de masse des constructions' },
  ]"
>
  <template #actions>
    <DsfrButton label="Ajouter une pièce" icon="fr-icon-attachment-line" size="sm" />
  </template>
</DsaasfrBreadcrumbBar>
```

Les libellés longs sont tronqués : les niveaux parents sont plafonnés à 16rem, et seule la page
courante rétrécit, jusqu’à 10rem. Au-delà, le fil passe à la ligne. Un libellé tronqué reçoit
son texte complet en infobulle.

### Sans action

<Example story="shell-dsaasfrbreadcrumbbar--without-action" title="fil d’Ariane seul, sur toute la largeur" :height="110" />

```vue
<DsaasfrBreadcrumbBar
  :items="[{ text: 'Tableau de bord', to: '/' }, { text: 'Administration', to: '/admin' }, { text: 'Agents' }]"
/>
```

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `items` | `DsaasfrBreadcrumbItem[]` | — | Niveaux du fil. Sans cette prop, ils sont construits à partir des routes (`meta.breadcrumb` ou `meta.title`). |
| `maxItems` | `number` | `4` | Au-delà de ce nombre de niveaux, les niveaux intermédiaires se replient dans un bouton « … ». Minimum 3. |
| `navigationLabel` | `string` | `'vous êtes ici :'` | Nom accessible de la navigation (intitulé du DSFR). |
| `expandLabel` | `string` | `'Afficher tous les niveaux du fil d’Ariane'` | Nom accessible du bouton « … ». Le nombre de niveaux masqués y est ajouté entre parenthèses. |
| `id` | `string` | — | Identifiant facultatif de la liste. |

`DsaasfrBreadcrumbItem` :

| Nom | Type | Description |
|---|---|---|
| `text` | `string` | Libellé visible. Les libellés longs sont tronqués visuellement. |
| `to` | `RouteLocationRaw` | Destination. À omettre sur le dernier niveau (page courante). Un niveau parent sans destination s’affiche en texte simple. |

### Emplacements (slots)

| Nom | Description |
|---|---|
| `actions` | Action principale de la page, à droite. Un seul bouton primaire, taille `sm`. |

## Accessibilité

- Balisage officiel du fil d’Ariane DSFR (`fr-breadcrumb`) : région de navigation nommée
  « vous êtes ici : », `aria-current="page"` sur le dernier niveau uniquement.
- Le bouton « … » est un vrai `<button>`, nommé « Afficher tous les niveaux du fil d’Ariane
  (2) ». Il disparaît à l’activation et le focus passe au premier niveau révélé.
- Au clavier, un lien tronqué qui reçoit le focus affiche son texte complet sur place (le fil
  passe à la ligne) : les infobulles ne sont accessibles ni au clavier ni au toucher.
- La page courante ne reçoit pas le focus et peut être tronquée : **chaque page doit afficher
  son titre complet dans un `<h1>`**.
- L’action principale est en dehors de la navigation, après le fil dans l’ordre de lecture.
- Le DSFR masque le fil derrière un bouton sous 48em ; ici, il reste visible et passe à la
  ligne, pour que chaque niveau reste lisible à fort zoom.
- Le bouton « … » est petit : conforme au WCAG 2.1 AA, mais en dessous de la taille de cible
  minimale du WCAG 2.2 (2.5.8).

## Voir aussi

- [Fiche de décision 0006](/decisions/0006-breadcrumb-bar)
- [useRouteBreadcrumb](/composants/use-route-breadcrumb)
- [DsaasfrAppShell](/composants/app-shell), [DsaasfrToolbar](/composants/toolbar)
