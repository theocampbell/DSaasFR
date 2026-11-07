export type DsaasfrAppShellSidebarSize = 'sm' | 'md' | 'lg'

export interface DsaasfrAppShellProps {
  /**
   * Sidebar width on wide screens: `sm` 14rem (short labels), `md` 16rem (default),
   * `lg` 20rem (long labels or service name). For any other width, set the
   * `--dsaasfr-shell-sidebar-width` CSS variable (e.g. `style="--dsaasfr-shell-sidebar-width: 18rem"`).
   */
  sidebarSize?: DsaasfrAppShellSidebarSize
  /** Accessible name of the preview panel (complementary landmark). */
  previewLabel?: string
  /** Id given to <main>, used by the skip link. */
  mainId?: string
  /** Hide the skip links (only if the app renders its own, e.g. via DsfrHeader). */
  hideSkipLinks?: boolean
}

export interface DsaasfrAppShellPreviewScope {
  /** Id of the preview <aside>, for aria-controls. */
  previewId: string
  previewOpen: boolean
  closePreview: () => void
  togglePreview: () => void
  /** `aria-controls` + `aria-expanded`, to spread on the preview toggle button. */
  previewToggleAttrs: { 'aria-controls': string, 'aria-expanded': boolean }
}
