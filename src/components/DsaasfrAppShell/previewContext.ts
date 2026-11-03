import type { InjectionKey } from 'vue'

/** Provided by DsaasfrAppShell to the preview panel it hosts. */
export interface DsaasfrPreviewContext {
  close: () => void
  /** The panel registers its heading so the shell can label the region and focus it. */
  registerHeading: (id: string | undefined) => void
}

export const previewContextKey: InjectionKey<DsaasfrPreviewContext> = Symbol('dsaasfr-preview')
