<script setup lang="ts">
/**
 * DsaasfrSearchableCheckboxSet — checkboxes for a long list (hundreds or thousands of
 * values, e.g. the communes of a département), to put inside a panel such as a filter
 * chip's dropdown. Composes DsfrInputGroup (search) and DsfrCheckboxSet:
 * - a search field first; on a long list, results show once a few characters are typed;
 * - the selection, always visible (to untick), with "Tout désélectionner";
 * - the results, capped, then "et N autres résultats : précisez la recherche".
 *
 * Lists are only recomputed when the search changes (or the selection changes from
 * outside): ticking a box never moves it, so focus never jumps (RGAA 7.3, 12.8).
 * Not DsfrMultiselect: it is a popup of its own (a popup in the panel's popup) and
 * renders every option. See docs/decisions/0010-long-lists.md.
 */
import { DsfrButton, DsfrCheckboxSet, DsfrInputGroup } from '@gouvminint/vue-dsfr'
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import type { DsaasfrSearchableCheckboxOption, DsaasfrSearchableCheckboxSetProps } from './DsaasfrSearchableCheckboxSet.types'

const props = withDefaults(defineProps<DsaasfrSearchableCheckboxSetProps>(), {
  searchLabel: undefined,
  searchHint: undefined,
  selectedLegend: undefined,
  resultsLegend: undefined,
  maxResults: 50,
  minQueryLength: 2,
  localFilter: true,
  clearText: 'Tout désélectionner',
  resultsCountText: (n: number) => (n ? `${n} résultat${n > 1 ? 's' : ''}` : 'Aucun résultat'),
  noResultsText: 'Aucun résultat : vérifiez l’orthographe ou saisissez une autre partie du nom.',
  moreResultsText: (n: number) => `Et ${n} autre${n > 1 ? 's' : ''} résultat${n > 1 ? 's' : ''} : précisez la recherche.`,
})

/** Selected values. */
const model = defineModel<string[]>({ default: () => [] })
/** Search text (lets the app search on its side with `localFilter: false`). */
const query = defineModel<string>('query', { default: '' })

const uid = useId()
const root = useTemplateRef<HTMLElement>('root')

