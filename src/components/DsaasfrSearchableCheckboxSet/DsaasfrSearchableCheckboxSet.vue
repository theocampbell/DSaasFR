<script setup lang="ts">
/**
 * DsaasfrSearchableCheckboxSet — checkboxes for a long list (hundreds or thousands of
 * values, e.g. the communes of a département), to put inside a panel such as a filter
 * chip's dropdown. Composes DsfrInputGroup (search) and DsfrCheckboxSet:
 * - the selection first, always visible (to untick), with "Tout désélectionner";
 * - the search field; on a long list, results show once a few characters are typed;
 * - the results right after the field, capped, then "et N autres : précisez la recherche".
 *
 * Lists are only recomputed when the search changes (or the selection changes from
 * outside): ticking never moves a box, so focus never jumps (RGAA 7.3, 12.8).
 * Not DsfrMultiselect: it is a popup of its own (a popup in the panel's popup), renders
 * every option, has no per-option `disabled`. See docs/decisions/0010-long-lists.md.
 */
import { DsfrButton, DsfrCheckboxSet, DsfrInputGroup } from '@gouvminint/vue-dsfr'
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { DsaasfrSearchableCheckboxOption, DsaasfrSearchableCheckboxSetProps } from './DsaasfrSearchableCheckboxSet.types'

const props = withDefaults(defineProps<DsaasfrSearchableCheckboxSetProps>(), {
  searchLabel: undefined,
  searchHint: undefined,
  selectedLegend: undefined,
  resultsLegend: undefined,
  autofocus: false,
  searchThreshold: 12,
  maxResults: 50,
  minQueryLength: 2,
  localFilter: true,
  clearText: 'Tout désélectionner',
  maxVisibleSelected: 5,
  showAllSelectedText: (n: number) => `Afficher toute la sélection (${n})`,
  resultsCountText: (n: number, shown: number) => {
    if (!n) return 'Aucun résultat'
    const count = `${n} résultat${n > 1 ? 's' : ''}`
    return shown < n ? `${count}, ${shown} affichés : précisez la recherche` : count
  },
  noResultsText: 'Aucun résultat : vérifiez l’orthographe ou saisissez une autre partie du nom.',
  alreadySelectedText: 'Aucun autre résultat : ce que vous cherchez est déjà dans la sélection.',
  moreResultsText: (n: number) => `Et ${n} autre${n > 1 ? 's' : ''} résultat${n > 1 ? 's' : ''} : précisez la recherche.`,
})

/** Selected values. */
const model = defineModel<string[]>({ default: () => [] })
/** Search text (lets the app search on its side with `localFilter: false`). */
const query = defineModel<string>('query', { default: '' })

const uid = useId()

