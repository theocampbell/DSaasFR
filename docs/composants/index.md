# Vue d’ensemble des composants

DSaaSFR fournit la structure d’une application métier. Le contenu des pages (tableaux,
formulaires, boutons, modales) reste fait avec les composants de Vue DSFR.

## Shell

Les composants de la mise en page, à utiliser ensemble.

| Composant | Rôle |
|---|---|
| [DsaasfrAppShell](/composants/app-shell) | Mise en page de l’application : régions, défilement, liens d’évitement, panneau d’aperçu. |
| [DsaasfrSidebar](/composants/sidebar) | Barre latérale avec le bloc-marque, le nom du service et la navigation principale. Remplace l’en-tête DSFR. |
| [DsaasfrUserMenu](/composants/user-menu) | La personne connectée et ses actions de compte, en bas de la barre latérale. |
| [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar) | Première ligne : fil d’Ariane construit à partir des routes et action principale de la page. |
| [DsaasfrToolbar](/composants/toolbar) | Seconde ligne : nombre de résultats, filtres actifs et outils de la liste. |
| [DsaasfrPreviewPanel](/composants/preview-panel) | Contenu du panneau d’aperçu : titre, bouton « Fermer », actions, corps qui défile. |

## Briques

Des composants plus petits, utilisés par le shell et par vos pages.

| Composant | Rôle |
|---|---|
| [DsaasfrDropdown](/composants/dropdown) | Un bouton qui ouvre un panneau flottant (déclencheur « Filtrer », menus). |
| [DsaasfrFilterChip](/composants/filter-chip) | Un filtre actif, sous la forme « champ · condition · valeurs · × ». |

## Composables

| Composable | Rôle |
|---|---|
| [useRouteBreadcrumb](/composants/use-route-breadcrumb) | Construit les niveaux du fil d’Ariane à partir de l’URL et des titres de route. |
| [usePreviewQuery](/composants/use-preview-query) | Garde l’élément affiché dans l’aperçu dans l’URL (`?apercu=…`). |

## Les régions de la mise en page

Sur grand écran (62em et plus), la page défile ; la barre latérale, les deux lignes du haut et
le panneau d’aperçu restent fixés.

```
┌──────────────────┬───────────────────────────────────────┬─────────────────────┐
│ DsaasfrSidebar   │ #breadcrumb  DsaasfrBreadcrumbBar     │ #preview            │
│  bloc-marque     │              fil d’Ariane │ action    │ DsaasfrPreviewPanel │
│  nom du service  ├───────────────────────────────────────┤  (facultatif)       │
│──────────────────│ #toolbar     DsaasfrToolbar           │                     │
│  navigation      │              start         │ end      │  titre    [Fermer]  │
│  principale      ├───────────────────────────────────────┤                     │
│                  │ contenu de la page (slot par défaut)  │  corps              │
│──────────────────│  <h1> … tableaux, formulaires…        │                     │
│ #footer          │                                       │                     │
│  DsaasfrUserMenu │                                       │                     │
└──────────────────┴───────────────────────────────────────┴─────────────────────┘
  <header> + <nav>   <main> (fil d’Ariane et barre d’outils inclus)   <aside>
```

Sous 62em (fenêtre étroite, zoom fort), la barre latérale devient l’en-tête mobile du DSFR,
les zones s’empilent et l’aperçu passe en plein écran.

## Installation

```bash
npm install @gouvminint/vue-dsfr @gouvfr/dsfr vue-router @dsaasfr/vue
```

```ts
// main.ts
import DSaaSFR from '@dsaasfr/vue'
import '@dsaasfr/vue/styles'

createApp(App).use(router).use(VueDsfr).use(DSaaSFR).mount('#app')
```

La liste complète des imports CSS (DSFR, thème sombre, Vue DSFR) est dans
[Pour commencer](/guide/pour-commencer).

::: info Statut
Tous les composants sont au stade de brouillon. Leur API peut encore changer ; les
changements sont signalés dans le
[journal des modifications](https://github.com/theocampbell/DSaasFR/blob/develop/CHANGELOG.md).
:::
