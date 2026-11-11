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
  lignes (« Département », « Gironde (33) ») qui ouvre une liste de **liens**, sur
  `DsaasfrDropdown`. `DsfrLanguageSelector` lui-même ne convient pas (vérifié sur Vue DSFR
  8.21) : liens forcés à `#code` avec `preventDefault` (ni RouterLink ni vraie URL), attributs
  `lang` / `hreflang` égaux au code (« 33 » serait une langue invalide, RGAA 8.7), déclencheur
  figé sur une ligne, pas de groupes. `DsfrSelect` changerait de contexte au changement de
  valeur (RGAA 7.4).
- Déclencheur proche de celui du menu utilisateur (fiche 0005), avec une **bordure**
  (`--border-default-grey`) qui le signale comme un contrôle de sélection, et non comme une
  identité.
- Choix courant : `aria-current="true"` et le **repère de `fr-sidemenu__link[aria-current]`**
  (barre bleue de 2 px à gauche, en retrait en haut et en bas, `Highlight` en couleurs forcées).
  La graisse est un ajout DSaaSFR.
- Titres de groupe : pas d’équivalent dans `fr-menu` ; le plus proche est
  `fr-mega-menu__category`. Alignés sur le texte des liens.
- Des **liens**, pas des boutons radio : changer de département est un changement de
  contexte, déclenché explicitement par l’utilisateur (RGAA 7.4).
- **Pas de champ de recherche dans le panneau.** Quelques choix (le cas courant) : une liste.
  Beaucoup de choix (administration nationale, 101 départements) : les plus utiles dans le
  panneau, éventuellement par région (`groups`), et un lien « Tous les départements »
  (`moreLink`) vers une **page** qui les liste tous, par région.
- Ce que fait l’application, pas la bibliothèque : où vit le département (chemin `/33/…`,
  paramètre, session), ce que le changement réinitialise (le filtre Commune, l’aperçu), son
  enregistrement dans les recherches sauvegardées, **l’annonce** de ce qui a changé (zone
  `role="status"` présente dès le chargement : « Département : Landes (40). Filtre Commune
  retiré. ») et le **titre de la page** (`document.title` avec le département, RGAA 8.6).
- L’emplacement `context` est rendu deux fois (barre latérale et menu mobile), comme la
  navigation : ne pas passer d’`id` fixe au sélecteur.

### Placement à côté de la personne connectée (2026-11-11)

Retour du responsable produit : le sélecteur sous le nom du service ne convainc pas. Il peut
aussi se placer **au-dessus du menu utilisateur**, dans le pied de la barre latérale
(emplacement `footer`, ouverture vers le haut) : « qui je suis » et « où je travaille »
ensemble, ce qui correspond au cas où le périmètre découle des droits de la personne. C’est
désormais le choix du bac à sable. Moins visible à l’arrivée qu’en haut ; plus rapide qu’une
entrée du menu utilisateur, que l’on a écartée (un clic de plus pour ceux qui changent
souvent). L’emplacement `context` reste disponible pour un placement en haut. Sur écran
étroit, le sélecteur suit le pied dans le menu, après la navigation.

## Conséquences pour l'accessibilité

- Bouton de divulgation (`aria-expanded`, `aria-controls`) ; nom accessible « Département :
  Gironde (33) » posé par `aria-label` : il contient le texte visible dans l’ordre (RGAA
  7.1.3, la ponctuation pouvant être ignorée) et sépare les deux lignes, sans quoi elles
  seraient lues « DépartementGironde ». La règle expérimentale d’axe
  `label-content-name-mismatch` le signale à tort.
- À l’ouverture, le focus va sur le choix courant ; Échap, clic en dehors et Tab hors du
  panneau ferment, le focus revient au bouton (`DsaasfrDropdown`).
- **Après un choix, le focus revient au bouton**, qui annonce la nouvelle valeur : le lien
  choisi disparaît avec le panneau et la page reste souvent la même, le focus tomberait sur
  `<body>` (RGAA 12.8). Sur écran étroit, la modale du menu se ferme et rend le focus au
  bouton « Menu ».
- Le lien « Tous les départements » n’est jamais marqué courant (vue-router poserait
  `aria-current="page"` sur sa propre page).
- **Contraste** : le libellé gris (« Département ») ne garde `--text-mention-grey` que sur le
  fond au repos ; au survol et ouvert, il prend la couleur du bouton (sinon 3,4:1 à 4,3:1).
  Ouvert, le bouton ne fonce plus au survol : la paire DSFR `text-active-blue-france` sur
  `background-open-blue-france-hover` (celle de `fr-translate__btn`) tombe à 2,6:1 en thème
  sombre (RGAA 3.2). Même correction sur le menu utilisateur.
- Le choix courant n’est pas signalé par la couleur seule (RGAA 3.1) : `aria-current`, repère
  bleu à gauche et graisse.
- Les groupes sont des listes nommées par leur titre (`aria-labelledby`). La liste sans
  groupe s’appelle « Choisir : Département » (`listLabel`).
- La région « Périmètre » (12.6 ne l’exige ni ne l’interdit) permet d’aller directement au
  changement de contexte par les repères (touche D sous NVDA, rotor sous VoiceOver).
- Revue RGAA 4.1.2 (agent `a11y-auditor`, 2026-11-11) et revue DSFR (`dsfr-guardian`) :
  points corrigés ci-dessus. Restent à vérifier avec NVDA, JAWS et VoiceOver : annonce du
  bouton et de l’élément courant, noms des listes groupées, utilité de la région, commande
  vocale (« Cliquer Département »), barre du choix courant en contraste élevé Windows.

## Questions ouvertes pour la communauté DSFR

- La paire `text-active-blue-france` / `background-open-blue-france-hover` de
  `fr-translate__btn` ouvert et survolé passe sous 4,5:1 en thème sombre : est-ce connu ?

- Le DSFR prévoit-il un « sélecteur de contexte » (organisation, territoire) pour les
  applications métier ? Le sélecteur de langue est-il le bon modèle ?
