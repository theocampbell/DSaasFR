<script setup lang="ts">
// App-side filter UI for the Dossiers list, built from the library's DsaasfrFilterChip +
// DsaasfrDropdown:
// - toolbar end: "Filtrer" opens every field with its values; nothing changes until
//   "Appliquer les filtres";
// - toolbar start: one chip per applied field. The field is fixed (one chip per field);
//   condition and values open a panel with its own "Appliquer"; × removes the filter.
// Every panel works on a draft: closing it without applying discards the changes.
// Long lists (communes: over a thousand) use DsaasfrSearchableCheckboxSet in the same
// panels: search, selection, capped results.
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { dossiers } from './fakeData'
import {
  applied, applyFilter, applySelection, availableFirst, clearFilters, countResults, facetCount,
  fieldLabel, fields, filteredDossiers, filtersOf, isLong, operatorLabel, operators, removeFilter,
  selectionOf, valuesOf,
} from './filters'
import type { Operator } from './filters'

defineProps<{ area: 'start' | 'end' }>()

const total = dossiers.length
const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`
const count = computed(() =>
  applied.length ? `${plural(filteredDossiers.value.length)} sur ${total}` : plural(total))

// ── "Filtrer": draft selection of all fields ─────────────────────────────────
const panelOpen = ref(false)
const draft = reactive<Record<string, string[]>>(selectionOf([]))
const draftCount = computed(() => Object.values(draft).reduce((n, v) => n + v.length, 0))
const draftFilters = computed(() => filtersOf(draft))
const draftResults = computed(() => countResults(draftFilters.value))
/** Value options with their faceted count; values that would return nothing are disabled. */
const draftOptions = (fieldKey: string, name: string) => valuesOf(fieldKey).map((v) => {
  const n = facetCount(draftFilters.value, fieldKey, v)
  return { label: `${v} (${n})`, value: v, name, id: `${name}-${v}`, disabled: n === 0 && !draft[fieldKey]!.includes(v) }
})
watch(panelOpen, (open) => {
  if (open) Object.assign(draft, selectionOf(applied))
})
function applyAll(close: (returnFocus?: boolean) => void) {
  applySelection(draft)
  close(true)
}
function resetDraft() {
  Object.assign(draft, selectionOf([]))
}

// ── Chips: draft of the open part ────────────────────────────────────────────
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
const chipFilters = (field: string) => [
  ...applied.filter(f => f.field !== field),
  { field, operator: chipDraft.operator, values: chipDraft.values },
]
const chipResults = (field: string) => countResults(chipFilters(field))
const chipOptions = (field: string) => valuesOf(field).map((v) => {
  const others = applied.filter(f => f.field !== field)
  const n = chipDraft.operator === 'is' ? facetCount(others, field, v) : undefined
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
  if (empty) void focusAfterRemoval(applied.length)
  else close(true)
}

// Removing a chip or clearing all would drop focus on <body>.
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
</script>

<template>
  <!-- Toolbar start: result count (announced) + one chip per applied field -->
  <template v-if="area === 'start'">
    <p
      class="fr-text--sm fr-mb-0"
      role="status"
    >
      {{ count }}
    </p>
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
          <DsaasfrSearchableCheckboxSet
            v-if="isLong(filter.field)"
            v-model="chipDraft.values"
            :label="fieldLabel(filter.field)"
            :options="availableFirst(chipOptions(filter.field))"
          />
          <DsfrCheckboxSet
            v-else
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
    <DsfrButton
      v-if="applied.length"
      label="Tout effacer"
      tertiary
      no-outline
      size="sm"
      @click="clearAll"
    />
  </template>

  <!-- Toolbar end: "Filtrer" = every field with its values, applied on demand -->
  <DsaasfrDropdown
    v-else
    v-model:open="panelOpen"
    data-filter-trigger
    placement="bottom-end"
    autofocus
    trigger-class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line"
    :trigger-label="applied.length ? `Filtrer (${applied.length}), ${applied.length} filtre${applied.length > 1 ? 's' : ''} actif${applied.length > 1 ? 's' : ''}` : undefined"
  >
    <template #trigger>
      Filtrer<template v-if="applied.length">
        ({{ applied.length }})
      </template>
    </template>
    <template #default>
      <div class="fr-px-2w fr-pt-1w">
        <template
          v-for="field in fields"
          :key="field.key"
        >
          <DsaasfrSearchableCheckboxSet
            v-if="field.long"
            v-model="draft[field.key]"
            :label="field.label"
            :options="availableFirst(draftOptions(field.key, `filtre-${field.key}`))"
          />
          <DsfrCheckboxSet
            v-else
            v-model="draft[field.key]"
            :legend="field.label"
            small
            :options="draftOptions(field.key, `filtre-${field.key}`)"
          />
        </template>
      </div>
    </template>
    <template #footer="{ close }">
      <DsfrButton
        label="Réinitialiser"
        tertiary
        no-outline
        size="sm"
        :disabled="!draftCount"
        @click="resetDraft"
      />
      <!-- Preview of the result before applying (one count query on a real server). -->
      <DsfrButton
        :label="draftCount ? `Afficher ${plural(draftResults)}` : `Afficher tous les dossiers`"
        size="sm"
        @click="applyAll(close)"
      />
    </template>
  </DsaasfrDropdown>
</template>
