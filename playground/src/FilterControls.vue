<script setup lang="ts">
// App-side search UI for the Dossiers list:
// - toolbar start: search bar (reference, applicant, commune), applied on submit;
// - toolbar end: one button per group of filters — "Communes" (its own modal, up to a whole
//   département), "Instruction", "Projet" (panels) — and "Enregistrer la recherche";
// - above the table ("summary"): result count + the selected filters
//   (DsaasfrSelectedFilters: one dismissible DSFR tag per filter) + "Tout effacer".
// The controls live in the toolbar (one row, never wrapping with use); the current search
// gets its own line, with room to wrap.
import { computed, nextTick, ref, watch } from 'vue'
import type { DsaasfrSelectedFilter } from '@dsaasfr/vue'
import CommunesModal from './CommunesModal.vue'
import FilterGroupButton from './FilterGroupButton.vue'
import { dossiers } from './fakeData'
import { applied, clearSearch, fieldLabel, filteredDossiers, groups, removeFilter, searchText } from './filters'

defineProps<{ area: 'start' | 'end' | 'summary' }>()

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

// Selected filters: the search text first, then each filter in use.
const selected = computed<DsaasfrSelectedFilter[]>(() => [
  ...(searchText.value ? [{ key: 'recherche', label: 'Recherche', values: [`« ${searchText.value} »`] }] : []),
  ...applied.map(f => ({ key: f.field, label: fieldLabel(f.field), values: f.values })),
])
function remove(key: string) {
  if (key === 'recherche') searchText.value = ''
  else removeFilter(key)
}
// No filter left: focus goes to the search field (the tags and "Tout effacer" are gone).
async function focusSearch() {
  await nextTick()
  document.querySelector<HTMLInputElement>('#recherche-dossiers input, input#recherche-dossiers')?.focus()
}

const filterGroups = computed(() => groups.filter(g => g.key !== 'communes'))
</script>

<template>
  <!-- Toolbar start: search bar -->
  <DsfrSearchBar
    v-if="area === 'start'"
    id="recherche-dossiers"
    v-model="query"
    class="playground-search"
    label="Rechercher un dossier"
    placeholder="Référence, demandeur ou commune"
    button-text="Rechercher"
    @search="search"
  />

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

  <!-- Above the table: count (announced) + selected filters -->
  <DsaasfrSelectedFilters
    v-else
    class="fr-mb-2w"
    :items="selected"
    @remove="remove"
    @clear="clearSearch"
    @empty="focusSearch"
  >
    <p
      class="fr-text--sm fr-mb-0"
      role="status"
    >
      {{ count }}
    </p>
  </DsaasfrSelectedFilters>
</template>

<style scoped>
/* The search bar takes the room left in the toolbar row. */
.playground-search {
  flex: 1 1 18rem;
  min-width: 0;
}
</style>
