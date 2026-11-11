# 0011 — Sélecteur de contexte (département) sous le nom du service

- **Statut** : Proposé
- **Date** : 2026-11-11
- **Composants** : DsaasfrContextSwitcher, DsaasfrSidebar (emplacement `context`)

## Point de départ DSFR

- [Sélecteur de langue](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/selecteur-de-langue)
  (`DsfrLanguageSelector`) : un bouton qui montre la langue courante et ouvre une liste de
  **liens**, la langue courante marquée `aria-current="true"`. Il se place dans les outils de
  l’en-tête.
- L’en-tête DSFR n’a pas d’emplacement pour un « contexte de travail » ; DSaaSFR remplace
  l’en-tête par la barre latérale (fiches 0003 et 0004).

## Besoin SaaS

Certaines organisations travaillent dans plusieurs départements, et l’administration
nationale dans tous. Le département courant détermine tout ce que l’application montre :
dossiers, nombres, communes des filtres. Il doit être visible en permanence, et facile à
changer pour ceux qui en changent souvent.

## Options envisagées

1. **Dans les filtres de chaque liste** : non, le département n’est pas un critère d’une
   liste, c’est le cadre de toute l’application.
2. **Dans le menu utilisateur** : caché, et c’est un réglage du compte, pas de ce sur quoi on
   travaille.
3. **Premier niveau du fil d’Ariane** : on ne change pas de contexte depuis un fil d’Ariane.
4. **En haut de la barre latérale, sous le nom du service** (retenue), comme le sélecteur
   d’espace de travail de nombreux outils.

## Décision

- Emplacement `context` dans `DsaasfrSidebar`, entre le bloc-marque et la navigation, exposé
  comme une région nommée (« Périmètre », `contextLabel`). Sur écran étroit (en-tête mobile
  DSFR), il passe en haut du menu, avant la navigation.
- `DsaasfrContextSwitcher` reprend le **modèle du sélecteur de langue** : un bouton à deux
  lignes (« Département », « Gironde (33) ») qui ouvre une liste de **liens** ; le choix courant
  porte `aria-current="true"` et le repère bleu de la navigation active du DSFR. Même
  déclencheur que le menu utilisateur (fiche 0005), sur `DsaasfrDropdown`.
- Des **liens**, pas des boutons radio : changer de département est un changement de
  contexte, déclenché explicitement par l’utilisateur (RGAA 7.4).
- **Pas de champ de recherche dans le panneau.** Quelques choix (le cas courant) : une liste.
  Beaucoup de choix (administration nationale, 101 départements) : les plus utiles dans le
  panneau, éventuellement par région (`groups`), et un lien « Tous les départements »
  (`moreLink`) vers une **page** qui les liste tous, par région.
- Ce que fait l’application, pas la bibliothèque : où vit le département (chemin `/33/…`,
  paramètre, session), ce que le changement réinitialise (le filtre Commune, l’aperçu), et
  son enregistrement dans les recherches sauvegardées.

## Conséquences pour l'accessibilité

- Bouton de divulgation (`aria-expanded`, `aria-controls`) ; nom accessible « Département :
  Gironde (33) », qui contient le texte visible (RGAA 7.1.3) et sépare les deux lignes (sans
  quoi elles seraient lues « DépartementGironde »).
- À l’ouverture, le focus va sur le choix courant ; Échap, clic en dehors et Tab hors du
  panneau ferment, le focus revient au bouton (`DsaasfrDropdown`).
- Le choix courant n’est pas signalé par la couleur seule (RGAA 3.1) : `aria-current`, repère
  bleu à gauche et graisse.
- Les groupes sont des listes nommées par leur titre (`aria-labelledby`).

## Questions ouvertes pour la communauté DSFR

- Le DSFR prévoit-il un « sélecteur de contexte » (organisation, territoire) pour les
  applications métier ? Le sélecteur de langue est-il le bon modèle ?
