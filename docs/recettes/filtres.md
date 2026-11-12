# Filtres d’une liste

Cette recette décrit le motif de recherche et de filtres du bac à sable (page « Dossiers ») :
une recherche dans la page, un bouton par groupe de filtres dans la barre d’outils, et les
filtres sélectionnés juste en dessous. Le code complet est dans `playground/src/`
(`FilterControls.vue`, `FilterGroupButton.vue`, `CommunesModal.vue`, `filters.ts`) : ces
fichiers ne contiennent que les données, le comportement est dans les composants.

## Ce que fournit la bibliothèque, ce que fait l’application

| Bibliothèque DSaaSFR | Votre application |
|---|---|
| [DsaasfrToolbar](/composants/toolbar) : la ligne, `start` et `end` | Les champs, leurs groupes et leurs valeurs |
| [DsaasfrFilterDropdown](/composants/filter-dropdown) : un groupe de filtres, bouton avec le nombre de filtres actifs, panneau, « Réinitialiser » / « Afficher… », focus | Le brouillon de chaque groupe et le nombre de résultats du bouton « Afficher N dossiers » |
| [DsaasfrFilterModal](/composants/filter-modal) : un filtre à beaucoup de valeurs, bouton, modale DSFR de taille fixe, focus | Le brouillon et l’application du filtre |
| [DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set) : recherche et cases à cocher pour une liste longue | Toutes les valeurs possibles (par exemple les communes du département) |
| [DsaasfrSelectedFilters](/composants/selected-filters) : les filtres en cours, en tags supprimables | Les filtres appliqués, la requête au serveur, les nombres de résultats |
| `DsfrSearchBar`, `DsfrModal`, `DsfrCheckboxSet`, `DsfrButton` (Vue DSFR) | Le focus quand le dernier filtre est retiré |

La bibliothèque ne sait rien de vos données : les champs, les valeurs, l’application des
filtres et la requête au serveur restent dans votre code.

## Le motif

```
┌ barre d’outils ─────────────────────────────────────────────────────────────────────┐
│ 15 dossiers sur 250            [Communes (3)] [Instruction (1)] [Projet]  [Enregistrer…] │
└────────────────────────────────────────────────────────────────────────────────────┘
                     Commune : Bordeaux et 2 autres ×   Statut : En cours ×   [Tout effacer]
  Dossiers
  [🔍 Référence, demandeur ou commune                    ] [Rechercher]
```

- **La recherche** est dans la page, sous le titre (`DsfrSearchBar`), appliquée à la
  validation. Elle n’a pas de tag : le texte reste visible dans son champ.
- **La barre d’outils** ne contient que des commandes : le nombre de résultats
  (`role="status"`) à gauche ; à droite, **un bouton par groupe de filtres**, puis
  « Enregistrer la recherche ». Les groupes dépendent du métier : « Communes »,
  « Instruction », « Projet »… Chaque bouton indique combien de ses filtres sont actifs.
- **Les filtres sélectionnés** sont hors de la barre d’outils, en haut de la page, alignés à
  droite sous les boutons : un tag supprimable par filtre et « Tout effacer ».
- **Pas de condition** : un filtre retient les dossiers qui ont l’une des valeurs choisies.

## Pourquoi appliquer à la demande

Les filtres ne s’appliquent pas à chaque clic, mais quand l’utilisateur valide (« Afficher
16 dossiers »).

Avec des millions d’enregistrements, le filtrage s’exécute sur le serveur. Un filtrage
instantané enverrait une requête par case cochée, et les résultats changeraient pendant que
l’utilisateur fait encore son choix. Avec un bouton explicite :

- une seule requête par décision ;
- le nouveau nombre de résultats est annoncé une seule fois ;
- fermer un panneau sans valider abandonne le brouillon, sans effet sur la liste.

Le bouton annonce le résultat avant de l’appliquer (« Afficher 16 dossiers ») : c’est une
requête de comptage, plus légère que la requête de la liste. Retirer un filtre (le × d’un
tag) s’applique tout de suite : c’est une action explicite.

## 1. Un bouton par groupe