/** Accents, case, hyphens and apostrophes ignored: "saint medard" finds "Saint-Médard". */
const normalize = (text: string) => text
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[-'’\s]+/g, ' ').trim()
const searchable = (o: DsaasfrSearchableCheckboxOption) => normalize(o.searchText ?? o.label)

/** Short list (e.g. a perimeter of 10 communes): plain checkboxes, no search. */
const withSearch = computed(() => !props.localFilter || props.options.length > props.searchThreshold)
const longList = computed(() => props.options.length > props.maxResults)
const searching = computed(() => normalize(query.value).length >= props.minQueryLength)

// What is shown: value lists, recomputed on purpose only (see header).
const shownSelected = ref<string[]>([])
const shownResults = ref<string[]>([])
const matchCount = ref(0)
/** Selected values matching the search (to explain an empty result). */
const selectedMatches = ref(0)

function refresh() {
  if (!withSearch.value) {
    shownSelected.value = []
    shownResults.value = props.options.map(o => o.value)
    matchCount.value = props.options.length
    selectedMatches.value = 0
    return
  }
  const selected = new Set(model.value)
  shownSelected.value = [
    ...props.options.filter(o => selected.has(o.value)).map(o => o.value),
    // Selected values the options do not know (e.g. from an older saved search).
    ...model.value.filter(v => !props.options.some(o => o.value === v)),
  ]
  const pool = props.options.filter(o => !selected.has(o.value))
  let matches: DsaasfrSearchableCheckboxOption[]
  selectedMatches.value = 0
  if (longList.value && !searching.value) matches = []
  else if (!props.localFilter || !searching.value) matches = pool
  else {
    const q = normalize(query.value)
    selectedMatches.value = props.options.filter(o => selected.has(o.value) && searchable(o).includes(q)).length
    // Available values first, then names starting with the text ("Lacanau" before
    // "Saint-Lacanau"); the app's order otherwise.
    const rank = (o: DsaasfrSearchableCheckboxOption) => (o.disabled ? 2 : 0) + (searchable(o).startsWith(q) ? 0 : 1)
    matches = pool
      .filter(o => searchable(o).includes(q))
      .map((o, i) => ({ o, i, r: rank(o) }))
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .map(x => x.o)
  }
  shownResults.value = matches.slice(0, props.maxResults).map(o => o.value)
  matchCount.value = matches.length
}
refresh()

watch(query, refresh)
// New option values (the app searched on its side, or loaded more): recompute. Labels,
// counts or order changing alone (e.g. live counts) do not move anything.
watch(() => props.options.map(o => o.value).sort().join('\u0000'), refresh)
// Selection changed from outside (e.g. "Réinitialiser" elsewhere in the panel): recompute.
// Changed here (a box ticked by keyboard or pointer, focused or not): keep everything in place.
let changedHere = false
watch(model, () => {
  if (changedHere) changedHere = false
  else refresh()
}, { deep: true })

/** The focused checkbox never becomes disabled under the user (live counts): focus would be lost. */
const focusedId = ref<string>()
function onFocusIn(event: FocusEvent) {
  focusedId.value = (event.target as HTMLElement).id
}
function onFocusOut() {
  focusedId.value = undefined
}

const byValue = computed(() => new Map(props.options.map((o, i) => [o.value, { option: o, index: i }])))
function checkboxOptions(values: string[], group: 's' | 'r') {
  return values.map((value, i) => {
    const known = byValue.value.get(value)
    const option: DsaasfrSearchableCheckboxOption = known?.option ?? { value, label: value }
    const id = `${uid}-${group}-${known ? known.index : `x${i}`}`
    return {
      id,
      name: `${uid}-${group}`,
      value,
      label: option.label,
      hint: option.hint,
      // Never disabled: the selection (it can always be unticked), what is ticked, what
      // has focus.
      disabled: group === 'r' && !!option.disabled && !model.value.includes(value) && focusedId.value !== id,
    }
  })
}

/** Each group edits its own values and keeps the others (one shared model). */
function groupModel(values: () => string[]) {
  return computed<string[]>({
    get: () => model.value.filter(v => values().includes(v)),
    set: (checked) => {
      const own = new Set(values())
      changedHere = true
      model.value = [...model.value.filter(v => !own.has(v)), ...checked]
    },
  })
}
const selectedModel = groupModel(() => shownSelected.value)

// A long selection (50 communes) is folded after `maxVisibleSelected`, so that the search
// field stays in view. The hidden values stay selected.
const selectionOpen = ref(false)
const visibleSelected = computed(() =>
  selectionOpen.value ? shownSelected.value : shownSelected.value.slice(0, props.maxVisibleSelected))
const hiddenSelected = computed(() => shownSelected.value.length - Math.min(shownSelected.value.length, props.maxVisibleSelected))
const selectedListId = `${uid}-selected`
// Opening reveals values BEFORE the button: focus goes to the first of them (RGAA 12.8).
async function toggleSelection() {
  selectionOpen.value = !selectionOpen.value
  if (!selectionOpen.value) return
  await nextTick()
  document.querySelectorAll<HTMLInputElement>(`#${CSS.escape(selectedListId)} input`)[props.maxVisibleSelected]?.focus()
}
const resultsModel = groupModel(() => shownResults.value)

const selectedLegend = computed(() => `${props.selectedLegend ?? `${props.label} : sélection`} (${model.value.length})`)
const resultsLegend = computed(() => (withSearch.value ? props.resultsLegend ?? `${props.label} : résultats` : props.label))
const searchLabel = computed(() => props.searchLabel ?? `Rechercher : ${props.label}`)
const searchHint = computed(() => props.searchHint
  ?? (longList.value
    ? `${props.options.length.toLocaleString('fr-FR')} choix : saisissez au moins ${props.minQueryLength} caractères du nom.`
    : 'Saisissez une partie du nom pour réduire la liste.'))
const moreCount = computed(() => Math.max(0, matchCount.value - shownResults.value.length))
const emptyText = computed(() => (selectedMatches.value ? props.alreadySelectedText : props.noResultsText))

// Result count, announced politely once typing pauses (not on every key). Emptied first,
// so that the same count after a new search is announced again (RGAA 7.5).
const announcement = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, () => {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    announcement.value = ''
    if (longList.value && !searching.value) return
    await nextTick()
    announcement.value = matchCount.value || !selectedMatches.value
      ? props.resultsCountText(matchCount.value, shownResults.value.length)
      : props.alreadySelectedText
  }, 500)
})
onBeforeUnmount(() => clearTimeout(timer))

