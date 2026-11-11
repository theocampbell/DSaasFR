# Filtres d’une liste

Cette recette décrit le motif de filtres du bac à sable (page « Dossiers ») : un bouton
« Filtrer » qui ouvre tous les champs, une étiquette par filtre appliqué, des nombres de
résultats par valeur, et un nombre de résultats annoncé. Le code est une version simplifiée
de `playground/src/filters.ts` et `playground/src/FilterControls.vue`.

<Example story="briques-dsaasfrfilterchip--editable" title="étiquette de filtre modifiable" :height="320" />

## Ce que fournit la bibliothèque, ce que fait l’application

| Bibliothèque DSaaSFR | Votre application |
|---|---|
| [DsaasfrToolbar](/composants/toolbar) : la ligne, `start` et `end` | La liste des champs, des conditions et des valeurs |
| [DsaasfrDropdown](/composants/dropdown) : bouton, panneau, Échap, focus, position, pied fixé | Le brouillon de chaque panneau et le bouton « Appliquer » |
| [DsaasfrFilterChip](/composants/filter-chip) : affichage d’un filtre, noms accessibles, événement `remove` | Les filtres appliqués et la requête au serveur |
| [DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set) : recherche et cases à cocher pour une liste longue | Toutes les valeurs possibles (par exemple les communes du département) et leur ordre |
| `DsfrCheckboxSet`, `DsfrRadioButtonSet`, `DsfrButton` (Vue DSFR) | Les nombres de résultats, l’annonce `role="status"`, le focus après un retrait |

La bibliothèque ne sait rien de vos données. Tout ce qui suit sous « application » est du code
à écrire dans votre projet.

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
requête de comptage, plus légère que la requête de la liste.

## Le motif

```
┌─ DsaasfrToolbar ───────────────────────────────────────────────────────────────┐
│ start                                                       end                │
│ 16 dossiers sur 40  [Statut · est · À instruire ×]  Tout effacer  [Filtrer (1)] │
└────────────────────────────────────────────────────────────────────────────────┘
```

- **« Filtrer »** (`end`) ouvre tous les champs, chacun avec ses valeurs en cases à cocher.
  Le pied propose « Réinitialiser » et « Afficher N dossiers ». Le bouton affiche le nombre
  de filtres actifs : « Filtrer (1) ».
- **Une étiquette par champ filtré** (`start`), dans l’ordre des champs. Le champ n’est pas
  modifiable sur l’étiquette (cela pourrait créer un doublon). La condition et les valeurs
  ouvrent chacune un panneau avec son propre bouton d’application. × retire le filtre tout
  de suite.
- **« Tout effacer »** retire tous les filtres.
- Le **nombre de résultats** est annoncé aux lecteurs d’écran à chaque changement.

## 1. Le modèle de filtres (application)

Un module qui décrit les champs et garde les filtres appliqués. Dans le bac à sable, les
données sont en mémoire ; dans votre application, `countResults` et `facetCount` sont des
appels à votre API.

```ts
// src/dossiers/filters.ts
import { reactive } from 'vue'

export interface FieldDef { key: string, label: string }
export const fields: FieldDef[] = [
  { key: 'statut', label: 'Statut' },
  { key: 'type', label: 'Type' },
  { key: 'commune', label: 'Commune' },
]

export const operators = [
  { value: 'is', label: 'est' },
  { value: 'is-not', label: 'n’est pas' },
] as const
export type Operator = typeof operators[number]['value']

/** Un filtre par champ au plus. */
export interface Filter { field: string, operator: Operator, values: string[] }

export const fieldLabel = (key: string) => fields.find(f => f.key === key)!.label
export const operatorLabel = (op: Operator) => operators.find(o => o.value === op)!.label

/** Valeurs possibles d’un champ (fournies par le serveur). */
export declare function valuesOf(fieldKey: string): string[]

/** Filtres appliqués, dans l’ordre des champs : c’est ce qu’utilise la requête de la liste. */
export const applied = reactive<Filter[]>([])

/** Remplace les filtres appliqués à partir d’une sélection champ → valeurs. */
export function applySelection(selection: Record<string, string[]>) {
  const next = fields
    .filter(f => selection[f.key]?.length)
    .map(f => ({
      field: f.key,
      operator: applied.find(a => a.field === f.key)?.operator ?? 'is',
      values: selection[f.key]!,
    }))
  applied.splice(0, applied.length, ...next)
}

/** Applique le brouillon d’une étiquette ; sans valeur, le filtre est retiré. */
export function applyFilter(field: string, operator: Operator, values: string[]) {
  const index = applied.findIndex(f => f.field === field)
  if (!values.length) applied.splice(index, 1)
  else applied.splice(index, 1, { field, operator, values })
}

export function removeFilter(field: string) {
  applied.splice(applied.findIndex(f => f.field === field), 1)
}

export function clearFilters() {
  applied.splice(0)
}

/** Sélection champ → valeurs, pour initialiser un brouillon. */
export const selectionOf = (filters: Filter[]) =>
  Object.fromEntries(fields.map(f => [f.key, [...(filters.find(a => a.field === f.key)?.values ?? [])]]))

/** Nombre de résultats pour des filtres donnés (requête de comptage côté serveur). */
export declare function countResults(filters: Filter[]): number

/**
 * Nombre de résultats que donnerait `value` pour `field`, combiné aux filtres des autres
 * champs (« facettes », renvoyées par le moteur de recherche avec les résultats).
 */
export function facetCount(filters: Filter[], field: string, value: string) {
  const others = filters.filter(f => f.field !== field)
  return countResults([...others, { field, operator: 'is', values: [value] }])
}
```

