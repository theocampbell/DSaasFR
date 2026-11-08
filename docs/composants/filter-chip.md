# DsaasfrFilterChip

L’**étiquette de filtre** représente un filtre actif sur une liste, sous la forme
« champ · condition · valeurs · × » : « Statut · est · À instruire, Incomplet · × ». Chaque
partie peut ouvrir un panneau pour modifier le filtre sur place, et × le retire.

Le composant est **présentationnel** : il affiche ce que vous lui donnez. Les champs, leurs
valeurs, l’application du filtre et la requête au serveur restent dans votre application.

## Quand l’utiliser

- Dans l’emplacement `start` de la [barre d’outils](/composants/toolbar), une étiquette par
  filtre appliqué, à côté du nombre de résultats.
- Pour des listes longues que l’on restreint en combinant des conditions.
- Pas pour un mot-clé ou une catégorie statique : utilisez `DsfrTag`.
- Pas pour un filtre unique et toujours visible (une recherche, un seul choix) : un champ de
  formulaire DSFR suffit.

## Exemple

<Example story="briques-dsaasfrfilterchip--editable" title="filtre Assigné à, condition et valeurs modifiables" :height="320" />

Une partie devient un bouton quand vous fournissez l’emplacement du même nom (`field`,
`operator`, `values`). Les parties sans emplacement sont du texte simple. Ici, le champ est
fixe, la condition et les valeurs sont modifiables :

```vue
<script setup lang="ts">
import { ref } from 'vue'

const operator = ref('est')
const values = ref(['Personne A', 'Personne B'])
const people = ['Personne A', 'Personne B', 'Personne C', 'Personne D']
</script>

<template>
  <DsaasfrFilterChip
    field="Assigné à"
    :operator="operator"
    :values="values"
    @remove="retirerFiltre('assigne')"
  >
    <template #operator>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrRadioButtonSet
          v-model="operator"
          name="operateur-assigne"
          legend="Condition : Assigné à"
          small
          :options="[{ label: 'est', value: 'est' }, { label: 'n’est pas', value: 'n’est pas' }]"
        />
      </div>
    </template>

    <template #values>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrCheckboxSet
          v-model="values"
          legend="Valeurs : Assigné à"
          small
          :options="people.map(p => ({ label: p, value: p, name: 'assigne', id: `assigne-${p}` }))"
        />
      </div>
    </template>
  </DsaasfrFilterChip>
</template>
```

Dans cet exemple, chaque clic modifie le filtre immédiatement. Pour une liste filtrée par le
serveur, préférez un brouillon et un bouton « Appliquer » dans l’emplacement `footer` : voir
ci-dessous et la recette [Filtres d’une liste](/recettes/filtres).

### Appliquer à la demande

L’emplacement `footer` est commun aux panneaux de l’étiquette. Sa portée indique la partie
ouverte (`part`) et fournit `close`.

```vue
<DsaasfrFilterChip
  field="Statut"
  operator="est"
  :values="filtre.values"
  @remove="retirer('statut')"
>
  <template #values>
    <div class="fr-px-2w fr-pt-1w">
      <DsfrCheckboxSet v-model="brouillon" legend="Valeurs : Statut" small :options="optionsStatut" />
    </div>
  </template>
  <template #footer="{ close }">
    <DsfrButton label="Afficher 16 dossiers" size="sm" @click="appliquer('statut', brouillon); close(true)" />
  </template>
</DsaasfrFilterChip>
```

### Beaucoup de valeurs

<Example story="briques-dsaasfrfilterchip--many-values" title="quatre valeurs résumées en « Personne A, Personne B et 2 autres »" :height="120" />

Pour que l’étiquette tienne sur une ligne, les valeurs sont résumées : autant que possible
dans `maxValuesLength` caractères (32 par défaut), au plus `maxVisibleValues` (2 par défaut),
puis « et N autres ». La liste complète reste dans le nom accessible et dans l’infobulle.

```vue
<DsaasfrFilterChip
  field="Assigné à"
  operator="est"
  :values="['Personne A', 'Personne B', 'Personne C', 'Personne D']"
/>
```

### Sans valeur

<Example story="briques-dsaasfrfilterchip--no-value-yet" title="filtre ajouté, aucune valeur choisie" :height="120" />

