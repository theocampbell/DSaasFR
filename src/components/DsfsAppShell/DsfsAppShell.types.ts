export interface DsfsAppShellProps {
  /** Accessible name of the preview panel (complementary landmark). */
  previewLabel?: string
  /** Id given to <main>, used by the skip link. */
  mainId?: string
  /** Hide the skip links (only if the app renders its own, e.g. via DsfrHeader). */
  hideSkipLinks?: boolean
}

export interface DsfsAppShellPreviewScope {
  /** Id of the preview <aside>, for aria-controls. */
  previewId: string
  previewOpen: boolean
  closePreview: () => void
  togglePreview: () => void
  /** `aria-controls` + `aria-expanded`, to spread on the preview toggle button. */
  previewToggleAttrs: { 'aria-controls': string, 'aria-expanded': boolean }
}
