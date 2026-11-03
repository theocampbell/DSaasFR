export interface DsaasfrPreviewPanelProps {
  /** Title of the previewed item; names the preview region and receives focus on open. */
  title: string
  /** Heading level of the title. */
  titleTag?: 'h2' | 'h3' | 'h4'
  /** Optional line under the title (type, status…). */
  description?: string
  /** Visible text of the close button (DSFR modal default). */
  closeText?: string
  /** Accessible name of the close button (must contain the visible text). */
  closeLabel?: string
}