Sans valeur, l’étiquette affiche « Choisir… » (`emptyValuesText`). Après l’ajout d’un filtre,
ouvrez directement le choix des valeurs avec `v-model:open-part` :

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { DsaasfrFilterChipPart } from '@dsaasfr/vue'

const openPart = ref<DsaasfrFilterChipPart | undefined>('values')
</script>

<template>
  <DsaasfrFilterChip v-model:open-part="openPart" field="Assigné à" operator="est" :values="[]">
    <template #values>…</template>
  </DsaasfrFilterChip>
</template>
```

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `field` | `string` | — (obligatoire) | Champ filtré, par exemple « Assigné à ». |
| `operator` | `string` | — | Condition, par exemple « est », « n’est pas ». Sans valeur, la partie n’est pas affichée. |
| `values` | `string[]` | `[]` | Libellés des valeurs choisies. |
| `maxVisibleValues` | `number` | `2` | Nombre maximal de valeurs affichées avant le résumé (« A, B et 2 autres »). |
| `maxValuesLength` | `number` | `32` | Nombre de caractères que peuvent occuper les valeurs affichées avant le résumé. |
| `emptyValuesText` | `string` | `'Choisir…'` | Texte affiché quand aucune valeur n’est choisie. |
| `groupLabel` | `string` | `'Filtre'` | Début du nom accessible de l’étiquette (« Filtre : Assigné à est A, B »). |
| `editFieldLabel` | `string` | `'Modifier le champ :'` | Début du nom accessible du bouton du champ. Le texte visible y est ajouté. |
| `editOperatorLabel` | `string` | `'Modifier la condition :'` | Début du nom accessible du bouton de la condition. |
| `editValuesLabel` | `string` | `'Modifier les valeurs :'` | Début du nom accessible du bouton des valeurs. |
| `removeLabel` | `string` | `'Retirer le filtre'` | Début du nom accessible du bouton × (« Retirer le filtre Assigné à »). |

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model:open-part` | `'field' \| 'operator' \| 'values' \| undefined` | `undefined` | Partie dont le panneau est ouvert. |

### Emplacements (slots)

| Nom | Portée | Description |
|---|---|---|
| `field` | `{ close }` | Contenu du panneau du champ. Sans cet emplacement, le champ est du texte. |
| `operator` | `{ close }` | Contenu du panneau de la condition. |
| `values` | `{ close }` | Contenu du panneau des valeurs. |
| `footer` | `{ part, close }` | Pied fixé du panneau ouvert (« Appliquer »). `part` indique la partie ouverte. |

`close(returnFocus?: boolean)` ferme le panneau ; avec `true`, le focus revient à la partie
qui l’a ouvert. Chaque panneau place le focus sur le choix courant à l’ouverture.

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `remove` | — | Émis au clic sur ×. C’est à l’application de retirer le filtre et de déplacer le focus. |
| `update:openPart` | `DsaasfrFilterChipPart \| undefined` | Émis par `v-model:open-part`. |

## Accessibilité

- L’étiquette est un groupe nommé : « Filtre : Statut est À instruire, Incomplet ». Le nom
  contient toujours la liste complète des valeurs, même résumée à l’écran.
- Chaque partie modifiable est un bouton de [DsaasfrDropdown](/composants/dropdown) :
  « Modifier la condition : est », « Modifier les valeurs : … ». Chaque nom contient le texte
  visible.
- × est un bouton nommé « Retirer le filtre Statut ».
- **À la charge de l’application** : annoncer le nouveau nombre de résultats
  (`role="status"`) et, après le retrait d’une étiquette, déplacer le focus sur l’étiquette
  suivante, ou sur « Filtrer » s’il n’en reste aucune. Sinon, le focus est perdu.
- Apparence d’un tag neutre DSFR découpé en segments. Les parties restent grises et montrent
  leur affordance au survol et à l’ouverture : une étiquette bleue se lirait comme une seule
  action.
- Sous 62em, le texte n’est jamais coupé : l’étiquette passe sur deux rangées (champ,
  condition et × en haut, valeurs en dessous).

## Voir aussi

- [Fiche de décision 0009](/decisions/0009-filters)
- [Recette : filtres d’une liste](/recettes/filtres)
- [DsaasfrDropdown](/composants/dropdown), [DsaasfrToolbar](/composants/toolbar)
