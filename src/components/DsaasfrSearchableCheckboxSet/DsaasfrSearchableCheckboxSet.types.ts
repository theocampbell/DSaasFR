export interface DsaasfrSearchableCheckboxOption {
  /** Value stored in the model (e.g. the INSEE code of a commune). */
  value: string
  /** Visible label (e.g. "Saint-Médard-en-Jalles (12)"). */
  label: string
  /** Text searched, when it differs from the label (e.g. the name without its count). Default: `label`. */
  searchText?: string
  /** Not selectable (e.g. would return no result); stays selectable while selected. */
  disabled?: boolean
  /** Hint under the label. */
  hint?: string
}

export interface DsaasfrSearchableCheckboxSetProps {
  /** Every option (can be thousands). With `localFilter: false`, the options matching `query` only. */
  options: DsaasfrSearchableCheckboxOption[]
  /** Name of the list, e.g. "Commune": used in the default texts below. */
  label: string
  /** Label of the search field. Default: "Rechercher : {label}". */
  searchLabel?: string
  /** Hint under the search field. Default: depends on the number of options. */
  searchHint?: string
  /** Legend of the selected options (the count is appended). Default: "{label} : sélection". */
  selectedLegend?: string
  /** Legend of the search results. Default: "{label} : résultats". */
  resultsLegend?: string
  /**
   * Focus the search field when the panel around opens (DsaasfrDropdown reads
   * `data-autofocus`). Use it when this list is the panel's only content (a filter chip).
   */
  autofocus?: boolean
  /** Results shown at most; the rest is counted ("précisez la recherche"). */
  maxResults?: number
  /**
   * Characters to type before results show, when there are more options than
   * `maxResults` (a short list is shown in full straight away).
   */
  minQueryLength?: number
  /**
   * Filter `options` here (accents, case and hyphens ignored). `false`: the app searches
   * itself (e.g. on the server) from `v-model:query` and passes the matching options.
   */
  localFilter?: boolean
  /** Button clearing the selection. */
  clearText?: string
  /** Result count, announced to screen readers after typing; `shown` < `count` when capped. */
  resultsCountText?: (count: number, shown: number) => string
  /** Text when nothing matches. */
  noResultsText?: string
  /** Text when nothing else matches: the values searched are already selected. */
  alreadySelectedText?: string
  /** Text under capped results. */
  moreResultsText?: (count: number) => string
}