const searchId = `${uid}-search`
function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') event.preventDefault() // do not submit a surrounding form
  // Escape empties the search first (as a search field does); a second one closes the panel.
  if (event.key === 'Escape' && query.value) {
    event.preventDefault()
    event.stopPropagation()
    query.value = ''
  }
}
async function clearSelection() {
  changedHere = false
  model.value = []
  await nextTick() // a parent-controlled v-model updates on the next render
  refresh()
  // The selection group (and this button) disappear: go back to the search field.
  document.getElementById(searchId)?.focus()
}
</script>

<template>
  <div
    class="dsaasfr-searchable-checkbox-set"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div
      v-if="shownSelected.length"
      class="dsaasfr-searchable-checkbox-set__selected"
    >
      <div :id="selectedListId">
        <DsfrCheckboxSet
          v-model="selectedModel"
          :legend="selectedLegend"
          small
          :options="checkboxOptions(visibleSelected, 's')"
        />
      </div>
      <div class="dsaasfr-searchable-checkbox-set__selected-actions">
        <DsfrButton
          v-if="hiddenSelected"
          :label="showAllSelectedText(shownSelected.length)"
          :icon="{ name: selectionOpen ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line' }"
          icon-right
          :aria-expanded="selectionOpen ? 'true' : 'false'"
          :aria-controls="selectedListId"
          tertiary
          no-outline
          size="sm"
          @click="toggleSelection"
        />
        <DsfrButton
          :label="clearText"
          tertiary
          no-outline
          size="sm"
          @click="clearSelection"
        />
      </div>
    </div>

    <DsfrInputGroup
      v-if="withSearch"
      :id="searchId"
      v-model="query"
      type="search"
      autocomplete="off"
      :label="searchLabel"
      label-visible
      :hint="searchHint"
      :data-autofocus="autofocus || undefined"
      @keydown="onSearchKeydown"
    />

    <p
      v-if="withSearch"
      class="fr-sr-only"
      role="status"
    >
      {{ announcement }}
    </p>

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
      {{ emptyText }}
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
  margin-bottom: var(--dsaasfr-space-2w);
  padding-bottom: var(--dsaasfr-space-1w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

.dsaasfr-searchable-checkbox-set__selected-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dsaasfr-space-1w);
}

.dsaasfr-searchable-checkbox-set__note {
  color: var(--text-mention-grey);
}
</style>
