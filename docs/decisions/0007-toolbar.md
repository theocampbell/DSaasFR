# 0007 — Barre d'outils : seconde ligne générique avec slots start / end

- **Statut** : Proposé
- **Date** : 2026-11-03
- **Composants** : DsaasfrToolbar

## Point de départ DSFR

Aucun composant de barre d'outils dans le DSFR. Le DSFR propose des boutons et des groupes
de boutons (`fr-btns-group`), des tags, des contrôles segmentés, mais aucune ligne qui les
combine au-dessus d'une liste.

## Besoin SaaS

Les pages de liste ont besoin d'une ligne pour le contexte (nombre de résultats, filtres
actifs, choix de vue) et pour les outils (filtrer, exporter, options d'affichage). Son
contenu varie selon l'application : une équipe met des étiquettes de filtre à gauche et un
déclencheur « Filtrer » à droite, une autre met des onglets de vue ou des actions groupées.
Ce n'est pas à la bibliothèque d'en décider.

## Décision

- `DsaasfrToolbar` : deux slots, `start` (à gauche) et `end` (à droite). Le composant ne
  gère que la mise en page — espacement (échelle DSFR), alignement, passage à la ligne. Il
  ne sait rien des filtres ; les composants de filtre (étiquettes, menu déroulant) sont
  séparés et se placent dans ces slots.
- Les éléments gardent leur largeur naturelle et passent à la ligne d'un bloc (jamais
  compressés au point de couper les libellés), `end` reste aligné à droite et, sur écran
  étroit, `end` passe sous `start`.
- Mise en page flex propre plutôt que `fr-btns-group` / `DsfrButtonGroup` : ceux-ci ne
  disposent que des boutons ; la barre d'outils contient des contenus variés (texte,
  étiquettes de filtre, déclencheurs, menus).
- Même pattern que la barre de fil d'Ariane (0006) : contenu à gauche, actions à droite.
  Le seul bouton primaire de la vue se trouve dans la barre de fil d'Ariane ; la barre
  d'outils utilise des boutons secondaires / tertiaires.

## Conséquences pour l'accessibilité

- **Pas de `role="toolbar"`** : le pattern ARIA toolbar implique un seul arrêt de
  tabulation et une navigation aux flèches, ce qui convient aux rangées de boutons à
  icône, pas aux contenus variés (étiquettes de filtre comportant chacune plusieurs
  boutons, menus, texte). Chaque contrôle reste dans l'ordre de tabulation normal.
- Avec une prop `label`, c'est un groupe nommé (`role="group"`), par ex. « Filtres et
  actions de la liste » ; sans elle, simple mise en page.
- Ordre de lecture = ordre visuel : `start` puis `end`.
