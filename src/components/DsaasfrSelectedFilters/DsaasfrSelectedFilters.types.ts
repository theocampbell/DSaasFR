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
  /** Values shown at most in a tag before summarising ("Pessac, Talence et 2 autres"). */
  maxVisibleValues?: number
  /** Characters the shown values may take before the rest is summarised. */
  maxValuesLength?: number
  /** Accessible name of the list of tags. */
  listLabel?: string
  /** Start of each tag's accessible name ("Retirer le filtre Commune : Pessac, Talence"). */
  removeLabel?: string
  /** Button removing every filter. Shown from two filters on. */
  clearText?: string
}