Les fonctions `declare` sont à implémenter selon votre API. Dans une application réelle, ces
comptages sont asynchrones : gardez leurs résultats dans des `ref` mis à jour quand le
brouillon change, plutôt que de les appeler dans le template.

## 2. Le bouton « Filtrer » (application)

Un `DsaasfrDropdown` dans `end`. Le panneau travaille sur un **brouillon**, copié des filtres
appliqués à l’ouverture. Rien ne change dans la liste avant « Afficher N dossiers ».

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { applied, applySelection, countResults, facetCount, fields, selectionOf, valuesOf } from './filters'
import type { Filter } from './filters'

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`

const panelOpen = ref(false)
const draft = reactive<Record<string, string[]>>(selectionOf([]))
const draftCount = computed(() => Object.values(draft).reduce((n, v) => n + v.length, 0))
// Le brouillon garde les conditions déjà appliquées (« n’est pas » reste « n’est pas »).
const draftFilters = computed<Filter[]>(() =>
  fields.filter(f => draft[f.key]?.length).map(f => ({
    field: f.key,
    operator: applied.find(a => a.field === f.key)?.operator ?? 'is',
    values: draft[f.key]!,
  })))
const draftResults = computed(() => countResults(draftFilters.value))

// À chaque ouverture, le brouillon repart des filtres appliqués.
watch(panelOpen, (open) => {
  if (open) Object.assign(draft, selectionOf(applied))
})

/** Options avec leur nombre de résultats ; les valeurs qui ne donneraient rien sont désactivées. */
const draftOptions = (fieldKey: string) => valuesOf(fieldKey).map((v) => {
  const n = facetCount(draftFilters.value, fieldKey, v)
  return {
    label: `${v} (${n})`,
    value: v,
    name: `filtre-${fieldKey}`,
    id: `filtre-${fieldKey}-${v}`,
    disabled: n === 0 && !draft[fieldKey]!.includes(v),
  }
})

function applyAll(close: (returnFocus?: boolean) => void) {
  applySelection(draft)
  close(true)
}

// « Filtrer (2), 2 filtres actifs » : le nom accessible commence par le texte visible.
const triggerLabel = computed(() => {
  const n = applied.length
  return n ? `Filtrer (${n}), ${n} filtre${n > 1 ? 's' : ''} actif${n > 1 ? 's' : ''}` : undefined
})
</script>

<template>
  <DsaasfrDropdown
    v-model:open="panelOpen"
    data-filter-trigger
    placement="bottom-end"
    autofocus
    trigger-class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line"
    :trigger-label="triggerLabel"
  >
    <template #trigger>
      Filtrer<template v-if="applied.length"> ({{ applied.length }})</template>
    </template>

    <template #default>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrCheckboxSet
          v-for="field in fields"
          :key="field.key"
          v-model="draft[field.key]"
          :legend="field.label"
          small
          :options="draftOptions(field.key)"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <DsfrButton
        label="Réinitialiser"
        tertiary
        no-outline
        size="sm"
        :disabled="!draftCount"
        @click="Object.assign(draft, selectionOf([]))"
      />
      <DsfrButton
        :label="draftCount ? `Afficher ${plural(draftResults)}` : 'Afficher tous les dossiers'"
        size="sm"
        @click="applyAll(close)"
      />
    </template>
  </DsaasfrDropdown>
</template>
```

Points d’attention :

