import type { RouteLocationRaw } from 'vue-router'

/** A destination: an internal route (RouterLink) or a URL — one of them is required, so
 * every choice is a real, focusable link. */
export type DsaasfrContextSwitcherTarget =
  | { /** Internal route, e.g. `{ query: { dep: '33' } }`. */ to: RouteLocationRaw, href?: undefined }
  | { /** External or non-router URL. */ href: string, to?: undefined }

export type DsaasfrContextSwitcherItem = DsaasfrContextSwitcherTarget & {
  /** Visible label, e.g. "Gironde (33)". */
  text: string
  /** The context in use (`aria-current="true"`). */
  current?: boolean
}

/** Link to a page listing every choice. */
export type DsaasfrContextSwitcherMoreLink = DsaasfrContextSwitcherTarget & { text: string }

export interface DsaasfrContextSwitcherGroup {
  /** Group title, e.g. "Nouvelle-Aquitaine". */
  title: string
  items: DsaasfrContextSwitcherItem[]
}

export interface DsaasfrContextSwitcherProps {
  /** What is switched, e.g. "Département" (first line of the trigger). */
  label: string
  /** The context in use, e.g. "Gironde (33)" (second line of the trigger). */
  current: string
  /** Choices, as links. Use `groups` instead to show them under titles. */
  items?: DsaasfrContextSwitcherItem[]
  /** Choices under titles (e.g. by région). Shown after `items`. */
  groups?: DsaasfrContextSwitcherGroup[]
  /** Link to a page with every choice (e.g. "Tous les départements"), when there are too many for the panel. */
  moreLink?: DsaasfrContextSwitcherMoreLink
  /** Accessible name of the list of choices. Default: "Choisir : {label}". */
  listLabel?: string
  /** Where the panel opens relative to the trigger. */
  placement?: 'top' | 'bottom'
  /** Base id, used for aria-controls. */
  id?: string
}
