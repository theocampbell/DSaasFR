<script setup lang="ts">
// App-side filter UI for the Dossiers list: chips (toolbar start) or the "Filtrer"
// trigger (toolbar end), built from the library's DsaasfrFilterChip + DsaasfrDropdown.
import { computed, nextTick } from 'vue'
import {
  addFilter, clearFilters, fieldLabel, fields, filteredDossiers, filters, openPart,
  operatorLabel, operators, removeFilter, valuesOf,
} from './filters'
import type { Operator } from './filters'

defineProps<{ area: 'start' | 'end' }>()

const total = 40
const count = computed(() =>
  filters.some(f => f.values.length) ? `${filteredDossiers.value.length} dossiers sur ${total}` : `${total} dossiers`)

const chipOpenPart = (id: number) => (openPart.value?.id === id ? openPart.value.part : undefined)
function setChipOpenPart(id: number, part: 'field' | 'operator' | 'values' | undefined) {
  openPart.value = part ? { id, part } : (openPart.value?.id === id ? undefined : openPart.value)
}

// Removing a chip or clearing all would drop focus on <body>: move it to "Filtrer".
async function focusFilterTrigger() {
  await nextTick()
  document.querySelector<HTMLElement>('[data-filter-trigger] > button')?.focus()
}
// After removing a chip: focus the next chip (or the previous one), else "Filtrer".
async function remove(id: number) {
  const index = filters.findIndex(f => f.id === id)
  removeFilter(id)
  await nextTick()
  const chips = document.querySelectorAll<HTMLElement>('.dsaasfr-filter-chip')
  const target = chips[Math.min(index, chips.length - 1)]?.querySelector<HTMLElement>('button')
  if (target) target.focus()
  else void focusFilterTrigger()
}
function clearAll() {
  clearFilters()
  void focusFilterTrigger()
}

function changeField(id: number, key: string, close: () => void) {
  const filter = filters.find(f => f.id === id)!
  // Re-picking the current field keeps its values.
  if (filter.field === key) {
    close()
    return
  }
  filter.field = key
  filter.values = []
  close()
  openPart.value = { id, part: 'values' }
}
</script>

<template>
  <!-- Toolbar start: result count (announced) + active filters -->
  <template v-if="area === 'start'">
    <p
      class="fr-text--sm fr-mb-0"
      role="status"
    >
      {{ count }}
    </p>
    <DsaasfrFilterChip
      v-for="filter in filters"
      :key="filter.id"
      :field="fieldLabel(filter.field)"
      :operator="operatorLabel(filter.operator)"
      :values="filter.values"
      :open-part="chipOpenPart(filter.id)"
      @update:open-part="setChipOpenPart(filter.id, $event)"
      @remove="remove(filter.id)"
    >
      <template #field="{ close }">
        <ul
          class="playground-options"
          aria-label="Champ"
        >
          <li
            v-for="field in fields"
            :key="field.key"
          >
            <!-- Current field: announced (aria-current) and shown (check icon). -->
            <button
              type="button"
              class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
              :class="field.key === filter.field ? 'fr-btn--icon-right fr-icon-check-line' : ''"
              :aria-current="field.key === filter.field ? 'true' : undefined"
              @click="changeField(filter.id, field.key, close)"
            >
              {{ field.label }}
            </button>
          </li>
        </ul>
      </template>
      <template #operator>
        <div class="fr-px-2w fr-pt-1w">
          <DsfrRadioButtonSet
            :name="`operateur-${filter.id}`"
            legend="Condition"
            small
            :model-value="filter.operator"
            :options="operators.map(o => ({ label: o.label, value: o.value }))"
            @update:model-value="(v: string | number | boolean | undefined) => (filter.operator = v as Operator)"
          />
        </div>
      </template>
      <template #values>
        <div class="fr-px-2w fr-pt-1w">
          <DsfrCheckboxSet
            v-model="filter.values"
            :legend="`Valeurs : ${fieldLabel(filter.field)}`"
            small
            :options="valuesOf(filter.field).map(v => ({ label: v, value: v, name: `valeurs-${filter.id}`, id: `valeur-${filter.id}-${v}` }))"
          />
        </div>
      </template>
    </DsaasfrFilterChip>
    <DsfrButton
      v-if="filters.length"
      label="Tout effacer"
      tertiary
      no-outline
      size="sm"
      @click="clearAll"
    />
  </template>

  <!-- Toolbar end: "Filtrer" opens the list of fields -->
  <DsaasfrDropdown
    v-else
    data-filter-trigger
    placement="bottom-end"
    autofocus
    trigger-class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line"
  >
    <template #trigger>
      Filtrer
    </template>
    <template #default="{ close }">
      <ul
        class="playground-options"
        aria-label="Ajouter un filtre"
      >
        <li
          v-for="field in fields"
          :key="field.key"
        >
          <button
            type="button"
            class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
            @click="close(); addFilter(field.key)"
          >
            {{ field.label }}
          </button>
        </li>
      </ul>
    </template>
  </DsaasfrDropdown>
</template>

<style scoped>
.playground-options {
  margin: 0;
  padding: 0;
  list-style: none;
}

.playground-options > li {
  padding: 0;
}

.playground-options .fr-btn {
  width: 100%;
  max-width: none;
}
</style>
