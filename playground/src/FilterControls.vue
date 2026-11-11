<script setup lang="ts">
// App-side search UI for the Dossiers list:
// - page, under the title ("search"): the search bar (reference, applicant, commune),
//   applied on submit;
// - toolbar start: the result count (announced);
// - toolbar end: one button per group of filters — "Communes" (its own modal, up to a whole
//   département), "Instruction", "Projet" (panels) — and "Enregistrer la recherche";
// - first thing in the page ("summary"), right-aligned under the filter buttons: the
//   selected filters (DsaasfrSelectedFilters: one dismissible DSFR tag per filter, "Tout
//   effacer").
// The toolbar row holds a fixed set of controls, so it never overflows with use; the
// selected filters get their own line outside it, with room to wrap.
import { computed, nextTick, ref, watch } from 'vue'
import type { DsaasfrSelectedFilter } from '@dsaasfr/vue'
import CommunesModal from './CommunesModal.vue'
import FilterGroupButton from './FilterGroupButton.vue'
import { dossiers } from './fakeData'
import { applied, clearFilters, fieldLabel, fields, filteredDossiers, groups, removalNote, removeFilter, searchText } from './filters'

defineProps<{ area: 'search' | 'start' | 'end' | 'summary' }>()

const total = dossiers.length
const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`
const filtering = computed(() => !!applied.length || !!searchText.value)
const count = computed(() =>
  filtering.value ? `${plural(filteredDossiers.value.length)} sur ${total}` : plural(total))


// Search bar: a draft, applied on submit (Enter or the button), like the filters.
const query = ref(searchText.value)
watch(searchText, (text) => {
  query.value = text
})
function search() {
  searchText.value = query.value.trim()
}

// Selected filters: one tag per filter in use (the search text stays in its field).
const selected = computed<DsaasfrSelectedFilter[]>(() =>
  applied.map(f => ({ key: f.field, label: fieldLabel(f.field), values: f.values })))

// No tag left: focus goes back to the button of the group the last filter came from
// ("Tout effacer": the first group), instead of falling on <body>.
let lastGroup = groups[0]!.key
function remove(key: string) {
  lastGroup = fields.find(f => f.key === key)!.group
  removeFilter(key)
}
function clear() {
  lastGroup = groups[0]!.key
  clearFilters()
}
async function focusGroup() {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-filter-group="${lastGroup}"] button`)?.focus()
}

const filterGroups = computed(() => groups.filter(g => g.key !== 'communes'))
</script>

<template>
  <!-- Page, under the title: search bar -->
  <div
    v-if="area === 'search'"
    class="fr-grid-row fr-mb-3w"
  >
    <DsfrSearchBar
      id="recherche-dossiers"
      v-model="query"
      class="fr-col-12 fr-col-md-8"
      label="Rechercher un dossier"
      placeholder="Référence, demandeur ou commune"
      button-text="Rechercher"
      @search="search"
    />
  </div>

  <!-- Toolbar start: result count (announced) -->
  <p
    v-else-if="area === 'start'"
    class="fr-text--sm fr-mb-0"
    role="status"
  >
    <span class="fr-sr-only">{{ removalNote }}</span>{{ count }}
  </p>

  <!-- Toolbar end: one button per group of filters, then save -->
  <template v-else-if="area === 'end'">
    <CommunesModal />
    <FilterGroupButton
      v-for="group in filterGroups"
      :key="group.key"
      :group="group"
    />
    <!-- Saves the current search (text, communes, filters) — demo: does nothing. In a real
         app, it stores the search URL in the database, listed in "Mes recherches". -->
    <DsfrButton
      label="Enregistrer la recherche"
      icon="fr-icon-save-line"
      tertiary
      size="sm"
    />
  </template>

  <!-- First thing in the page, right-aligned under the filter buttons: selected filters -->
  <DsaasfrSelectedFilters
    v-else-if="selected.length"
    class="fr-mb-3w playground-selected"
    align="end"
    :items="selected"
    @remove="remove"
    @clear="clear"
    @empty="focusGroup"
  />
</template>

<style scoped>
/* Close under the filter buttons: 1w from the toolbar instead of the page's 3w padding. */
.playground-selected {
  margin-top: calc(-1 * var(--dsaasfr-space-2w));
}
</style>
