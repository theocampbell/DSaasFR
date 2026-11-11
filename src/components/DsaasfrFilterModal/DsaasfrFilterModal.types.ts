export interface DsaasfrFilterModalProps {
  /** Name of the filter, e.g. "Communes": the button's text and the modal's title. */
  label: string
  /** Title of the modal, when it differs from `label`. */
  title?: string
  /** DSFR icon class of the button, e.g. `fr-icon-map-pin-2-line`. */
  icon?: string
  /** Values in use: shown on the button ("Communes (3)"). */
  count?: number
  /** End of the button's accessible name when `count` > 0 ("Communes (3), 3 sélectionnées"). */
  countText?: (count: number) => string
  /** Label of the apply button, usually with the result count ("Afficher 12 dossiers"). */
  applyLabel?: string
  /** Label of the cancel button. */
  cancelLabel?: string
  /** Fixed height for the content, so the modal keeps its size while it changes (a search). */
  fixedHeight?: boolean
  /** DSFR modal width. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
