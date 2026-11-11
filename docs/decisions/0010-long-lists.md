# 0010 — Listes longues dans les filtres : recherche et cases à cocher dans le même panneau

- **Statut** : Proposé
- **Date** : 2026-11-11
- **Composants** : DsaasfrSearchableCheckboxSet (DsaasfrFilterChip, DsaasfrDropdown ajustés)

## Point de départ DSFR

- Contrôles de formulaire : [champ de saisie](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/champ-de-saisie)
  et [cases à cocher](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/case-a-cocher)
  (`DsfrInputGroup`, `DsfrCheckboxSet`).
- À notre connaissance, le DSFR ne propose pas de liste déroulante à choix multiples avec
  recherche. Vue DSFR propose `DsfrMultiselect` : un bouton qui ouvre son propre panneau, avec
  recherche facultative, « tout sélectionner » et toutes les options correspondantes.
- Les filtres de DSaaSFR (fiche 0009) : une étiquette par champ, dont les valeurs s’ouvrent
  dans un panneau (`DsaasfrDropdown`) avec un bouton « Appliquer ».

## Besoin SaaS

Certains champs ont des centaines ou des milliers de valeurs : les communes d’un département
(souvent plus de 500, parfois plus de 1 000), les agents d’une direction. Une liste de cases à
cocher n’est plus utilisable, et les compteurs par valeur perdent leur intérêt. Ces valeurs
font pourtant partie de la recherche comme les autres : une recherche enregistrée contient les
communes et les autres filtres ensemble. Elles doivent donc se choisir au même endroit et de
la même façon que les autres valeurs.

## Options envisagées

1. **`DsfrMultiselect` dans le panneau de l’étiquette** (vérifié sur Vue DSFR 8.21) : un
   panneau qui s’ouvre dans un panneau (son propre bouton `fr-select` et sa propre zone
   repliable, deux niveaux à fermer, une gestion de Tab et des flèches qui entrerait en conflit
   avec celle du panneau) ; **pas de `disabled` par option** (la règle des valeurs sans
   résultat, fiche 0009, est impossible) ; **champ de recherche sans étiquette** (un
   `placeholder` seulement) ; **aucune limite de résultats** (les 1 000 options sont rendues,
   `maxOverflowHeight` ne fait qu’ajouter un défilement) ; la sélection se perd au milieu des
   résultats. Aucune prop ne permet un mode intégré.
2. **Une boîte de dialogue modale** ouverte depuis le menu « Filtrer » ou l’étiquette : deux
   sauts de focus, un comportement différent des autres filtres.
3. **Une liste de suggestions (combobox)** : motif ARIA complexe, que le DSFR ne propose pas,
   et difficile à rendre robuste avec les lecteurs d’écran.
4. **Dans le panneau existant, une recherche suivie de cases à cocher** (retenue).

## Décision

`DsaasfrSearchableCheckboxSet` se place dans le panneau, comme une liste de cases à cocher
ordinaire. Il compose `DsfrInputGroup` et `DsfrCheckboxSet` :

- **la sélection d’abord, toujours visible**, avec « Tout désélectionner » ;
- **puis le champ de recherche**, et les résultats juste en dessous : après une recherche, Tab
  mène directement aux résultats, sans repasser par la sélection ;
- sur une liste longue (plus de `maxResults` options), les résultats apparaissent après 2
  caractères ; une liste courte est affichée entière ;
- la recherche ignore les accents, la casse, les traits d’union et les apostrophes, et porte
  sur `searchText` s’il est fourni (le nom sans son nombre de dossiers) ;
- **ordre des résultats** : les valeurs disponibles d’abord, puis les noms qui commencent par
  le texte saisi, puis l’ordre de l’application ;
- **des résultats limités** (50 par défaut), puis « Et N autres résultats : précisez la
  recherche » ;
- **cocher une case ne la déplace jamais** : les deux listes ne sont recalculées que lorsque
  la recherche change, ou que la sélection change depuis l’extérieur (« Réinitialiser »).
  Un changement fait dans le composant est reconnu comme tel, qu’il vienne du clavier ou
  d’un pointeur, avec ou sans focus (Safari et Firefox sous macOS ne donnent pas le focus à
  une case cliquée). Une case de la sélection, une case cochée ou celle qui a le focus n’est
  jamais désactivée, même si son nombre de résultats tombe à 0 ;
