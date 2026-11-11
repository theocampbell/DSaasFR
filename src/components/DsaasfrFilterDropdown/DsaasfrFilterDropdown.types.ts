export interface DsaasfrFilterDropdownProps {
  /** Name of the group of filters, e.g. "Instruction". */
  label: string
  /** DSFR icon class of the button, e.g. `fr-icon-todo-line`. */
  icon?: string
  /** Filters of the group in use: shown on the button ("Instruction (2)"). */
  count?: number
  /** End of the button's accessible name when `count` > 0 ("Instruction (2), 2 filtres actifs"). */
  countText?: (count: number) => string
  /** Label of the apply button, usually with the result count ("Afficher 12 dossiers"). */
  applyLabel?: string
  /** Label of the reset button. */
  resetLabel?: string
  /** Disable the reset button (nothing ticked in the draft). */
  resetDisabled?: boolean
  /** Where the panel opens. */
  placement?: 'bottom-start' | 'bottom-end'
  /** Base id, used for aria-controls. */
  id?: string
}
