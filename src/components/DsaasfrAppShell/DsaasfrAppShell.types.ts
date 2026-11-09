export type DsaasfrAppShellSidebarSize = 'sm' | 'md' | 'lg'

export type DsaasfrAppShellPreviewSize = 'sm' | 'md' | 'lg'
export type DsaasfrAppShellPreviewMode = 'push' | 'overlay'

export interface DsaasfrAppShellProps {
  /**
   * How the preview opens on wide screens:
   * - `push` (default): a column next to the content, the page stays usable (documents
   *   read alongside the page);
   * - `overlay`: floats over the list area (below the breadcrumb / toolbar rows, right of
   *   the sidebar), filling it with a band of veil around, content scrolling inside; the page is paused and the list area dimmed;
   *   a click outside closes it (quick look at an item without squeezing a table; pair
   *   with previous/next in DsaasfrPreviewPanel).
   * Below 62em the preview is always full screen.
   */
  previewMode?: DsaasfrAppShellPreviewMode
  /** Preview width: `sm` (≈24rem max), `md` (default, ≈35% of the screen), `lg` (≈half). */
  previewSize?: DsaasfrAppShellPreviewSize
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
