# DsaasfrSearchableCheckboxSet

Des **cases à cocher pour une liste longue** : des centaines ou des milliers de valeurs, par
exemple les communes d’un département. La sélection toujours visible, un champ de recherche,
puis des résultats limités juste en dessous.

Il se place **dans un panneau**, à la place d’une liste de cases à cocher ordinaire :
typiquement une fenêtre modale ouverte par un bouton de filtre (« Communes », dans le bac à
sable) ou le panneau d’un bouton de groupe de filtres ([DsaasfrDropdown](/composants/dropdown)). Les listes longues se choisissent ainsi au même endroit et de la même façon
que les autres filtres.

## Quand l’utiliser

- Pour un choix multiple parmi beaucoup de valeurs (au-delà de quelques dizaines) : communes,
  agents, établissements.
- Pas pour une liste courte : `DsfrCheckboxSet` suffit (le composant affiche d’ailleurs une
  liste courte en entier).
- Pas pour un choix unique : un champ DSFR (liste déroulante, boutons radio) suffit.
- Pas comme champ autonome dans une page : `DsfrMultiselect` de Vue DSFR est fait pour ça.
  Ce composant-ci évite d’ouvrir un panneau dans un panneau (voir la
  [fiche de décision 0010](/decisions/0010-long-lists)).

## Exemple

<Example story="briques-dsaasfrsearchablecheckboxset--in-panel" title="filtre Commune parmi plus de 1 000 communes" :height="560" />

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Toutes les communes du département (codes INSEE et noms), avec le nombre de dossiers.
const options = communes.map(c => ({
  value: c.code,
  label: `${c.nom} (${c.dossiers})`,
  searchText: c.nom, // on cherche le nom, pas le nombre de dossiers
  disabled: c.dossiers === 0,
}))
const ouvert = ref(false)
const brouillon = ref<string[]>([])
</script>

<template>
  <DsfrButton :label="`Communes (${choisies.length})`" icon="fr-icon-map-pin-2-line" secondary size="sm" @click="ouvert = true" />
  <Teleport to="body">
    <DsfrModal :opened="ouvert" title="Communes" :actions="[{ label: 'Appliquer', onClick: appliquer }]" @close="ouvert = false">
      <DsaasfrSearchableCheckboxSet v-model="brouillon" label="Commune" :options="options" />
    </DsfrModal>
  </Teleport>
</template>
```

### Comportement

- **Petite liste, pas de recherche** : jusqu’à `searchThreshold` options (12 par défaut), le
  composant affiche simplement les cases à cocher. Une personne dont le périmètre compte 10
  communes voit 10 cases ; celle qui voit tout le département a la recherche. Le même écran
  sert aux deux.
- **Recherche** : sur une liste longue (plus de `maxResults` options), les résultats
  apparaissent après `minQueryLength` caractères (2 par défaut). Les accents, la casse, les
  traits d’union et les apostrophes sont ignorés : « saint medard » trouve
  « Saint-Médard-en-Jalles ». Les noms qui commencent par le texte saisi passent devant.
- **Sélection** : les valeurs choisies sont listées en premier, au-dessus du champ, toujours
  visibles, avec « Tout désélectionner ». Les résultats suivent ainsi directement le champ.
  Une valeur choisie que les options ne connaissent plus (par exemple dans une ancienne
  recherche enregistrée) y apparaît aussi.
- **Résultats limités** à `maxResults` (50 par défaut), puis « Et N autres résultats :
  précisez la recherche ».
- **Rien ne bouge pendant qu’on coche** : une case cochée reste à sa place jusqu’à la
  prochaine recherche, au clavier comme à la souris (y compris dans Safari, où un clic ne
  donne pas le focus). Une case décochée ou qui a le focus n’est jamais désactivée sous
  l’utilisateur. Le focus ne saute jamais.
- **Ordre des résultats** : les valeurs disponibles d’abord, puis les noms qui commencent par
  le texte saisi, puis l’ordre de vos options.
- **Échap** dans le champ vide d’abord la recherche ; un second Échap ferme le panneau.
- **Seul dans un panneau** ([DsaasfrDropdown](/composants/dropdown)), ajoutez `autofocus` :
  le panneau place le focus sur le champ de recherche à l’ouverture (`data-autofocus`). Pas
  quand d’autres champs le précèdent dans le même panneau.
- Si une étiquette contient un nombre (« Bordeaux (12) »), passez le nom seul dans
  `searchText` : sinon, taper « 12 » trouverait la commune par son compteur.

### Recherche côté serveur

Avec `:local-filter="false"`, le composant ne filtre plus : il affiche les options reçues et
vous transmet le texte saisi par `v-model:query`. Interrogez votre serveur et passez-lui les
options correspondantes.

```vue
<DsaasfrSearchableCheckboxSet
  v-model="brouillon"
  v-model:query="texte"
  label="Agent"
  :options="agentsTrouves"
  :local-filter="false"