Un [DsaasfrFilterDropdown](/composants/filter-dropdown) par groupe ; le panneau contient un
`DsfrCheckboxSet` par champ du groupe, avec le nombre de résultats de chaque valeur.

```vue
<DsaasfrFilterDropdown
  v-model:open="ouvert"
  :label="groupe.libelle"
  :icon="groupe.icone"
  :count="nombreDeFiltresActifs(groupe)"
  :apply-label="`Afficher ${nombreDeResultats(brouillon)} dossiers`"
  @apply="appliquer(groupe, brouillon)"
  @reset="vider(brouillon)"
>
  <DsfrCheckboxSet v-for="champ in groupe.champs" :key="champ.cle" v-model="brouillon[champ.cle]" :legend="champ.libelle" small :options="options(champ)" />
</DsaasfrFilterDropdown>
```

- Quand `open` passe à `true`, repartez des filtres appliqués pour le brouillon ; fermer
  sans appliquer l’abandonne.
- Chaque valeur affiche son nombre de résultats (« En cours (12) ») ; une valeur qui ne
  donnerait rien est désactivée, sauf si elle est déjà choisie. Les identifiants des cases
  n’utilisent pas la valeur elle-même (elle contient des espaces) mais un index.

## 2. Champs à beaucoup de valeurs : les communes

Un champ de centaines de valeurs a son **propre bouton**, qui ouvre une **fenêtre modale
DSFR** : [DsaasfrFilterModal](/composants/filter-modal), avec un
[DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set) dedans.

```vue
<DsaasfrFilterModal
  v-model:open="ouvert"
  label="Communes"
  icon="fr-icon-map-pin-2-line"
  :count="communesAppliquees.length"
  :count-text="n => `${n} communes sélectionnées`"
  :apply-label="`Afficher ${nombreDeResultats(brouillon)} dossiers`"
  @apply="appliquer('commune', brouillon)"
>
  <DsaasfrSearchableCheckboxSet v-model="brouillon" label="Commune" :options="optionsCommune" />
</DsaasfrFilterModal>
```

- Le composant rend la modale au niveau de la page, garde sa taille pendant la recherche, et
  sur une fenêtre basse n’a qu’un défilement : rien à faire de votre côté.
- Un petit périmètre (10 communes) affiche de simples cases à cocher ; un département entier,
  la recherche. Passez le nom seul dans `searchText`.

## 3. Les filtres sélectionnés

```vue
<DsaasfrSelectedFilters
  align="end"
  :items="filtresAppliques.map(f => ({ key: f.champ, label: libelle(f.champ), values: f.valeurs }))"
  @remove="retirer"
  @clear="toutEffacer"
  @empty="focusSurLeBoutonDuGroupe"
/>
```

- Un tag par filtre : « Commune : Bordeaux et 2 autres ». Son nom accessible est
  « Retirer le filtre » suivi de ce texte visible ; la liste complète des valeurs en est la
  description.
- Après un retrait, le focus passe au tag suivant. Quand il n’en reste aucun (`empty`),
  placez-le sur le bouton du groupe du filtre retiré, après le prochain rendu.
- Annoncez ce que le retrait a fait dans la zone du nombre de résultats : « Filtre Statut
  retiré. 15 dossiers sur 250 ». Le nombre seul peut ne pas changer.

## Vérifier l’accessibilité

- Chaque panneau contient de vrais contrôles (`DsfrCheckboxSet`) avec une `legend` qui nomme
  le champ.
- Le nombre de résultats est dans un `role="status"` présent dès le chargement, et dit ce
  qu’un retrait a fait.
- Après un retrait, « Tout effacer », un panneau ou la modale, le focus est sur un tag ou un
  bouton, jamais sur `<body>`.
- Le nom accessible de chaque bouton et de chaque tag contient son texte visible.
- Échap ferme chaque panneau et la modale sans appliquer, et rend le focus à leur bouton.
- À 400 % de zoom, les boutons et les tags passent à la ligne, aucun texte n’est coupé, et
  dans la modale le focus reste visible.

## Questions ouvertes

La [fiche de décision 0009](/decisions/0009-filters) liste ce qui reste à trancher : garder les
filtres dans l’URL (listes filtrées partageables) et les recherches enregistrées.
