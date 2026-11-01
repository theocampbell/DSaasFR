import type { RouteLocationRaw } from 'vue-router'

export interface DsfsSidebarItem {
  /** Visible label. */
  text: string
  /** Destination. Internal routes use RouterLink, URLs starting with http use <a>. Ignored on groups. */
  to?: RouteLocationRaw
  /** Force the active state. When omitted, it is derived from the current route. */
  active?: boolean
  /** Force a group open. Groups containing the active page open automatically. */
  expanded?: boolean
  /** Id of the group's collapsible list (generated when omitted). */
  id?: string
  /** Sub-items: turns this item into a group (secondary navigation). */
  menuItems?: DsfsSidebarItem[]
}

export interface DsfsSidebarProps {
  /** Service (application) name, shown under the bloc-marque. */
  serviceTitle: string
  /** Optional baseline under the service name. */
  serviceDescription?: string
  /** Text of the bloc-marque, one entry per line. */
  logoText?: string | string[]
  /** Home destination of the brand link. */
  homeTo?: RouteLocationRaw
  /** Primary navigation items. Ignored when the default slot is used. */
  items?: DsfsSidebarItem[]
  /** Accessible name of the navigation landmark. */
  navLabel?: string
  /** Base id, used for generated ids. */
  id?: string
}
