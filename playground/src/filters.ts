// App-side filter logic (NOT in the library): which fields exist, their values, how a
// filter applies to the data. The library only provides DsaasfrFilterChip + DsaasfrDropdown.
//
// Filters are applied explicitly ("Appliquer"): with millions of records, filtering runs
// on the server, and one request per applied change is predictable (no request per click,
// no results moving while the user is still choosing).
import { computed, reactive } from 'vue'
import { dossiers } from './fakeData'

export interface FieldDef { key: string, label: string, column: number }
export const fields: FieldDef[] = [
  { key: 'statut', label: 'Statut', column: 4 },
  { key: 'type', label: 'Type', column: 2 },
  { key: 'commune', label: 'Commune', column: 3 },
]
export const operators = [
  { value: 'is', label: 'est' },
  { value: 'is-not', label: 'n’est pas' },
] as const
export type Operator = typeof operators[number]['value']

/** One filter per field at most. */
export interface Filter { field: string, operator: Operator, values: string[] }

export const valuesOf = (fieldKey: string) => {
  const field = fields.find(f => f.key === fieldKey)!
  return [...new Set(dossiers.map(row => row[field.column]!))].sort((a, b) => a.localeCompare(b, 'fr'))
}
/** Values in list order, whatever order they were ticked in. */
const ordered = (fieldKey: string, values: string[]) => valuesOf(fieldKey).filter(v => values.includes(v))
export const fieldLabel = (key: string) => fields.find(f => f.key === key)!.label
export const operatorLabel = (op: Operator) => operators.find(o => o.value === op)!.label

/** Applied filters, in field order (this is what the "server query" uses). */
export const applied = reactive<Filter[]>([])

/** Replace the applied filters from a field → values selection (fields without values are dropped). */
export function applySelection(selection: Record<string, string[]>) {
  const next = fields
    .filter(f => selection[f.key]?.length)
    .map(f => ({
      field: f.key,
      operator: applied.find(a => a.field === f.key)?.operator ?? 'is' as Operator,
      values: ordered(f.key, selection[f.key]!),
    }))
  applied.splice(0, applied.length, ...next)
}
export function applyFilter(field: string, operator: Operator, values: string[]) {
  const index = applied.findIndex(f => f.field === field)
  if (!values.length) applied.splice(index, 1)
  else applied.splice(index, 1, { field, operator, values: ordered(field, values) })
}
export function removeFilter(field: string) {
  applied.splice(applied.findIndex(f => f.field === field), 1)
}
export function clearFilters() {
  applied.splice(0)
}
export const selectionOf = (filters: Filter[]) =>
  Object.fromEntries(fields.map(f => [f.key, [...(filters.find(a => a.field === f.key)?.values ?? [])]]))

const matches = (row: string[], f: Filter) => {
  if (!f.values.length) return true
  const value = row[fields.find(d => d.key === f.field)!.column]!
  return f.operator === 'is' ? f.values.includes(value) : !f.values.includes(value)
}

/** Stand-in for the server query. */
export const countResults = (filters: Filter[]) => dossiers.filter(row => filters.every(f => matches(row, f))).length
export const filteredDossiers = computed(() => dossiers.filter(row => applied.every(f => matches(row, f))))

/**
 * Faceted count: how many results `value` would give for `field`, combined with the
 * other fields' filters (on a real back-office, the search server returns these counts
 * with the results). Lets the UI disable values that would return nothing.
 */
export function facetCount(filters: Filter[], field: string, value: string) {
  const others = filters.filter(f => f.field !== field)
  return countResults([...others, { field, operator: 'is', values: [value] }])
}

/** Draft selection (field → values) as filters, keeping the applied operators. */
export const filtersOf = (selection: Record<string, string[]>): Filter[] =>
  fields.filter(f => selection[f.key]?.length).map(f => ({
    field: f.key,
    operator: applied.find(a => a.field === f.key)?.operator ?? 'is',
    values: selection[f.key]!,
  }))
