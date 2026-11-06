# 0002 — Mise en page du shell applicatif

- **Statut** : Proposé (brouillon — en attente des choix de conception du responsable produit)
- **Date** : 2026-11-01
- **Composants** : DsaasfrAppShell (+ futurs DsaasfrSidebar, DsaasfrToolbar, DsaasfrPreviewPanel)

## Point de départ DSFR

- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete) :
  bloc-marque obligatoire, conçu pour les sites web (haut, centré dans `fr-container`).
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral) :
  navigation latérale au sein d'une page, et non navigation principale à l'échelle de
  l'application.
- [Fil d'Ariane](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/fil-d-ariane).
- [Liens d'évitement](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/liens-d-evitement).

## Besoin SaaS

Les utilisateurs de back-office passent des heures dans l'outil. Aujourd'hui, les pages
DSFR empilent tout verticalement dans un conteneur centré, ce qui gaspille la largeur sur
les grands écrans. Les utilisateurs ont besoin : d'une navigation principale persistante,
de savoir où ils se trouvent, d'actions et de filtres contextuels proches du contenu, et
de pouvoir afficher l'aperçu d'un document ou d'un élément sans quitter la liste.

## Mise en page provisoire

```
┌─────────────┬────────────────────────────────────────┬──────────────┐
│ bloc-marque │ breadcrumb row                         │ preview      │
│ service     │ toolbar row: actions / filters         │ panel        │
│─────────────│ main content (full width, no container)│ (optional)   │
│ primary nav │ the page scrolls; sidebar, both rows  │              │
│             │ and preview are pinned (sticky)        │              │
│ footer      │                                        │              │
└─────────────┴────────────────────────────────────────┴──────────────┘
```

L'en-tête DSFR est remplacé par le bloc de marque de la barre latérale : voir
[0003](0003-brand-in-sidebar.md).

- **Ligne du fil d'Ariane** = emplacement (DsfrBreadcrumb, marges supprimées).
- **Ligne de la barre d'outils** = actions et filtres au niveau de la page (inspiré de Linear).
- **Panneau d'aperçu** = `aside` facultatif, ouvert par l'application (`v-model:preview-open`).
- Sous le point de rupture `lg` du DSFR (62em, c'est-à-dire en cas de fort zoom), la barre
  latérale devient l'en-tête mobile du DSFR et les autres zones s'empilent : voir
  [0004](0004-narrow-screens.md).

## Défilement

C'est la **page** qui défile ; la barre latérale, les lignes du fil d'Ariane et de la barre
d'outils ainsi que le panneau d'aperçu sont fixés avec `position: sticky`. Une version
antérieure faisait défiler une boîte `<main>` interne : même rendu, mais les utilisateurs
du clavier ne pouvaient pas faire défiler les pages composées uniquement de texte sans
d'abord donner le focus à la boîte (axe `scrollable-region-focusable`, WCAG 2.1.1), et la
réinitialisation du défilement par le routeur ne s'appliquait pas. Avec le défilement de
la page, Page suivante / Espace, la recherche dans la page et la restauration du
défilement fonctionnent nativement. La hauteur des lignes fixées est reportée dans
`scroll-padding-top` afin que les éléments ayant le focus ne soient jamais masqués
dessous (WCAG 2.4.11). Sous 62em (fort zoom), rien n'est fixé, pour laisser le peu
d'espace disponible au contenu.

## Conséquences pour l'accessibilité

- Régions : `header` (fourni par DsfrHeader), `nav` « Navigation principale », `nav` du
  fil d'Ariane, `main` (cible du lien d'évitement), `aside` « Aperçu ».
- Liens d'évitement : « Contenu » et « Menu ».
- Aperçu : le bouton de bascule reçoit `aria-controls` + `aria-expanded` via la prop de
  slot `previewToggleAttrs` ; lorsque l'utilisateur ouvre le panneau, le focus va sur son
  titre (voir [0008](0008-preview-panel.md)) et revient au bouton de bascule lorsque le
  panneau est fermé depuis l'intérieur (RGAA 12.8).
- À décider : si la barre d'outils est un
  simple groupe ou une barre d'outils APG (navigation aux flèches) ; l'étiquetage de la
  barre latérale repliée.

## Questions ouvertes

1. ~~Hauteur de l'en-tête~~ → résolu par 0003 (pas d'en-tête).
2. Navigation secondaire : second niveau dans la barre latérale, onglets dans la ligne de
   la barre d'outils, ou les deux ?
3. Panneau d'aperçu : largeur fixe, redimensionnable, ou extensible en pleine largeur ?
4. ~~Mobile~~ → voir 0004. Le panneau d'aperçu sur écran étroit reste une question ouverte.
