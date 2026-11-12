// App-side filter logic (NOT in the library): which fields exist, how they are grouped,
// their values, how a filter applies to the data. The library only provides the pieces
// (DsaasfrToolbar, DsaasfrDropdown, DsaasfrSearchableCheckboxSet, DsaasfrSelectedFilters).
//
// Filters are applied explicitly ("Afficher…"): with millions of records, filtering runs
// on the server, and one request per applied change is predictable (no request per click,
// no results moving while the user is still choosing).
//
// Filters are GROUPED by theme, one toolbar button per group (Communes, Instruction,
// Projet…): each button opens a short panel instead of one panel with every filter.
import { computed, reactive, ref } from 'vue'
import { perimetre } from './demo'
import { allCommunes, attributesOf, dossiers, perimetreCommunes } from './fakeData'

type Row = string[]

export interface GroupDef {
  key: string
  label: string
  /** DSFR icon of the toolbar button. */
  icon: string
}
export const groups: GroupDef[] = [
  { key: 'communes', label: 'Communes', icon: 'fr-icon-map-pin-2-line' },
  { key: 'instruction', label: 'Instruction', icon: 'fr-icon-todo-line' },
  { key: 'projet', label: 'Projet', icon: 'fr-icon-building-line' },
]

export interface FieldDef {
  key: string
  label: string
  group: string
  /** The value of this field for a case file. */
  get: (row: Row) => string
  /** Every possible value, when there are more than the data shows (communes of the département). */
  values?: string[]
}
const attr = (key: string) => (row: Row) => attributesOf(row[0]!)[key]!
export const fields: FieldDef[] = [
  {
    key: 'commune',
    label: 'Commune',
    group: 'communes',
    get: row => row[3]!,
    // The person's perimeter: the whole département, or a few communes (demo switch).
    get values() { return perimetre.value === 'communes' ? perimetreCommunes : allCommunes },
  },
  { key: 'statut', label: 'Statut', group: 'instruction', get: row => row[4]! },
  { key: 'instructeur', label: 'Instructeur ou instructrice', group: 'instruction', get: attr('instructeur') },
  { key: 'delai', label: 'Délai', group: 'instruction', get: attr('delai') },
  { key: 'consultations', label: 'Consultations', group: 'instruction', get: attr('consultations') },
  { key: 'type', label: 'Type de demande', group: 'projet', get: row => row[2]! },
  { key: 'nature', label: 'Nature des travaux', group: 'projet', get: attr('nature') },
  { key: 'protection', label: 'Protection du site', group: 'projet', get: attr('protection') },
  { key: 'surface', label: 'Surface de plancher', group: 'projet', get: attr('surface') },
]
export const fieldsOf = (groupKey: string) => fields.filter(f => f.group === groupKey)

/** One filter per field at most: the case files whose field has one of these values. */
export interface Filter { field: string, values: string[] }

const field = (key: string) => fields.find(f => f.key === key)!
export const valuesOf = (fieldKey: string) => {
  const f = field(fieldKey)
  return f.values ?? [...new Set(dossiers.map(f.get))].sort((a, b) => a.localeCompare(b, 'fr'))
}
/** Values in list order, whatever order they were ticked in. */
const ordered = (fieldKey: string, values: string[]) => valuesOf(fieldKey).filter(v => values.includes(v))
export const fieldLabel = (key: string) => field(key).label

// ── The search: text + filters (what the "server query", the URL and saved searches hold)

/** Applied search text (submitted with the search button or Enter). */
export const searchText = ref('')
/** Applied filters, in field order. */
export const applied = reactive<Filter[]>([])
/**
 * What the last removal did ("Filtre Statut retiré. "), said with the result count: the
 * count alone may not change (RGAA 7.5). Cleared by the next applied change.
 */
export const removalNote = ref('')

export function applyFilter(fieldKey: string, values: string[]) {
  removalNote.value = ''
  const index = applied.findIndex(f => f.field === fieldKey)
  const next = values.length ? [{ field: fieldKey, values: ordered(fieldKey, values) }] : []
  if (index === -1) applied.push(...next)
  else applied.splice(index, 1, ...next)
  applied.sort((a, b) => fields.indexOf(field(a.field)) - fields.indexOf(field(b.field)))
}
/** Replace the filters of one group from a field → values selection. */
export function applyGroup(groupKey: string, selection: Record<string, string[]>) {
  for (const f of fieldsOf(groupKey)) applyFilter(f.key, selection[f.key] ?? [])
}
export function removeFilter(fieldKey: string) {
  const index = applied.findIndex(f => f.field === fieldKey)
  if (index === -1) return
  applied.splice(index, 1)
  removalNote.value = `Filtre ${fieldLabel(fieldKey)} retiré. `
}
/** "Tout effacer": every filter (the search text has its own field). */
export function clearFilters() {
  applied.splice(0)
  removalNote.value = 'Tous les filtres retirés. '
}
export const selectionOf = (filters: Filter[], groupKey: string) =>
  Object.fromEntries(fieldsOf(groupKey).map(f => [f.key, [...(filters.find(a => a.field === f.key)?.values ?? [])]]))
/** Draft selection (field → values) as filters. */
export const filtersOf = (selection: Record<string, string[]>): Filter[] =>
  Object.entries(selection).filter(([, values]) => values.length).map(([key, values]) => ({ field: key, values }))

// ── Results (stand-in for the server) ─────────────────────────────────────────

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
/** Text search on the case number, applicant, commune and type. */
const textMatch = (row: Row, text: string) =>
  !text || [row[0], row[1], row[2], row[3]].some(cell => normalize(cell!).includes(normalize(text.trim())))
const matches = (row: Row, f: Filter) => !f.values.length || f.values.includes(field(f.field).get(row))
const searched = computed(() => dossiers.filter(row => textMatch(row, searchText.value)))

export const countResults = (filters: Filter[]) => searched.value.filter(row => filters.every(f => matches(row, f))).length
export const filteredDossiers = computed(() => searched.value.filter(row => applied.every(f => matches(row, f))))

/**
 * Faceted count: how many results `value` would give for `field`, combined with the
 * other fields' filters and the text (on a real back-office, the search server returns
 * these counts with the results). Lets the UI disable values that would return nothing.
 */
export function facetCount(filters: Filter[], fieldKey: string, value: string) {
  const others = filters.filter(f => f.field !== fieldKey)
  return countResults([...others, { field: fieldKey, values: [value] }])
}
