# 0003 — Bloc-marque en haut de la barre latérale, sans en-tête DSFR

- **Statut** : Proposé
- **Date** : 2026-11-01
- **Composants** : DsaasfrSidebar, DsaasfrAppShell

## Point de départ DSFR

- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete) :
  le bloc-marque (Marianne, « République Française », devise) est obligatoire et l'en-tête
  fait du nom du service un lien vers la page d'accueil (`title="Accueil - [service] - République Française"`).
- [Bloc-marque](https://www.systeme-de-design.gouv.fr/fondamentaux/identite-de-l-etat) :
  il ne doit être ni rogné, ni déformé, ni recoloré.
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral).

## Besoin SaaS

L'en-tête DSFR (~117px, contenu centré dans `fr-container`) occupe de la hauteur sur
chaque écran et ne s'aligne pas avec une mise en page d'application en pleine largeur.
Les applications visées ici sont des outils utilisés toute la journée par des agents
publics, et non des sites web destinés au public. D'autres applications de l'État placent
déjà le bloc-marque en haut d'une barre latérale.

## Options envisagées

1. Conserver `DsfrHeader` au-dessus du shell (pattern DSFR actuel) : gaspille de la hauteur,
   mal aligné avec la barre latérale.
2. En-tête compact en pleine largeur : reste une ligne entière d'habillage.
3. **Bloc-marque + nom du service en haut de la barre latérale** (retenu).

## Décision

- Le bloc supérieur de la barre latérale est un `<header>` (région banner) qui contient le
  bloc-marque officiel rendu par le `DsfrLogo` de Vue DSFR (variante small, non modifiée)
  ainsi que le nom du service et une baseline facultative.
- Le nom du service est un lien vers l'accueil suivant la convention `title` du DSFR ; le
  bloc entier est cliquable grâce à `fr-enlarge-link`, comme la marque de l'en-tête DSFR.
- En dessous : la navigation principale (`<nav aria-label="Navigation principale">`),
  rendue avec le `DsfrSideMenuList` de Vue DSFR. Les groupes assurent la **navigation
  secondaire** et s'ouvrent automatiquement lorsqu'ils contiennent la route courante.
- En bas : un slot de pied pour le compte, les réglages et les paramètres d'affichage.
- Le shell n'exige plus d'en-tête ; le slot `header` reste facultatif.

### Adaptations du DSFR (mise en page uniquement)

- `nav.fr-sidemenu` est utilisé directement comme navigation d'application, sans
  `fr-sidemenu__inner` ni le bouton de bascule mobile ; seules les marges prévues pour un
  usage dans la page et les bordures intérieures mobiles sont réinitialisées. Les styles
  des éléments (barre d'élément actif, groupes, indentation) sont ceux du DSFR.
- `DsfrLogo small` (`fr-logo--sm`, la taille de l'en-tête mobile) car la barre latérale
  fait 16rem de large.
- Le titre du service et la baseline utilisent `fr-text--lg fr-text--bold` / `fr-text--sm`,
  qui correspondent aux tailles de `fr-header__service-title` / `-tagline` dans l'en-tête
  mobile (le CSS de l'en-tête est limité à `.fr-header`).
- Le bloc de marque reproduit `.fr-header__brand.fr-enlarge-link` : même retour visuel
  `--idle/--hover/--active` et anneau de focus ramené à l'intérieur (`outline-offset: -2px`)
  pour que la barre latérale, qui défile, ne le rogne pas.
- Un contenu personnalisé dans le slot `brand` doit contenir exactement un lien (le bloc
  est un `fr-enlarge-link`).
- Les liens d'évitement utilisent le `DsfrSkipLinks` de Vue DSFR.
- **Le repli de la barre latérale n'est pas proposé** (voir 0004) : un rail replié
  rognerait le bloc-marque.

## Conséquences pour l'accessibilité

- Régions : banner (en-tête de la barre latérale), navigation, main, complementary (aperçu).
  Une seule région banner par page : les applications ne doivent pas afficher en plus
  `DsfrHeader`.
- Page active : `aria-current="page"` déduit de la route (correspondance par préfixe pour
  les pages imbriquées), sur un seul lien. Les groupes reçoivent `aria-expanded` +
  `aria-controls` mais ne sont jamais marqués `active`, car Vue DSFR ajouterait alors
  `aria-current="page"` au bouton du groupe (deux « pages courantes »). À signaler en
  amont : le balisage DSFR utilise `"true"` à cet endroit.
- Le pied est une région nommée (« Mon espace »).
- La baseline du service utilise la couleur de texte par défaut : `--text-mention-grey`
  n'atteint pas le contraste requis (4,0:1) sur le fond de survol du thème sombre.
- Le lien d'évitement « Menu » cible la barre latérale.

## Questions ouvertes

1. ~~Barre latérale repliée~~ → rejeté, voir [0004](0004-narrow-screens.md).
2. ~~Mobile~~ → pattern d'en-tête mobile du DSFR sous 62em, voir [0004](0004-narrow-screens.md).
3. Où placer les « Paramètres d'affichage » (choix du thème) et le pied de page DSFR ?
   Proposition : le pied de la barre latérale pour les premiers ; le pied de page est
   souvent omis dans les back-offices — à valider.
4. Cet usage du bloc-marque est-il acceptable pour l'équipe DSFR ?
