# DSaaSFR

> **POC / proposition communautaire** — composants Vue 3 orientés application (SaaS,
> back-office) construits **sur** [Vue DSFR](https://vue-ds.fr) et le
> [Système de Design de l'État](https://www.systeme-de-design.gouv.fr).
> Ce n'est pas un produit officiel du DSFR.

DSaaSFR ne remplace pas Vue DSFR : il ajoute les patterns d'application qui manquent
(shell applicatif, navigation latérale, barre d'actions, panneau d'aperçu…), en respectant
strictement les couleurs, la typographie, les espacements et l'accessibilité du DSFR.

## Installation

```bash
npm install @gouvminint/vue-dsfr dsaasfr
```

```ts
// main.ts
import { createApp } from 'vue'
import VueDsfr from '@gouvminint/vue-dsfr'
import DSaaSFR from 'dsaasfr'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import 'dsaasfr/styles'

import App from './App.vue'

createApp(App).use(VueDsfr).use(DSaaSFR).mount('#app')
```

Or import components individually:

```ts
import { DsfsAppShell } from 'dsaasfr'
```

## Usage

```vue
<DsfsAppShell v-model:preview-open="preview">
  <template #header><DsfrHeader service-title="Mon service" /></template>
  <template #sidebar><!-- primary navigation --></template>
  <template #breadcrumb><DsfrBreadcrumb :links="links" /></template>
  <template #toolbar><DsfrButton label="Nouveau" size="sm" /></template>

  <h1 class="fr-h3">Dossiers</h1>

  <template #preview="{ close }">…</template>
</DsfsAppShell>
```

## Components

| Component | Status |
|---|---|
| `DsfsAppShell` | Draft — see [decision 0002](docs/decisions/0002-app-shell-layout.md) |

## Principles

- Extend Vue DSFR, never replace it ([decision 0001](docs/decisions/0001-build-on-vue-dsfr.md)).
- DSFR CSS variables only for colours, DSFR scale for spacing, DSFR classes for type
  (enforced by Stylelint).
- RGAA 4.1 / WCAG 2.1 AA, WAI-ARIA APG patterns, axe in every test.
- Every interpretation of the DSFR is written down in [`docs/decisions`](docs/decisions).

## Development

```bash
pnpm install
pnpm dev          # playground app
pnpm storybook    # documentation
pnpm check        # lint + typecheck + test + build
```

This repo is set up to be developed with Claude Code: see [CLAUDE.md](CLAUDE.md) and the
specialised agents in [.claude/agents](.claude/agents).
