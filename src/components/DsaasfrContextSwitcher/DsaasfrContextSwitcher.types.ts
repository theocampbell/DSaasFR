import type { RouteLocationRaw } from 'vue-router'

export interface DsaasfrContextSwitcherItem {
  /** Visible label, e.g. "Gironde (33)". */
  text: string
  /** Internal route (RouterLink), e.g. `{ query: { dep: '33' } }`. */
  to?: RouteLocationRaw
  /** External or non-router URL. */
  href?: string
  /** The context in use (`aria-current="true"`). */
  current?: boolean
}

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
  moreLink?: Omit<DsaasfrContextSwitcherItem, 'current'>
  /** Accessible name of the list of choices. Default: "{label} : changer". */
  listLabel?: string
  /** Where the panel opens relative to the trigger. */
  placement?: 'top' | 'bottom'
  /** Base id, used for aria-controls. */
  id?: string
}
