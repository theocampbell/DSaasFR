// App-side filter logic (NOT in the library): which fields exist, their values, how a
// filter applies to the data. The library only provides DsaasfrFilterChip + DsaasfrDropdown.
import { computed, reactive, ref } from 'vue'
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

export interface Filter { id: number, field: string, operator: Operator, values: string[] }

export const valuesOf = (fieldKey: string) => {
  const field = fields.find(f => f.key === fieldKey)!
  return [...new Set(dossiers.map(row => row[field.column]!))].sort()
}
export const fieldLabel = (key: string) => fields.find(f => f.key === key)!.label
export const operatorLabel = (op: Operator) => operators.find(o => o.value === op)!.label

let nextId = 1
export const filters = reactive<Filter[]>([])
/** Which chip part to open (after adding a filter, its values open straight away). */
export const openPart = ref<{ id: number, part: 'field' | 'operator' | 'values' } | undefined>()

export function addFilter(fieldKey: string) {
  const filter: Filter = { id: nextId++, field: fieldKey, operator: 'is', values: [] }
  filters.push(filter)
  openPart.value = { id: filter.id, part: 'values' }
}
export function removeFilter(id: number) {
  filters.splice(filters.findIndex(f => f.id === id), 1)
}
export function clearFilters() {
  filters.splice(0)
}

export const filteredDossiers = computed(() => dossiers.filter(row => filters.every((f) => {
  if (!f.values.length) return true
  const value = row[fields.find(d => d.key === f.field)!.column]!
  return f.operator === 'is' ? f.values.includes(value) : !f.values.includes(value)
})))
