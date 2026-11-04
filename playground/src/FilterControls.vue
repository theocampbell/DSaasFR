<script setup lang="ts">
// App-side filter UI for the Dossiers list, built from the library's DsaasfrFilterChip +
// DsaasfrDropdown:
// - toolbar end: "Filtrer" opens every field with its values; nothing changes until
//   "Appliquer les filtres";
// - toolbar start: one chip per applied field. The field is fixed (one chip per field);
//   condition and values open a panel with its own "Appliquer"; × removes the filter.
// Every panel works on a draft: closing it without applying discards the changes.
import { computed, nextTick, reactive, ref, watch } from 'vue'
import {
  applied, applyFilter, applySelection, clearFilters, fieldLabel, fields, filteredDossiers,
  operatorLabel, operators, removeFilter, selectionOf, valuesOf,
} from './filters'
import type { Operator } from './filters'

defineProps<{ area: 'start' | 'end' }>()

const total = 40
const count = computed(() =>
  applied.length ? `${filteredDossiers.value.length} dossiers sur ${total}` : `${total} dossiers`)

// ── "Filtrer": draft selection of all fields ─────────────────────────────────
const panelOpen = ref(false)
const draft = reactive<Record<string, string[]>>(selectionOf([]))
const draftCount = computed(() => Object.values(draft).reduce((n, v) => n + v.length, 0))
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
          <DsfrCheckboxSet
            v-model="chipDraft.values"
            :legend="`Valeurs : ${fieldLabel(filter.field)}`"
            small
            :options="valuesOf(filter.field).map(v => ({ label: v, value: v, name: `chip-${filter.field}`, id: `chip-${filter.field}-${v}` }))"
          />
        </div>
      </template>
      <template #footer="{ close }">
        <DsfrButton
          label="Appliquer"
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
        <DsfrCheckboxSet
          v-for="field in fields"
          :key="field.key"
          v-model="draft[field.key]"
          :legend="field.label"
          small
          :options="valuesOf(field.key).map(v => ({ label: v, value: v, name: `filtre-${field.key}`, id: `filtre-${field.key}-${v}` }))"
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
        @click="resetDraft"
      />
      <DsfrButton
        :label="draftCount ? `Appliquer les filtres (${draftCount})` : 'Appliquer les filtres'"
        size="sm"
        @click="applyAll(close)"
      />
    </template>
  </DsaasfrDropdown>
</template>