- **Nombres par valeur (facettes).** Chaque case affiche le nombre de résultats qu’elle
  donnerait, combinée aux autres champs : « Incomplet (4) ». Une valeur qui ne donnerait aucun
  résultat est désactivée, sauf si elle est déjà cochée (l’utilisateur doit pouvoir la
  décocher).
- **Le nombre de filtres** est dans le texte du bouton (« Filtrer (2) ») et dans son nom
  accessible, qui contient le texte visible.
- `autofocus` place le focus sur la première case cochée, sinon sur la première case.
- `close(true)` rend le focus au bouton « Filtrer » après l’application.

## 3. Une étiquette par filtre (application)

Dans `start`, une `DsaasfrFilterChip` par filtre appliqué. Le champ est du texte (pas
d’emplacement `field`) ; la condition et les valeurs ont chacune un panneau. Une seule
étiquette est ouverte à la fois : son brouillon est copié du filtre à l’ouverture.

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { applied, applyFilter, countResults, facetCount, fieldLabel, operatorLabel, operators, valuesOf } from './filters'
import type { Operator } from './filters'

type Part = 'field' | 'operator' | 'values'
const openChip = ref<{ field: string, part: Part }>()
const chipDraft = reactive<{ operator: Operator, values: string[] }>({ operator: 'is', values: [] })

function setOpenPart(field: string, part: Part | undefined) {
  if (part) {
    const filter = applied.find(f => f.field === field)!
    chipDraft.operator = filter.operator
    chipDraft.values = [...filter.values]
    openChip.value = { field, part }
  }
  else if (openChip.value?.field === field) {
    openChip.value = undefined
  }
}

const chipResults = (field: string) => countResults([
  ...applied.filter(f => f.field !== field),
  { field, operator: chipDraft.operator, values: chipDraft.values },
])

const chipOptions = (field: string) => valuesOf(field).map((v) => {
  // Facettes seulement pour « est » : pour « n’est pas », le nombre par valeur n’a pas de sens.
  const n = chipDraft.operator === 'is' ? facetCount(applied.filter(f => f.field !== field), field, v) : undefined
  return {
    label: n === undefined ? v : `${v} (${n})`,
    value: v,
    name: `chip-${field}`,
    id: `chip-${field}-${v}`,
    disabled: n === 0 && !chipDraft.values.includes(v),
  }
})

function applyChip(field: string, close: (returnFocus?: boolean) => void) {
  const empty = !chipDraft.values.length
  applyFilter(field, chipDraft.operator, chipDraft.values)
  // Sans valeur, le filtre disparaît : le focus doit aller ailleurs (étape 5).
  if (empty) void focusAfterRemoval(applied.length)
  else close(true)
}
</script>

<template>
  <DsaasfrFilterChip
    v-for="filter in applied"
    :key="filter.field"
    :field="fieldLabel(filter.field)"
    :operator="operatorLabel(filter.operator)"
    :values="filter.values"
    :open-part="openChip?.field === filter.field ? openChip.part : undefined"
    @update:open-part="setOpenPart(filter.field, $event)"
    @remove="remove(filter.field)"
  >
    <template #operator>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrRadioButtonSet
          v-model="chipDraft.operator"
          :name="`operateur-${filter.field}`"
          :legend="`Condition : ${fieldLabel(filter.field)}`"
          small
          :options="operators.map(o => ({ label: o.label, value: o.value }))"
        />
      </div>
    </template>

    <template #values>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrCheckboxSet
          v-model="chipDraft.values"
          :legend="`Valeurs : ${fieldLabel(filter.field)}`"
          small
          :options="chipOptions(filter.field)"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <DsfrButton
        :label="chipDraft.values.length ? `Afficher ${plural(chipResults(filter.field))}` : 'Retirer le filtre'"
        size="sm"
        @click="applyChip(filter.field, close)"
      />
    </template>
  </DsaasfrFilterChip>

  <DsfrButton v-if="applied.length" label="Tout effacer" tertiary no-outline size="sm" @click="clearAll" />
</template>
```

Si l’utilisateur décoche toutes les valeurs, le bouton du pied devient « Retirer le
filtre » : le résultat de l’action est toujours écrit sur le bouton.

`plural` est défini à l’étape 2, `remove`, `clearAll` et `focusAfterRemoval` à l’étape 5.
Dans le bac à sable, tout ce code est dans le même composant.

## 4. Le nombre de résultats (application)

Placez le nombre de résultats au début de `start`, dans un élément `role="status"`. Les
lecteurs d’écran annoncent son nouveau texte à chaque application, sans déplacer le focus.

```vue
<script setup lang="ts">
const count = computed(() =>
  applied.length ? `${plural(resultCount.value)} sur ${total}` : plural(total))