- **Échap** dans le champ vide d’abord la recherche (comportement habituel d’un champ de
  recherche) ; un second Échap ferme le panneau. Sans cela, Échap fermait le panneau et le
  brouillon était perdu ;
- `autofocus` : dans le panneau d’une étiquette, le focus va au champ de recherche à
  l’ouverture (`data-autofocus`, lu par `DsaasfrDropdown`) ;
- pas de `fieldset` englobant le champ et les deux groupes (pour éviter des `fieldset`
  imbriqués) : le champ et chaque groupe portent le nom de la liste (« Rechercher :
  Commune », « Commune : sélection (2) », « Commune : résultats ») ;
- le champ reste un champ simple, sans l’icône de recherche du DSFR (`fr-input-wrap
  fr-icon-search-line`) : `DsfrInputGroup` ne permet pas de la poser sur l’élément qui
  enveloppe le champ ;
- l’application garde la main : valeurs en `v-model`, et `v-model:query` avec
  `localFilter: false` pour chercher côté serveur.

Ajustements liés :

- **DsaasfrFilterChip** : le nom accessible de l’étiquette et l’infobulle des valeurs citent
  au plus 10 valeurs, puis « et N autres » (200 communes ne sont plus lues une à une).
- **DsaasfrDropdown** :
  - la hauteur du panneau est limitée à l’espace disponible même si le contenu tient à
    l’ouverture : il peut grandir ensuite (résultats de recherche) ;
  - seul le contenu défile, le pied est en dessous : il ne masque plus l’élément qui a le
    focus (RGAA 10.7) ;
  - si l’espace disponible est trop petit (moins de 12rem, fort zoom sur une fenêtre basse),
    la hauteur n’est plus limitée : le panneau s’allonge et la page défile, au lieu de ne
    montrer que le pied (RGAA 10.11) ;
  - `autofocus` va d’abord à un élément marqué `data-autofocus`.

## Conséquences pour l'accessibilité

- Un seul niveau de panneau : même modèle clavier que les autres filtres (Tab, Échap ferme et
  rend le focus à l’étiquette).
- Le champ est un `type="search"` avec une étiquette visible ; l’aide (« 1 178 choix :
  saisissez au moins 2 caractères du nom ») est dans l’étiquette, selon le balisage DSFR.
- Le nombre de résultats est annoncé poliment (`role="status"`) une fois la saisie
  interrompue (500 ms), pas à chaque touche (RGAA 7.5) : « 811 résultats, 50 affichés :
  précisez la recherche ». Le message est vidé puis réécrit, pour qu’un même nombre après une
  nouvelle recherche soit annoncé. Si seules des valeurs déjà choisies correspondent, le
  message le dit (« Aucun autre résultat : ce que vous cherchez est déjà dans la sélection »).
- Les groupes sont des `fieldset` nommés : « Commune : sélection (2) », « Commune :
  résultats ».
- Le focus ne saute jamais : une case cochée reste en place (RGAA 7.3, 12.8). « Tout
  désélectionner » renvoie le focus au champ de recherche, puisque la liste et le bouton
  disparaissent.
- Revue RGAA 4.1.2 (agent `a11y-auditor`, 2026-11-11) : axe sans erreur en clair et en
  sombre, et à 320 px ; les points relevés (pied qui masquait le focus, panneau réduit au pied
  à fort zoom, case déplacée au clic sans focus, ordre champ / sélection, Échap, annonces)
  sont corrigés ci-dessus. Restent à vérifier avec NVDA, JAWS et VoiceOver : annonce du
  nombre de résultats sans couper l’écho des caractères, compréhension de la position
  (sélection / résultats), cases « indisponibles » en mode navigation, zoom texte 200 % et
  espacement du texte (10.12).
- Une valeur sans résultat est désactivée (règle des filtres, fiche 0009), sauf si elle est
  déjà choisie : on peut toujours la décocher.
- Entrée dans le champ ne soumet pas un éventuel formulaire englobant.

## Questions ouvertes pour la communauté DSFR

- Le DSFR envisage-t-il une liste à choix multiples avec recherche ? Laquelle de ces formes ?
- `DsfrMultiselect` pourrait-il proposer un mode « intégré » (sans bouton ni panneau propre),
  une limite de résultats, un `disabled` par option et une étiquette visible pour sa
  recherche ? DSaaSFR pourrait alors s’appuyer dessus.
