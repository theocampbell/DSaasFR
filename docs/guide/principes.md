# Principes

DSaaSFR suit cinq règles. Elles s’appliquent à chaque composant et sont vérifiées en revue
et, quand c’est possible, par l’outillage.

## 1. Réutiliser Vue DSFR

DSaaSFR ne réimplémente jamais ce que Vue DSFR fournit déjà. Les composants composent les
composants `Dsfr*` (`DsfrLogo`, `DsfrSideMenuList`, `DsfrHeader`, `DsfrSkipLinks`…) ou
reprennent le balisage officiel `fr-*` du DSFR quand Vue DSFR ne permet pas l’usage voulu
(par exemple le fil d’Ariane, qui doit accueillir un bouton « … »).

Vue DSFR et Vue sont des dépendances pair : votre application garde la main sur leurs
versions. Voir la [fiche de décision 0001](/decisions/0001-build-on-vue-dsfr).

## 2. Uniquement les jetons du DSFR

- **Couleurs** : uniquement les variables CSS du DSFR (`var(--background-default-grey)`,
  `var(--text-action-high-blue-france)`, `var(--border-default-grey)`…). Aucune valeur
  hexadécimale, `rgb()` ou nommée. Les thèmes clair et sombre fonctionnent donc sans code
  supplémentaire.
- **Espacements** : l’échelle du DSFR (1v = 0,25rem, 1w = 0,5rem), via les variables
  `--dsaasfr-space-*` ou les classes utilitaires (`fr-p-2w`, `fr-mb-1v`…).
- **Typographie** : les classes du DSFR (`fr-h3`, `fr-text--sm`…). Les composants ne
  définissent jamais de taille ni de famille de police. Marianne uniquement.
- Les rares dimensions propres à DSaaSFR (largeur de la barre latérale, du panneau d’aperçu…)
  sont déclarées dans un seul fichier, `src/styles/tokens.css`.

Stylelint fait respecter ces règles ; elles ne sont jamais désactivées pour faire passer la
vérification.

## 3. L’accessibilité est une fonctionnalité

L’objectif est le **RGAA 4.1** (WCAG 2.1 niveau AA). Chaque composant :

- s’utilise entièrement au clavier ;
- garde l’anneau de focus du DSFR visible ;
- expose les bonnes régions, rôles et noms accessibles ;
- respecte `prefers-reduced-motion` ;
- passe axe dans ses tests.

Les éléments natifs passent en premier (`button`, `nav`, `aside`, `fieldset`), puis les
motifs du WAI-ARIA APG. Certains choix vont contre l’intuition et sont expliqués : la barre
d’outils n’a pas de `role="toolbar"`, le menu utilisateur n’a pas de `role="menu"`.

Le contraste des couleurs n’est pas évaluable dans les tests automatisés (jsdom). Il est
vérifié dans Storybook avec le module d’accessibilité.

### Pensé pour le poste de travail, utilisable à 400 % de zoom

Les applications visées sont utilisées toute la journée sur poste de travail. Aucune
expérience téléphone n’est conçue. En revanche, le RGAA 10.11 (redistribution du contenu)
exige que l’application reste utilisable à **320 px CSS de large sans défilement
horizontal**, ce qui correspond à un écran de 1280 px zoomé à 400 %.

Sous 62em (le point de rupture `lg` du DSFR) :

- la barre latérale devient l’en-tête mobile du DSFR, avec un bouton « Menu » ;
- plus rien n’est fixé à l’écran, pour laisser la place au contenu ;
- le panneau d’aperçu passe en plein écran et le reste de la page devient inerte ;
- les libellés passent à la ligne au lieu d’être coupés.

Voir la [fiche de décision 0004](/decisions/0004-narrow-screens). Pour tester, zoomez votre
navigateur à 400 % ou réduisez la fenêtre sous environ 990 px.

## 4. Les interprétations sont documentées

Le DSFR est conçu d’abord pour les sites publics. Quand une application métier a besoin d’un
motif qu’il ne prévoit pas, ou d’une adaptation, DSaaSFR l’écrit dans une
[fiche de décision](/decisions/) : le point de départ DSFR, le besoin, les options
envisagées, le choix fait et ses conséquences pour l’accessibilité.

Les fiches restent au statut **« Proposé »**. Seul le responsable produit les accepte, après
discussion. Elles servent aussi à la communauté DSFR pour juger si une interprétation est
légitime.

## 5. Des textes en français, modifiables

Tous les textes visibles et les noms accessibles sont en français par défaut (« Fermer »,
« Navigation principale », « vous êtes ici : »…). Chacun peut être remplacé par une prop,
pour adapter le vocabulaire à votre service.

## Développement assisté par IA

DSaaSFR est développé avec l’aide de Claude Code. Les commits concernés le mentionnent.

Des agents spécialisés relisent chaque composant : conformité au DSFR, accessibilité,
couverture des tests, documentation. Leurs consignes sont publiques dans le dépôt
(`CLAUDE.md` et `.claude/agents/`).

Ces relectures automatiques ne remplacent pas une relecture humaine. Le responsable produit
relit les fiches de décision et le rendu dans Storybook, et les retours de la communauté
DSFR et des utilisateurs restent la référence.
