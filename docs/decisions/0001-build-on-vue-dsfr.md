# 0001 — Build on Vue DSFR, extend rather than replace

- **Status**: Proposed
- **Date**: 2026-11-01
- **Components**: all

## DSFR starting point

Government Vue apps already use `@gouvminint/vue-dsfr`, which wraps `@gouvfr/dsfr`
(CSS, tokens, fonts, icons) in `Dsfr*` components.

## SaaS need

Teams building back-offices and SaaS-like tools need application patterns (app shell,
sidebar navigation, toolbars, preview panel, data views) that the DSFR does not provide,
and they hesitate to interpret the DSFR on their own.

## Decision

- `@gouvminint/vue-dsfr` and `vue` are **peer dependencies**; DSaaSFR never re-implements
  a component Vue DSFR already ships.
- Same consumption model as Vue DSFR: `app.use(DSaaSFR)` or per-component imports,
  `import 'dsaasfr/styles'`.
- Same conventions: `Dsfs` prefix, props + `v-model` + slots, TypeScript types.
- Styling uses DSFR CSS variables only (colours, themes) and the DSFR spacing scale,
  enforced by Stylelint.

## Accessibility consequences

Inherits Vue DSFR / DSFR accessibility for composed components; every new pattern
follows WAI-ARIA APG and is tested with axe.