/>
```

Gardez dans `options` les valeurs déjà choisies, pour afficher leur libellé dans la sélection.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `options` | `{ value, label, searchText?, disabled?, hint? }[]` | — (obligatoire) | Toutes les options (peut en compter des milliers). Avec `localFilter: false`, seulement celles qui correspondent à la recherche. |
| `label` | `string` | — (obligatoire) | Nom de la liste, par exemple « Commune ». Utilisé dans les textes par défaut. |
| `searchLabel` | `string` | `'Rechercher : {label}'` | Étiquette du champ de recherche. |
| `searchHint` | `string` | selon la taille | Aide sous l’étiquette du champ. |
| `selectedLegend` | `string` | `'{label} : sélection'` | Légende de la sélection (le nombre est ajouté). |
| `resultsLegend` | `string` | `'{label} : résultats'` | Légende des résultats. |
| `searchThreshold` | `number` | `12` | Jusqu’à ce nombre d’options, pas de champ de recherche : une simple liste de cases à cocher (légende : `label`). Ignoré avec `localFilter: false`. |
| `autofocus` | `boolean` | `false` | Le panneau englobant place le focus sur le champ de recherche à l’ouverture. |
| `maxResults` | `number` | `50` | Résultats affichés au plus. |
| `minQueryLength` | `number` | `2` | Caractères à saisir avant d’afficher les résultats d’une liste longue. |
| `localFilter` | `boolean` | `true` | Filtrer les options ici. `false` : l’application cherche elle-même. |
| `clearText` | `string` | `'Tout désélectionner'` | Bouton qui vide la sélection. |
| `maxVisibleSelected` | `number` | `5` | Valeurs choisies affichées avant « Afficher toute la sélection » : avec 50 communes choisies, le champ de recherche reste visible. À l’ouverture, le focus va à la première valeur révélée. |
| `showAllSelectedText` | `(n) => string` | « Afficher toute la sélection (50) » | Bouton de divulgation qui déplie la sélection (libellé stable, état dans `aria-expanded`). |
| `resultsCountText` | `(n, affichés) => string` | « 811 résultats, 50 affichés : précisez la recherche » | Nombre de résultats annoncé aux lecteurs d’écran. |
| `noResultsText` | `string` | « Aucun résultat : … » | Texte quand rien ne correspond. |
| `alreadySelectedText` | `string` | « Aucun autre résultat : ce que vous cherchez est déjà dans la sélection. » | Texte quand seules des valeurs déjà choisies correspondent. |
| `moreResultsText` | `(n) => string` | « Et 70 autres résultats : précisez la recherche. » | Texte sous des résultats limités. |

Une option `disabled` ne peut pas être cochée, sauf si elle est déjà choisie : on peut
toujours la décocher.

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model` | `string[]` | `[]` | Valeurs choisies. |
| `v-model:query` | `string` | `''` | Texte de recherche. |

## Accessibilité

- Un seul niveau de panneau : le même modèle clavier que les autres filtres.
- Le champ de recherche a une étiquette visible ; l’aide est dans l’étiquette (balisage
  DSFR). Entrée ne soumet pas le formulaire.
- Le nombre de résultats est annoncé (`role="status"`) quand la saisie s’interrompt, pas à
  chaque touche, avec le nombre affiché quand la liste est limitée. Le même nombre après une
  nouvelle recherche est annoncé à nouveau.
- La sélection et les résultats sont des groupes nommés : « Commune : sélection (2) »,
  « Commune : résultats ».
- Le focus ne saute jamais : une case cochée reste en place ; « Tout désélectionner » renvoie
  le focus au champ de recherche.
- La sélection précède le champ : après une recherche, Tab mène directement aux résultats.

## Voir aussi

- [Fiche de décision 0010](/decisions/0010-long-lists)
- [DsaasfrSelectedFilters](/composants/selected-filters), [recette : filtres d’une liste](/recettes/filtres)
