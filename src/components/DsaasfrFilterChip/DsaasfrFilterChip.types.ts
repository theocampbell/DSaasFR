export type DsaasfrFilterChipPart = 'field' | 'operator' | 'values'

export interface DsaasfrFilterChipProps {
  /** Filtered field, e.g. "Assigné à". */
  field: string
  /** Condition, e.g. "est", "n'est pas". Omit to hide this part. */
  operator?: string
  /** Selected values (labels), e.g. ["Personne A", "Personne B"]. */
  values?: string[]
  /** Values shown at most before summarising ("A, B et 2 autres"). */
  maxVisibleValues?: number
  /** Length (characters) the shown values may take before the rest is summarised, so the chip stays on one line. */
  maxValuesLength?: number
  /** Text shown when no value is selected yet. */
  emptyValuesText?: string
  /** Prefix of the chip's accessible name ("Filtre : Assigné à est A, B"). */
  groupLabel?: string
  /** Accessible names of the part buttons (the visible text is appended). */
  editFieldLabel?: string
  editOperatorLabel?: string
  editValuesLabel?: string
  /** Accessible name prefix of the remove button ("Retirer le filtre Assigné à"). */
  removeLabel?: string
}
