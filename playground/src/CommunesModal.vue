<script setup lang="ts">
// The "Communes" filter, built on the library's DsaasfrFilterModal (button with count, DSFR
// modal at page level, fixed height, focus back to the button) and
// DsaasfrSearchableCheckboxSet (plain checkboxes for a small perimeter, search for the whole
// département). This file only holds the data: the draft, the faceted counts, applying.
// Same search state as the other filters: the URL and saved searches do not change.
import { computed, ref, watch } from 'vue'
import { applied, applyFilter, countResults, facetCount, valuesOf } from './filters'

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`
const chosen = computed(() => applied.find(f => f.field === 'commune')?.values ?? [])

// Draft: set from the applied filter when the modal opens, discarded if it closes unapplied.
const open = ref(false)
const draft = ref<string[]>([])
watch(open, (isOpen) => {
  if (isOpen) draft.value = [...chosen.value]
})

// Counts combined with the other applied filters; communes that would return nothing are
// disabled (and listed after the others), unless already chosen.
const others = computed(() => applied.filter(f => f.field !== 'commune'))
const options = computed(() => valuesOf('commune').map((v) => {
  const n = facetCount(others.value, 'commune', v)
  return { value: v, label: `${v} (${n})`, searchText: v, disabled: n === 0 && !draft.value.includes(v) }
}))
const countText = (n: number) => `${n} commune${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}`
const results = computed(() => countResults([...others.value, ...(draft.value.length ? [{ field: 'commune', values: draft.value }] : [])]))
</script>

<template>
  <!-- data-filter-group: focus comes back here when its tag was the last one removed -->
  <span data-filter-group="communes">
    <DsaasfrFilterModal
      v-model:open="open"
      label="Communes"
      icon="fr-icon-map-pin-2-line"
      :count="chosen.length"
      :count-text="countText"
      :apply-label="draft.length ? `Afficher ${plural(results)}` : 'Afficher tous les dossiers'"
      @apply="applyFilter('commune', draft)"
    >
      <DsaasfrSearchableCheckboxSet
        v-model="draft"
        label="Commune"
        :options="options"
      />
    </DsaasfrFilterModal>
  </span>
</template>