/** Accents, case, hyphens and apostrophes ignored: "saint medard" finds "Saint-Médard". */
const normalize = (text: string) => text
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[-'’\s]+/g, ' ').trim()

const longList = computed(() => props.options.length > props.maxResults)
const searching = computed(() => normalize(query.value).length >= props.minQueryLength)

// What is shown: value lists, recomputed on purpose only (see header).
const shownSelected = ref<string[]>([])
const shownResults = ref<string[]>([])
const moreCount = ref(0)

function refresh() {
  const selected = new Set(model.value)
  shownSelected.value = [
    ...props.options.filter(o => selected.has(o.value)).map(o => o.value),
    // Selected values the options do not know (e.g. from an older saved search).
    ...model.value.filter(v => !props.options.some(o => o.value === v)),
  ]
  const pool = props.options.filter(o => !selected.has(o.value))
  let matches: DsaasfrSearchableCheckboxOption[]
  if (longList.value && !searching.value) matches = []
  else if (!props.localFilter || !searching.value) matches = pool
  else {
    const q = normalize(query.value)
    const hits = pool.filter(o => normalize(o.label).includes(q))
    // Names starting with the text first ("Lacanau" before "Saint-Lacanau").
    matches = [...hits.filter(o => normalize(o.label).startsWith(q)), ...hits.filter(o => !normalize(o.label).startsWith(q))]
  }
  shownResults.value = matches.slice(0, props.maxResults).map(o => o.value)
  moreCount.value = Math.max(0, matches.length - props.maxResults)
}
refresh()

watch(query, refresh)
// New option values (the app searched on its side, or loaded more): recompute. Labels
// or counts changing alone do not move anything.
watch(() => props.options.map(o => o.value).join('\u0000'), refresh)
// Selection changed from outside (e.g. "Réinitialiser" elsewhere in the panel): recompute.
// From inside (a box ticked here), keep everything in place.
watch(model, () => {
  if (!root.value?.contains(document.activeElement)) refresh()
}, { deep: true })

const byValue = computed(() => new Map(props.options.map((o, i) => [o.value, { option: o, index: i }])))
function checkboxOptions(values: string[], group: 's' | 'r') {
  return values.map((value, i) => {
    const known = byValue.value.get(value)
    const option = known?.option ?? { value, label: value }
    const id = `${uid}-${group}-${known ? known.index : `x${i}`}`
    return {
      id,
      name: `${uid}-${group}`,
      value,
      label: option.label,
      hint: option.hint,
      // A selected value stays untickable even if it now returns nothing.
      disabled: option.disabled && !model.value.includes(value),
    }
  })
}

/** Each group edits its own values and keeps the others (one shared model). */
function groupModel(values: () => string[]) {
  return computed<string[]>({
    get: () => model.value.filter(v => values().includes(v)),
    set: (checked) => {
      const own = new Set(values())
      model.value = [...model.value.filter(v => !own.has(v)), ...checked]
    },
  })
}
const selectedModel = groupModel(() => shownSelected.value)
const resultsModel = groupModel(() => shownResults.value)

const selectedLegend = computed(() => `${props.selectedLegend ?? `${props.label} : sélection`} (${model.value.length})`)
const resultsLegend = computed(() => props.resultsLegend ?? `${props.label} : résultats`)
const searchLabel = computed(() => props.searchLabel ?? `Rechercher : ${props.label}`)
const searchHint = computed(() => props.searchHint
  ?? (longList.value
    ? `${props.options.length.toLocaleString('fr-FR')} choix : saisissez au moins ${props.minQueryLength} caractères du nom.`
    : 'Saisissez une partie du nom pour réduire la liste.'))

// Result count, announced politely once typing pauses (not on every key).
const announcement = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    announcement.value = searching.value || !longList.value
      ? props.resultsCountText(shownResults.value.length + moreCount.value)
      : ''
  }, 500)
})
onBeforeUnmount(() => clearTimeout(timer))

const searchId = `${uid}-search`
async function clearSelection() {
  model.value = []
  await nextTick() // a parent-controlled v-model updates on the next render
  refresh()
  // The selection group (and this button) disappear: go back to the search field.
  document.getElementById(searchId)?.focus()
}
</script>

<template>
  <div
    ref="root"
    class="dsaasfr-searchable-checkbox-set"
  >
    <DsfrInputGroup
      :id="searchId"
      v-model="query"
      type="search"
      autocomplete="off"
      :label="searchLabel"
      label-visible
      :hint="searchHint"
      @keydown.enter.prevent
    />

    <p
      class="fr-sr-only"
      role="status"
    >
      {{ announcement }}
    </p>

    <div
      v-if="shownSelected.length"
      class="dsaasfr-searchable-checkbox-set__selected"
    >
      <DsfrCheckboxSet
        v-model="selectedModel"
        :legend="selectedLegend"
        small
        :options="checkboxOptions(shownSelected, 's')"
      />
      <DsfrButton
        :label="clearText"
        tertiary
        no-outline
        size="sm"
        @click="clearSelection"
      />
    </div>

    <DsfrCheckboxSet
      v-if="shownResults.length"
      v-model="resultsModel"
      :legend="resultsLegend"
      small
      :options="checkboxOptions(shownResults, 'r')"
    />
    <p
      v-else-if="searching"
      class="fr-text--sm fr-mb-2w dsaasfr-searchable-checkbox-set__note"
    >
      {{ noResultsText }}
    </p>
    <p
      v-if="moreCount"
      class="fr-text--sm fr-mb-2w dsaasfr-searchable-checkbox-set__note"
    >
      {{ moreResultsText(moreCount) }}
    </p>
  </div>
</template>

<style scoped>
.dsaasfr-searchable-checkbox-set__selected {
  margin-bottom: var(--dsaasfr-space-1w);
  padding-bottom: var(--dsaasfr-space-1w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

.dsaasfr-searchable-checkbox-set__note {
  color: var(--text-mention-grey);
}
</style>
