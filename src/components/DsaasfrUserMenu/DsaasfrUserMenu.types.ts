import type { RouteLocationRaw } from 'vue-router'

export interface DsaasfrUserMenuItem {
  /** Visible label. */
  text: string
  /** Internal route (RouterLink). */
  to?: RouteLocationRaw
  /** External or non-router URL. */
  href?: string
  /** DSFR icon class, e.g. `fr-icon-logout-box-r-line`. */
  icon?: string
  /** Action for button items (e.g. log out, open display settings). */
  action?: () => void
  /** Draw a separator above this item. */
  separated?: boolean
}

export interface DsaasfrUserMenuProps {
  /** Name of the signed-in person (trigger label). */
  name: string
  /** Secondary line under the name: role, service… */
  description?: string
  /** Account-related entries. */
  items?: DsaasfrUserMenuItem[]
  /** Accessible name of the list of account actions. */
  menuLabel?: string
  /** Where the panel opens relative to the trigger. */
  placement?: 'top' | 'bottom'
  /** Base id, used for aria-controls. */
  id?: string
}
