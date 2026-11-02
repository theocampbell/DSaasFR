import type { RouteLocationRaw } from 'vue-router'

export interface DsaasfrBreadcrumbItem {
  /** Visible label (long labels are visually truncated, full text stays available). */
  text: string
  /** Destination. Omit on the current page (last item). */
  to?: RouteLocationRaw
}

export interface DsaasfrBreadcrumbBarProps {
  /** Breadcrumb items. When omitted, they are built from the router (route `meta.breadcrumb` / `meta.title`). */
  items?: DsaasfrBreadcrumbItem[]
  /** Above this number of levels, the middle ones collapse into a "…" button. Minimum 3. */
  maxItems?: number
  /** Accessible name of the breadcrumb navigation (DSFR default). */
  navigationLabel?: string
  /** Accessible name of the "…" button revealing the hidden levels. */
  expandLabel?: string
  /** Optional id of the breadcrumb list. */
  id?: string
}
