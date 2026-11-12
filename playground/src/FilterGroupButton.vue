<script setup lang="ts">
// One toolbar button per group of filters (Instruction, Projet…), built on the library's
// DsaasfrFilterDropdown: the component handles the button, panel, footer, focus; this file
// only holds the data — the draft of the group's fields, their faceted counts, applying.
import { computed, reactive, ref, watch } from 'vue'
import { applied, applyGroup, countResults, facetCount, fieldsOf, filtersOf, selectionOf, valuesOf } from './filters'
import type { GroupDef } from './filters'

const props = defineProps<{ group: GroupDef }>()

const plural = (n: number) => `${n} dossier${n > 1 ? 's' : ''}`
const groupFields = computed(() => fieldsOf(props.group.key))
const inUse = computed(() => applied.filter(f => groupFields.value.some(g => g.key === f.field)).length)

// Draft: set from the applied filters when the panel opens, discarded if it closes unapplied.
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
/** Values with their faceted count; values that would return nothing are disabled. */
const options = (fieldKey: string) => valuesOf(fieldKey).map((v, i) => {
  const n = facetCount(preview.value, fieldKey, v)
  const id = `filtre-${fieldKey}-${i}` // an index: values contain spaces, ids cannot (RGAA 8.2)
  return { label: `${v} (${n})`, value: v, name: `filtre-${fieldKey}`, id, disabled: n === 0 && !draft[fieldKey]!.includes(v) }
})
</script>

<template>
  <DsaasfrFilterDropdown
    v-model:open="open"
    :data-filter-group="group.key"
    :label="group.label"
    :icon="group.icon"
    :count="inUse"
    :apply-label="`Afficher ${plural(countResults(preview))}`"
    :reset-disabled="!draftCount"
    @apply="applyGroup(group.key, draft)"
    @reset="groupFields.forEach(f => (draft[f.key] = []))"
  >
    <DsfrCheckboxSet
      v-for="field in groupFields"
      :key="field.key"
      v-model="draft[field.key]"
      :legend="field.label"
      small
      :options="options(field.key)"
    />
  </DsaasfrFilterDropdown>
</template>
