<script setup lang="ts">
/**
 * DsaasfrSelectedFilters — the filters in use, above a list of results: one DSFR
 * dismissible tag per filter ("Commune : Pessac et 1 autre ×"), and "Tout effacer".
 *
 * The DSFR presents dismissible tags (fr-tag--dismiss) for selected filters; Vue DSFR's
 * DsfrTag has no dismissible variant, so the official markup is used: a list of buttons,
 * each named "Retirer le filtre …". Simpler than DsaasfrFilterChip (no condition, no
 * editing in place): to change a filter, the user goes back to its button in the toolbar.
 *
 * Presentational: the app removes the filter on `remove` / `clear`. Focus is kept: after a
 * removal it moves to the next tag (or the previous one); when none is left, `empty` is
 * emitted for the app to move focus (e.g. to the search field).
 * See docs/decisions/0009-filters.md.
 */
import { computed, nextTick, useTemplateRef } from 'vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import type { DsaasfrSelectedFilter, DsaasfrSelectedFiltersProps } from './DsaasfrSelectedFilters.types'

const props = withDefaults(defineProps<DsaasfrSelectedFiltersProps>(), {
  maxVisibleValues: 2,
  maxValuesLength: 32,
  listLabel: 'Filtres sélectionnés',
  removeLabel: 'Retirer le filtre',
  clearText: 'Tout effacer',
})

const emit = defineEmits<{ remove: [key: string], clear: [], empty: [] }>()

defineSlots<{
  /** Before the tags, e.g. the result count (role="status", owned by the app). */
  default?: () => unknown
}>()

/** Visible text: as many values as fit, then "et N autres" (one line per tag). */
function shortValues(values: string[]) {
  const shown: string[] = []
  for (const value of values) {
    const next = [...shown, value].join(', ')
    if (shown.length && (shown.length >= props.maxVisibleValues || next.length > props.maxValuesLength)) break
    shown.push(value)
  }
  const rest = values.length - shown.length
  return rest ? `${shown.join(', ')} et ${rest} autre${rest > 1 ? 's' : ''}` : shown.join(', ')
}
/** Accessible name: up to 10 values, then "et N autres" (200 communes are not read out). */
function namedValues(values: string[]) {
  const rest = values.length - 10
  return rest > 0 ? `${values.slice(0, 10).join(', ')} et ${rest} autre${rest > 1 ? 's' : ''}` : values.join(', ')
}

const tags = computed(() => props.items.map((item: DsaasfrSelectedFilter) => ({
  key: item.key,
  text: `${item.label} : ${shortValues(item.values)}`,
  name: `${props.removeLabel} ${item.label} : ${namedValues(item.values)}`,
})))

const list = useTemplateRef<HTMLElement>('list')

// Removing the focused tag would drop focus on <body> (RGAA 12.8).
async function remove(key: string, index: number) {
  emit('remove', key)
  await nextTick()
  const buttons = list.value?.querySelectorAll<HTMLButtonElement>('.fr-tag') ?? []
  const target = buttons[Math.min(index, buttons.length - 1)]
  if (target) target.focus()
  else emit('empty')
}
async function clear() {
  emit('clear')
  await nextTick()
  emit('empty')
}
</script>

<template>
  <div class="dsaasfr-selected-filters">
    <slot />
    <ul
      v-if="tags.length"
      ref="list"
      class="fr-tags-group dsaasfr-selected-filters__list"
      :aria-label="listLabel"
    >
      <li
        v-for="(tag, index) in tags"
        :key="tag.key"
      >
        <button
          type="button"
          class="fr-tag fr-tag--sm fr-tag--dismiss"
          :aria-label="tag.name"
          @click="remove(tag.key, index)"
        >
          {{ tag.text }}
        </button>
      </li>
    </ul>
    <DsfrButton
      v-if="tags.length > 1"
      :label="clearText"
      tertiary
      no-outline
      size="sm"
      @click="clear"
    />
  </div>
</template>

<style scoped>
.dsaasfr-selected-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);
}

/* fr-tags-group spaces its items with bottom margins (for stacked groups): in this line,
   the gap does it. */
.dsaasfr-selected-filters__list.fr-tags-group {
  gap: var(--dsaasfr-space-1w);
  margin: 0;
}

.dsaasfr-selected-filters__list.fr-tags-group > li {
  margin: 0;
  line-height: normal;
}

/* A long value stays inside the line at 320 px (RGAA 10.11): the tag wraps its text. */
.dsaasfr-selected-filters__list .fr-tag {
  max-width: 100%;
  overflow-wrap: anywhere;
}
</style>