</script>

<template>
  <p class="fr-text--sm fr-mb-0" role="status">{{ count }}</p>
</template>
```

`resultCount` est le nombre renvoyé par la requête de la liste, `total` le nombre sans
filtre : « 16 dossiers sur 40 ».

Prévoyez aussi un message quand aucun résultat ne correspond, à la place du tableau :
« Aucun dossier ne correspond à ces filtres. »

## 5. Le focus après un retrait (application)

Quand une étiquette disparaît (× ou « Tout effacer »), le bouton qui avait le focus n’existe
plus et le focus retomberait sur `<body>`. Déplacez-le :

- après le retrait d’une étiquette, sur l’étiquette qui prend sa place, ou la précédente
  s’il s’agissait de la dernière ;
- s’il ne reste aucune étiquette, ou après « Tout effacer », sur « Filtrer ».

```ts
import { nextTick } from 'vue'
import { applied, clearFilters, removeFilter } from './filters'

async function focusAfterRemoval(index: number) {
  await nextTick()
  const chips = document.querySelectorAll<HTMLElement>('.dsaasfr-filter-chip')
  const target = chips[Math.min(index, chips.length - 1)]?.querySelector<HTMLElement>('button')
    ?? document.querySelector<HTMLElement>('[data-filter-trigger] > button')
  target?.focus()
}

function remove(field: string) {
  const index = applied.findIndex(f => f.field === field)
  removeFilter(field)
  void focusAfterRemoval(index)
}

function clearAll() {
  clearFilters()
  void focusAfterRemoval(0)
}
```

`data-filter-trigger` est posé sur le `DsaasfrDropdown` « Filtrer » (étape 2) : l’attribut
arrive sur l’élément racine du composant, qui contient le bouton.

## Champs à beaucoup de valeurs

Quand un champ a des centaines de valeurs (les communes d’un département), gardez-le dans les
filtres, au même endroit que les autres : une recherche enregistrée contient les communes et
les autres filtres ensemble. Remplacez seulement sa liste de cases à cocher, dans le panneau
« Filtrer » et dans celui de son étiquette, par un
[DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set) :

```vue
<DsaasfrSearchableCheckboxSet
  v-if="field.key === 'commune'"
  v-model="draft.commune"
  label="Commune"
  :options="optionsCommune"
/>
<DsfrCheckboxSet v-else v-model="draft[field.key]" :legend="field.label" small :options="…" />
```

Dans le bac à sable, les communes qui ont des dossiers passent devant celles qui n’en ont pas
(désactivées, « (0) »). Voir la [fiche de décision 0010](/decisions/0010-long-lists).

## 6. L’assemblage dans la barre d’outils

Dans le bac à sable, le même composant `FilterControls` est rendu deux fois, avec une prop
`area` : `start` pour le nombre et les étiquettes, `end` pour « Filtrer ». L’état est partagé
par le module `filters.ts`.

```vue
<template #toolbar>
  <DsaasfrToolbar label="Filtres et actions de la liste">
    <template #start>
      <FilterControls area="start" />
    </template>
    <template #end>
      <FilterControls area="end" />
      <DsfrButton label="Exporter" icon="fr-icon-download-line" tertiary size="sm" />
    </template>
  </DsaasfrToolbar>
</template>
```

La liste affichée lit les filtres appliqués (`applied`), jamais les brouillons.

## Vérifier l’accessibilité

- Chaque panneau contient de vrais contrôles : `DsfrCheckboxSet` et `DsfrRadioButtonSet`
  avec une `legend` qui nomme le champ (« Valeurs : Statut »).
- Le nombre de résultats est dans un `role="status"` et change une fois par application.
- Après ×, « Retirer le filtre » ou « Tout effacer », le focus est sur une étiquette ou sur
  « Filtrer », jamais sur `<body>`.
- Le nom accessible de « Filtrer » contient son texte visible, nombre compris.
- Échap ferme chaque panneau sans appliquer et rend le focus à son bouton.
- À 400 % de zoom, les étiquettes passent sur deux rangées et aucun texte n’est coupé.

## Questions ouvertes

La [fiche de décision 0009](/decisions/0009-filters) liste ce qui reste à trancher : garder les
filtres dans l’URL (listes filtrées partageables), rechercher dans les longues listes de
valeurs, signaler le nombre de filtres sur écran étroit.
