export interface DsaasfrSelectedFilter {
  /** Identifies the filter in the `remove` event, e.g. "commune". */
  key: string
  /** Name of the filter, e.g. "Commune". */
  label: string
  /** Selected values, e.g. ["Pessac", "Talence"]. */
  values: string[]
}

export interface DsaasfrSelectedFiltersProps {
  /** The filters in use, one tag each. */
  items: DsaasfrSelectedFilter[]
  /** Values shown at most in a tag before summarising ("Pessac et 49 autres"). Default: 1. */
  maxVisibleValues?: number
  /** Characters the shown values may take before the rest is summarised. */
  maxValuesLength?: number
  /** Accessible name of the group of tags. */
  listLabel?: string
  /** Start of each tag's accessible name, before its visible text ("Retirer le filtre Commune : Pessac et 1 autre"). */
  removeLabel?: string
  /** Button removing every filter. Shown from two filters on. */
  clearText?: string
  /** Alignment of the line: `end` to sit right-aligned under the filter buttons. */
  align?: 'start' | 'end'
}
