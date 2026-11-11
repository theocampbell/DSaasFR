<script setup lang="ts">
// "Communes" button + modal: communes are chosen in a DsfrModal
// opened directly from a toolbar button, next to "Filtrer". One layer, the standard DSFR
// modal pattern, room for the search. Same search state as the other filters: the URL
// and saved searches do not change. The list inside is DsaasfrSearchableCheckboxSet: plain
// checkboxes for a small perimeter, search for the whole département.
import { computed, ref, useTemplateRef } from 'vue'
import { applied, applyFilter, countResults, facetCount, valuesOf } from './filters'

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`

const chosen = computed(() => applied.find(f => f.field === 'commune')?.values ?? [])
/** The button shows how many communes are chosen, like the other groups: "Communes (3)".
 * Which ones is in the selected filters, under the buttons. */
const buttonLabel = computed(() => (chosen.value.length ? `Communes (${chosen.value.length})` : 'Communes'))
const buttonName = computed(() => {
  const n = chosen.value.length
  return n ? `Communes (${n}), ${n} commune${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}` : undefined
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
const results = computed(() => countResults([...others.value, ...(draft.value.length ? [{ field: 'commune', values: draft.value }] : [])]))

function apply() {
  applyFilter('commune', draft.value)
  opened.value = false
}

// DsfrModal gives focus back to `origin` when it closes.
const trigger = useTemplateRef<HTMLElement>('trigger')
const origin = { focus: () => trigger.value?.querySelector('button')?.focus() }
</script>

<template>
  <span
    ref="trigger"
    data-filter-group="communes"
  >
    <DsfrButton
      :label="buttonLabel"
      :aria-label="buttonName"
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
    <!-- Fixed height: the modal keeps its size while search results appear (the list
         scrolls inside, the buttons stay in place). -->
    <div class="communes-modal__list">
      <DsaasfrSearchableCheckboxSet
        v-model="draft"
        label="Commune"
        :options="options"
      />
    </div>
  </DsfrModal>
</template>

<style scoped>
.communes-modal__list {
  height: var(--dsaasfr-modal-list-height);
  overflow-y: auto;

  /* Room for the DSFR focus ring, which the scrolling box would otherwise clip; the
     negative margin keeps the content aligned with the modal title. */
  margin: calc(-1 * var(--dsaasfr-space-1v));
  padding: var(--dsaasfr-space-1v);
}
</style>
