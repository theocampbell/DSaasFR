<script setup lang="ts">
// Variant "Communes" button + modal (demo switch): communes are chosen in a DsfrModal
// opened directly from a toolbar button, next to "Filtrer". One layer, the standard DSFR
// modal pattern, room for the search. Same search state as the other filters: the URL
// and saved searches do not change. The list inside is DsaasfrSearchableCheckboxSet: plain
// checkboxes for a small perimeter, search for the whole département.
import { computed, ref, useTemplateRef } from 'vue'
import { applied, applyFilter, countResults, facetCount, valuesOf } from './filters'

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`

const chosen = computed(() => applied.find(f => f.field === 'commune')?.values ?? [])
/** The button shows the selection: "Communes", "Communes : Lacanau", "Communes : Lacanau et 2 autres". */
const buttonLabel = computed(() => {
  const [first, ...rest] = chosen.value
  if (!first) return 'Communes'
  return rest.length ? `Communes : ${first} et ${rest.length} autre${rest.length > 1 ? 's' : ''}` : `Communes : ${first}`
})

const opened = ref(false)
const draft = ref<string[]>([])
function open() {
  draft.value = [...chosen.value]
  opened.value = true
}

// Counts combined with the other applied filters; communes that would return nothing are
// disabled (and listed after the others), unless already chosen.
const others = computed(() => applied.filter(f => f.field !== 'commune'))
const options = computed(() => valuesOf('commune').map((v) => {
  const n = facetCount(others.value, 'commune', v)
  return { value: v, label: `${v} (${n})`, searchText: v, disabled: n === 0 && !draft.value.includes(v) }
}))
const results = computed(() => countResults([...others.value, ...(draft.value.length ? [{ field: 'commune', operator: 'is' as const, values: draft.value }] : [])]))

function apply() {
  applyFilter('commune', 'is', draft.value)
  opened.value = false
}

// DsfrModal gives focus back to `origin` when it closes.
const trigger = useTemplateRef<HTMLElement>('trigger')
const origin = { focus: () => trigger.value?.querySelector('button')?.focus() }
</script>

<template>
  <span ref="trigger">
    <DsfrButton
      :label="buttonLabel"
      icon="fr-icon-map-pin-2-line"
      secondary
      size="sm"
      aria-haspopup="dialog"
      @click="open"
    />
  </span>
  <DsfrModal
    :opened="opened"
    title="Communes"
    :origin="origin"
    :actions="[
      { label: draft.length ? `Afficher ${plural(results)}` : 'Afficher tous les dossiers', onClick: apply },
      { label: 'Annuler', secondary: true, onClick: () => (opened = false) },
    ]"
    @close="opened = false"
  >
    <DsaasfrSearchableCheckboxSet
      v-model="draft"
      label="Commune"
      :options="options"
    />
  </DsfrModal>
</template>
