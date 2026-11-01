export interface DsfsAppShellProps {
  /** Accessible name of the preview panel (complementary landmark). */
  previewLabel?: string
  /** Id given to <main>, used by the skip link. */
  mainId?: string
  /** Hide the skip links (only if the app renders its own, e.g. via DsfrHeader). */
  hideSkipLinks?: boolean
}
