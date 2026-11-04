# 0006 — Barre de fil d'Ariane : fil d'Ariane piloté par le routeur + action principale

- **Statut** : Proposé
- **Date** : 2026-11-02
- **Composants** : DsaasfrBreadcrumbBar, `useRouteBreadcrumb`

## Point de départ DSFR

- [Fil d'Ariane](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/fil-d-ariane) :
  `nav.fr-breadcrumb > ol.fr-breadcrumb__list > li > a.fr-breadcrumb__link`, page courante
  en dernier avec `aria-current="page"`, intitulé « vous êtes ici : ». En mobile, tout le
  fil est masqué derrière un bouton « Voir le fil d'Ariane ». Placé au-dessus du titre de
  la page, avec les marges de page.
- Le `DsfrBreadcrumb` de Vue DSFR n'accepte qu'un tableau `links` : aucun slot pour un
  bouton de repli ni pour des actions.

## Besoin SaaS

Les pages d'application ont 3 à 5 niveaux de profondeur (liste → dossier → pièces →
pièce). La ligne au-dessus du contenu dispose d'espace horizontal libre ; les utilisateurs
s'attendent à trouver l'action principale de la page (par ex. « Nouveau dossier ») en haut
à droite, comme dans la plupart des outils SaaS. Les équipes ne devraient pas avoir à
câbler le fil d'Ariane à la main sur chaque page.

## Décision

- **Balisage et classes officiels du fil d'Ariane DSFR**, rendus par
  `DsaasfrBreadcrumbBar` (et non `DsfrBreadcrumb`, qui ne peut pas accueillir le bouton
  « … »). Surcharges de mise en page uniquement : pas de marges de page, une ligne, flex.
- **À droite : slot `actions`** pour l'action ou les actions principales de la page, en
  dehors du `nav`.
- **Piloté par le routeur** : `useRouteBreadcrumb()` résout chaque préfixe de chemin (`/`,
  `/dossiers`, `/dossiers/2041`) et lit `meta.breadcrumb` (ou `meta.title`) de la route
  correspondante : une chaîne ou une fonction de la route ; `false` masque un niveau.
  Fonctionne avec des routes à plat ou imbriquées. Une prop `items` le remplace. Le même
  fil fournit le `<h1>` de la page.
- **Fils longs** : au-delà de `maxItems` niveaux (4 par défaut), les niveaux intermédiaires
  se replient dans un bouton « … » (premier niveau, « … », derniers niveaux conservés). Il
  révèle le fil complet ; une nouvelle page repart repliée.
- **Libellés longs** (mesurés dans le navigateur, après revue) : les ancêtres ne rétrécissent
  jamais (plafonnés à 16rem) ; seule la page courante rétrécit, jusqu'à 10rem. Si le fil ne
  tient toujours pas sur une ligne — fenêtre étroite, zoom du texte à 200 % — il **passe à
  la ligne**, et le texte de la page courante passe aussi à la ligne, de sorte qu'aucun
  niveau n'est jamais réduit à un fragment. Les libellés réellement tronqués reçoivent une
  infobulle (sur le `li`, car le DSFR applique `pointer-events: none` à la page courante).
  Les infobulles ne sont accessibles ni au clavier ni au tactile : un lien **ayant le
  focus** dont le libellé est tronqué fait donc passer son texte à la ligne sur place (et le
  fil passe à la ligne) au lieu de s'élargir hors de l'écran ; les libellés qui tiennent
  ne bougent pas. La page courante ne peut pas recevoir le focus : son texte complet doit
  être le `<h1>` de la page (**obligatoire** pour les applications qui utilisent la barre).
- Les ancêtres sans destination s'affichent en texte simple (gris mention du fil d'Ariane,
  sans soulignement, `fr-text--xs` comme les liens) — un état que le DSFR ne définit pas ;
  seul le dernier niveau reçoit `aria-current="page"` (les liens utilisent un RouterLink
  `custom` pour que vue-router n'ajoute pas son propre `aria-current`).
- **Écrans étroits / fort zoom** : le DSFR masque le fil derrière « Voir le fil d'Ariane »
  sous 48em ; nous le gardons visible et passant à la ligne sous 62em, pour que chaque
  niveau reste lisible.
- **Action principale** : un seul bouton primaire par vue, taille `sm` dans les barres du
  shell (la barre d'outils utilise des boutons secondaires / tertiaires).

## Conséquences pour l'accessibilité

- Même région et mêmes intitulés que le fil d'Ariane DSFR (`nav` « vous êtes ici : »,
  `aria-current`).
- « … » est un vrai `<button>` (stylé avec `fr-breadcrumb__link` ; `fr-breadcrumb__button`
  est masqué à partir de md) : nom « Afficher tous les niveaux du fil d'Ariane (n) ». Pas
  d'`aria-expanded` : il disparaît à l'activation, et le focus passe au premier niveau
  révélé, de sorte que le focus n'est jamais perdu. Sa cible est petite : conforme au WCAG
  2.1 AA, mais sous le minimum de taille de cible du WCAG 2.2 (2.5.8).
- Pas d'id sur la liste sauf si l'application en fournit un (rien n'y fait référence),
  donc pas d'identifiants dupliqués.
- L'action principale est en dehors de la région de navigation, après le fil dans l'ordre
  de lecture.

## Questions ouvertes

1. Une page doit-elle pouvoir placer plus d'une action à droite, ou une action primaire
   plus un menu de débordement (à concevoir avec la ligne de la barre d'outils) ?
2. `document.title` (onglet du navigateur, RGAA 8.6) et une annonce de changement de page
   pour les lecteurs d'écran devraient provenir des mêmes titres de route — signalé par la
   revue d'accessibilité, prochain élément de TODO.md.
