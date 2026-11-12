# DSaaSFR — feuille de route

Ce qui est prévu, sans engagement de date : DSaaSFR est un projet expérimental. Les choix de
conception sont expliqués dans les [fiches de décision](docs/decisions). Retours et
propositions bienvenus dans les tickets ou les discussions du dépôt.

## En cours

- **Recherches enregistrées** : des liens nommés dans la barre latérale (groupe « Mes
  recherches »), enregistrés par l’application. Exemple et recette dans le bac à sable :
  enregistrer la recherche (modale avec un nom), nom de la recherche dans le titre de la
  page, recherche modifiée (« Enregistrer les modifications » ou « comme nouvelle
  recherche »). La barre latérale marque déjà le bon lien comme page courante, paramètres
  compris.
- **Titres de page issus des données** : un titre par page, défini une fois ses données
  chargées (numéro de dossier, demandeur, nom d’une recherche enregistrée), pour le niveau
  courant du fil d’Ariane, le `<h1>`, l’onglet du navigateur (RGAA 8.6) et une annonce de
  changement de page.
- **Filtres sélectionnés** : « Tout effacer » sur la dernière ligne de tags plutôt que seul en
  dessous (à décider).
- **Tests avec technologies d’assistance** (NVDA, JAWS, VoiceOver) : les vérifications
  manuelles listées dans les fiches 0008 à 0011.

## Ensuite

- **Tests de régression visuelle** sur les stories Storybook : repérer un décalage après une
  mise à jour du DSFR.
- **Textes par défaut** modifiables en un seul endroit, à l’installation du plugin.
- **Page « cas limites »** dans le bac à sable : libellés très longs, listes vides, 40
  filtres, chargement lent.
- **État de l’accessibilité** : ce qui a été testé, avec quels lecteurs d’écran, et ce qui ne
  l’a pas été.
- **Guide d’intégration** et rôles dans le bac à sable : navigation et actions selon le rôle,
  garde du routeur (un « instructeur » et un « administrateur » qui voient des choses
  différentes).
- **Signaler à Vue DSFR** deux problèmes relevés (fiche 0004) : slot `mainnav` de `DsfrHeader`
  typé sans sa prop `hidemodal` ; `DsfrSideMenuList` place `aria-current="page"` sur les
  boutons de groupe.
- **Étiquette de filtre modifiable sur place** (condition, valeurs), à la manière de Linear :
  retirée du paquet pour l’instant (fiche 0009), à reprendre.

## Plus tard

- Tableau de données : en-têtes fixes, tri, sélection de lignes, actions groupées.
- Sélecteur de période, états vides, squelettes de chargement, toasts.
- Composant de paramètres d’affichage, si toutes les applications en ont besoin.
- Avatar du menu utilisateur : initiales ou photo.
- Module Nuxt, si des équipes Nuxt le demandent.

## Fait récemment

- **0.3.0** : filtres groupés (`DsaasfrFilterDropdown`, `DsaasfrFilterModal`,
  `DsaasfrSearchableCheckboxSet`, `DsaasfrSelectedFilters`), aperçu flottant contenu dans la
  liste, sélecteur de département (`DsaasfrContextSwitcher`), revues DSFR et RGAA 4.1.2.
- **0.2.0** : site de documentation, publication automatisée, panneau d’aperçu, filtres.
