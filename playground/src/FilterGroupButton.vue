<script setup lang="ts">
// One toolbar button per group of filters (Instruction, Projet…): it opens a panel with
// only the fields of that group, applied on demand ("Afficher N dossiers"). Shorter and
// more predictable than one panel with every filter. The button shows how many filters of
// the group are in use: "Instruction (2)".
import { computed, reactive, ref, watch } from 'vue'
import { applied, applyGroup, countResults, facetCount, fieldsOf, filtersOf, selectionOf, valuesOf } from './filters'
import type { GroupDef } from './filters'

const props = defineProps<{ group: GroupDef }>()

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`
const groupFields = computed(() => fieldsOf(props.group.key))
const inUse = computed(() => applied.filter(f => groupFields.value.some(g => g.key === f.field)).length)

const open = ref(false)
const draft = reactive<Record<string, string[]>>(selectionOf([], props.group.key))
watch(open, (isOpen) => {
  if (isOpen) Object.assign(draft, selectionOf(applied, props.group.key))
})
const draftCount = computed(() => Object.values(draft).reduce((n, v) => n + v.length, 0))
/** The search if this panel were applied: other groups' filters + this draft. */
const preview = computed(() => [
  ...applied.filter(f => !groupFields.value.some(g => g.key === f.field)),
  ...filtersOf(draft),
])
const results = computed(() => countResults(preview.value))
/** Values with their faceted count; values that would return nothing are disabled. */
const options = (fieldKey: string) => valuesOf(fieldKey).map((v, i) => {
  const n = facetCount(preview.value, fieldKey, v)
  const id = `filtre-${fieldKey}-${i}` // an index: values contain spaces, ids cannot (RGAA 8.2)
  return { label: `${v} (${n})`, value: v, name: `filtre-${fieldKey}`, id, disabled: n === 0 && !draft[fieldKey]!.includes(v) }
})

function apply(close: (returnFocus?: boolean) => void) {
  applyGroup(props.group.key, draft)
  close(true)
}
function reset() {
  for (const f of groupFields.value) draft[f.key] = []
}
</script>

<template>
  <DsaasfrDropdown
    v-model:open="open"
    :data-filter-group="group.key"
    placement="bottom-end"
    autofocus
    :trigger-class="`fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left ${group.icon}`"
    :trigger-label="inUse ? `${group.label} (${inUse}), ${inUse} filtre${inUse > 1 ? 's' : ''} actif${inUse > 1 ? 's' : ''}` : undefined"
  >
    <template #trigger>
      {{ group.label }}<template v-if="inUse">
        ({{ inUse }})
      </template>
    </template>
    <template #default>
      <div class="fr-px-2w fr-pt-1w">
        <DsfrCheckboxSet
          v-for="field in groupFields"
          :key="field.key"
          v-model="draft[field.key]"
          :legend="field.label"
          small
          :options="options(field.key)"
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
        @click="reset"
      />
      <!-- Preview of the result before applying (one count query on a real server). -->
      <DsfrButton
        :label="`Afficher ${plural(results)}`"
        size="sm"
        @click="apply(close)"
      />
    </template>
  </DsaasfrDropdown>
</template>
