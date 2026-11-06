export interface DsaasfrDropdownProps {
  /** Where the panel opens relative to the trigger. `*-stretch` spans the trigger's container width. */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'top-stretch' | 'bottom-stretch'
  /** Classes of the trigger button (e.g. DSFR button classes). */
  triggerClass?: string | string[] | Record<string, boolean>
  /** Accessible name of the trigger, when its visible content is not enough. Must contain the visible text. */
  triggerLabel?: string
  /** Tooltip of the trigger (e.g. the full text of a shortened label). */
  triggerTitle?: string
  /** Move focus to the first focusable element of the panel when it opens (forms, option lists). */
  autofocus?: boolean
  /** Base id (panel id = `${id}-panel`). Unique by default. */
  id?: string
}
