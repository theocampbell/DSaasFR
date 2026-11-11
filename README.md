# DSaaSFR

> **Projet expérimental, non officiel** — composants Vue 3 orientés application (SaaS,
> back-office) construits **sur** [Vue DSFR](https://vue-ds.fr) et le
> [Système de Design de l'État](https://www.systeme-de-design.gouv.fr).
> Ce n'est pas un produit officiel du DSFR.

DSaaSFR ne remplace pas Vue DSFR : il ajoute les patterns d'application qui manquent
(shell applicatif, navigation latérale, barre d'actions, panneau d'aperçu…), en respectant
strictement les couleurs, la typographie, les espacements et l'accessibilité du DSFR.

## Documentation

- [Documentation](https://theocampbell.github.io/DSaasFR/) · [Storybook](https://theocampbell.github.io/DSaasFR/storybook/)
- [Bac à sable](https://theocampbell.github.io/DSaasFR/playground/) : une fausse application de back-office
- [Fiches de décision](docs/decisions) · [Guide du contributeur](CONTRIBUTING.md) · [Journal des modifications](CHANGELOG.md)

## Installation

```bash
npm install @gouvminint/vue-dsfr @gouvfr/dsfr vue-router @dsaasfr/vue
```

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

createApp(App).use(VueDsfr).use(DSaaSFR).mount('#app')
```

Ou importer les composants un par un :

```ts
import { DsaasfrAppShell } from '@dsaasfr/vue'
```

## Utilisation

```vue
<DsaasfrAppShell v-model:preview-open="preview">
  <template #sidebar>
    <!-- bloc-marque + service name + navigation: replaces the DSFR header -->
    <DsaasfrSidebar service-title="Mon service" :items="items" />
  </template>
  <template #breadcrumb><DsfrBreadcrumb :links="links" /></template>
  <template #toolbar><DsfrButton label="Nouveau" size="sm" /></template>

  <h1 class="fr-h3">Dossiers</h1>

  <template #preview="{ closePreview }">…</template>
</DsaasfrAppShell>
```

## Composants

| Composant | Statut |
|---|---|
| `DsaasfrAppShell` | Brouillon — voir la [fiche de décision 0002](docs/decisions/0002-app-shell-layout.md) |
| `DsaasfrSidebar` | Brouillon — voir la [fiche de décision 0003](docs/decisions/0003-brand-in-sidebar.md) |
| `DsaasfrUserMenu` | Brouillon — voir la [fiche de décision 0005](docs/decisions/0005-user-menu.md) |
| `DsaasfrBreadcrumbBar` | Brouillon — voir la [fiche de décision 0006](docs/decisions/0006-breadcrumb-bar.md) |
| `DsaasfrToolbar` | Brouillon — voir la [fiche de décision 0007](docs/decisions/0007-toolbar.md) |
| `DsaasfrPreviewPanel` | Brouillon — voir la [fiche de décision 0008](docs/decisions/0008-preview-panel.md) |
| `DsaasfrDropdown`, `DsaasfrFilterDropdown`, `DsaasfrSelectedFilters` | Brouillon — voir la [fiche de décision 0009](docs/decisions/0009-filters.md) |
| `DsaasfrFilterModal` | Brouillon — voir la [fiche de décision 0010](docs/decisions/0010-long-lists.md) |
| `DsaasfrSearchableCheckboxSet` | Brouillon — voir la [fiche de décision 0010](docs/decisions/0010-long-lists.md) |
| `DsaasfrContextSwitcher` | Brouillon — voir la [fiche de décision 0011](docs/decisions/0011-context-switcher.md) |

## Principes

- Étendre Vue DSFR, jamais le remplacer ([fiche de décision 0001](docs/decisions/0001-build-on-vue-dsfr.md)).
- Uniquement les variables CSS du DSFR pour les couleurs, l'échelle du DSFR pour les
  espacements, les classes du DSFR pour la typographie (vérifié par Stylelint).
- RGAA 4.1 / WCAG 2.1 AA, patterns WAI-ARIA APG, axe dans chaque test.
- Conçu d'abord pour le poste de travail, mais utilisable avec un zoom à 400 % (RGAA 10.11) :
  sous 62em, la barre latérale devient l'en-tête mobile du DSFR
  ([fiche de décision 0004](docs/decisions/0004-narrow-screens.md)).
- Chaque interprétation du DSFR est consignée dans [`docs/decisions`](docs/decisions).

## Développement

Prérequis : Node 22+ et pnpm (`corepack enable` installe la version de pnpm fixée dans le projet).

```bash
git clone https://github.com/theocampbell/DSaasFR.git
cd DSaasFR
git checkout claude/dsaasfr-component-library-vthch4
corepack enable
pnpm install

pnpm storybook    # http://localhost:6006 — every component and state, light/dark toggle
pnpm dev          # http://localhost:5173 — playground: a fake back-office to click around
pnpm check        # lint + typecheck + test + build
```

Astuce : pour voir la mise en page sur écran étroit / fort zoom, zoomez le navigateur à 400 %
ou réduisez la largeur de la fenêtre sous ~990px.

## Bac à sable

`.github/workflows/deploy-sandbox.yml` publie Storybook (`/`) et le playground
(`/playground/`) sur GitHub Pages à chaque push. Configuration à faire une seule fois :
Settings du dépôt → Pages → Source : **GitHub Actions**.

Ce dépôt est conçu pour être développé avec Claude Code : voir [CLAUDE.md](CLAUDE.md) et les
agents spécialisés dans [.claude/agents](.claude/agents).

## Publication

Le paquet est publié sur npm sous le nom `@dsaasfr/vue`, automatiquement :

1. le travail est fusionné dans `develop` (commits conventionnels : `feat:`, `fix:`…) ;
2. pour publier, ouvrez une PR `develop → main` et fusionnez-la avec **« Create a merge
   commit »** (pas « Squash and merge ») ;
3. le workflow `release.yml` calcule la version à partir des commits, publie sur npm (avec
   provenance, via le *trusted publisher* npm), crée le tag et la release GitHub avec les
   notes de version.

Dans le dépôt, `package.json` reste en version `0.0.0-development` : la vraie version est
fixée au moment de la publication. Avec la publication échelonnée de npm, approuvez la
version dans l'onglet *Staged Packages*.
