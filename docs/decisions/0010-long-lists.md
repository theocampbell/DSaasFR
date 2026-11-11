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

1. **`DsfrMultiselect` dans le panneau de l’étiquette** : un panneau qui s’ouvre dans un
   panneau (deux niveaux à fermer, focus plus difficile à suivre) ; affiche toutes les options
   correspondantes (plus de 1 000 sans recherche) ; la sélection se perd au milieu des résultats.
2. **Une boîte de dialogue modale** ouverte depuis le menu « Filtrer » ou l’étiquette : deux
   sauts de focus, un comportement différent des autres filtres.
3. **Une liste de suggestions (combobox)** : motif ARIA complexe, que le DSFR ne propose pas,
   et difficile à rendre robuste avec les lecteurs d’écran.
4. **Dans le panneau existant, une recherche suivie de cases à cocher** (retenue).

## Décision

`DsaasfrSearchableCheckboxSet` se place dans le panneau, comme une liste de cases à cocher
ordinaire. Il compose `DsfrInputGroup` et `DsfrCheckboxSet` :

- **un champ de recherche d’abord** ; sur une liste longue (plus de `maxResults` options), les
  résultats apparaissent après 2 caractères ; une liste courte est affichée entière ;
- la recherche ignore les accents, la casse, les traits d’union et les apostrophes ; les noms
  qui commencent par le texte saisi passent devant ;
- **la sélection, toujours visible**, au-dessus des résultats, avec « Tout désélectionner » ;
- **des résultats limités** (50 par défaut), puis « Et N autres résultats : précisez la
  recherche » ;
- **cocher une case ne la déplace jamais** : les deux listes ne sont recalculées que lorsque
  la recherche change (ou que la sélection change depuis l’extérieur, par exemple
  « Réinitialiser ») ;
- l’application garde la main : valeurs en `v-model`, et `v-model:query` avec
  `localFilter: false` pour chercher côté serveur. L’ordre des options est celui de
  l’application (le bac à sable place d’abord les communes qui ont des dossiers).

Ajustements liés :

- **DsaasfrFilterChip** : le nom accessible de l’étiquette cite au plus 10 valeurs, puis
  « et N autres » (200 communes ne sont plus lues une à une).
- **DsaasfrDropdown** : la hauteur du panneau est toujours limitée à l’espace disponible, pas
  seulement s’il est trop grand à l’ouverture : le contenu peut grandir ensuite (résultats
  de recherche) et le pied (« Appliquer ») doit rester visible.

## Conséquences pour l'accessibilité

- Un seul niveau de panneau : même modèle clavier que les autres filtres (Tab, Échap ferme et
  rend le focus à l’étiquette).
- Le champ est un `type="search"` avec une étiquette visible ; l’aide (« 1 178 choix :
  saisissez au moins 2 caractères du nom ») est dans l’étiquette, selon le balisage DSFR.
- Le nombre de résultats est annoncé poliment (`role="status"`) une fois la saisie
  interrompue (500 ms), pas à chaque touche (RGAA 7.5).
- Les groupes sont des `fieldset` nommés : « Commune : sélection (2) », « Commune :
  résultats ».
- Le focus ne saute jamais : une case cochée reste en place (RGAA 7.3, 12.8). « Tout
  désélectionner » renvoie le focus au champ de recherche, puisque la liste et le bouton
  disparaissent.
- Une valeur sans résultat est désactivée (règle des filtres, fiche 0009), sauf si elle est
  déjà choisie : on peut toujours la décocher.
- Entrée dans le champ ne soumet pas un éventuel formulaire englobant.

## Questions ouvertes pour la communauté DSFR

- Le DSFR envisage-t-il une liste à choix multiples avec recherche ? Laquelle de ces formes ?
- `DsfrMultiselect` pourrait-il proposer un mode « intégré » (sans bouton ni panneau propre)
  et une limite de résultats ? DSaaSFR pourrait alors s’appuyer dessus.
