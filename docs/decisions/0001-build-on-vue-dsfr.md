# 0001 — S'appuyer sur Vue DSFR : étendre plutôt que remplacer

- **Statut** : Proposé
- **Date** : 2026-11-01
- **Composants** : tous

## Point de départ DSFR

Les applications Vue de l'État utilisent déjà `@gouvminint/vue-dsfr`, qui encapsule
`@gouvfr/dsfr` (CSS, jetons, polices, icônes) dans des composants `Dsfr*`.

## Besoin SaaS

Les équipes qui développent des back-offices et des outils de type SaaS ont besoin de
patterns d'application (shell applicatif, navigation en barre latérale, barres d'outils,
panneau d'aperçu, vues de données) que le DSFR ne fournit pas, et elles hésitent à
interpréter le DSFR par elles-mêmes.

## Décision

- `@gouvminint/vue-dsfr` et `vue` sont des **dépendances pair** (peer dependencies) ;
  DSaaSFR ne réimplémente jamais un composant déjà fourni par Vue DSFR.
- Même mode d'utilisation que Vue DSFR : `app.use(DSaaSFR)` ou import composant par
  composant, `import 'dsaasfr/styles'`.
- Mêmes conventions : préfixe `Dsaasfr`, props + `v-model` + slots, types TypeScript.
- Les styles n'utilisent que les variables CSS du DSFR (couleurs, thèmes) et l'échelle
  d'espacement du DSFR, ce que vérifie Stylelint.

## Conséquences pour l'accessibilité

Les composants composés héritent de l'accessibilité de Vue DSFR / du DSFR ; chaque
nouveau pattern suit le WAI-ARIA APG et est testé avec axe.
