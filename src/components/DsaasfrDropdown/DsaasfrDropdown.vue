<script setup lang="ts">
/**
 * DsaasfrDropdown — a trigger button opening a floating panel (disclosure pattern).
 *
 * Behaviour shared by the user menu, the filter chips, "Filtrer" and future overflow
 * menus: aria-expanded/aria-controls, Escape closes and returns focus to the trigger,
 * click outside or tabbing out closes, optional autofocus into the panel.
 * Surface: official DSFR menu markup (fr-menu > content), layout-only overrides.
 * See docs/decisions/0009-filters.md.
 */
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import type { DsaasfrDropdownProps } from './DsaasfrDropdown.types'

const props = withDefaults(defineProps<DsaasfrDropdownProps>(), {
  placement: 'bottom-start',
  triggerClass: undefined,
  triggerLabel: undefined,
  triggerTitle: undefined,
  autofocus: false,
  id: undefined,
})

const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  trigger?: (scope: { open: boolean }) => unknown
  default?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
  /** Pinned at the bottom of the panel (e.g. "Appliquer"), stays visible while the content scrolls. */
  footer?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
}>()

const uid = useId()
const baseId = computed(() => props.id ?? `dsaasfr-dropdown-${uid}`)
const panelId = computed(() => `${baseId.value}-panel`)
const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const panel = useTemplateRef<HTMLElement>('panel')

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    close(true)
  }
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  // Focus moving to an ancestor (e.g. the shell's focusable <main>, when clicking a
  // non-focusable label inside the panel) is not "leaving": outside clicks are handled
  // by onPointerDownOutside.
  if (next && !root.value?.contains(next) && !next.contains(root.value!)) close()
}

function onPointerDownOutside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

// Keep the panel inside the viewport (RGAA 10.11 / 10.7): shifted back horizontally if it
// would overflow a side; limited in height (scrolls inside) to the space left on screen,
// and flipped to the other side of the trigger only when the requested side is cramped. Recomputed
// while open, as the trigger (e.g. a chip whose values change) or the window resizes.
const EDGE = 16
/** Below this room (12rem) the preferred side counts as cramped and the panel may flip. */
const MIN_ROOM = 192
const shift = ref(0)
const flipped = ref(false)
const maxHeight = ref<number>()
const opensUp = computed(() => props.placement.startsWith('top') !== flipped.value)

async function keepInViewport() {
  const el = panel.value
  const surface = el?.firstElementChild as HTMLElement | null
  const anchor = trigger.value?.getBoundingClientRect()
  if (!el || !surface || !anchor || typeof window === 'undefined') return
  shift.value = 0
  maxHeight.value = undefined
  flipped.value = false
  await nextTick()

  const natural = surface.scrollHeight
  const viewport = window.innerHeight
  const below = viewport - anchor.bottom - 2 * EDGE
  const above = anchor.top - 2 * EDGE
  const preferredUp = props.placement.startsWith('top')
  const room = preferredUp ? above : below
  const other = preferredUp ? below : above
  // Keep the requested side (scrolling inside if needed) unless it is really cramped:
  // flipping into space taken by e.g. the DSFR header would hide the panel's top.
  if (natural > room && room < MIN_ROOM && other > room) flipped.value = true
  const space = flipped.value ? other : room
  maxHeight.value = natural > space ? Math.max(space, 0) : undefined
  await nextTick()

  const rect = el.getBoundingClientRect()
  const width = document.documentElement.clientWidth
  let dx = 0
  if (rect.right > width - EDGE) dx = width - EDGE - rect.right
  if (rect.left + dx < EDGE) dx = EDGE - rect.left
  shift.value = dx
}

let resizeObserver: ResizeObserver | undefined
const onWindowResize = () => void keepInViewport()
function stopTracking() {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  window.removeEventListener('resize', onWindowResize)
}

/** Autofocus target: the current choice first (checked / pressed / current), else the first control. */
function focusTarget(root: HTMLElement) {
  return root.querySelector<HTMLElement>('input:checked, [aria-pressed="true"], [aria-current]:not([aria-current="false"])')
    ?? root.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
}

watch(open, async (isOpen) => {
  if (typeof document === 'undefined') return
  if (!isOpen) {
    document.removeEventListener('pointerdown', onPointerDownOutside)
    stopTracking()
    shift.value = 0
    maxHeight.value = undefined
    flipped.value = false
    return
  }
  document.addEventListener('pointerdown', onPointerDownOutside)
  await nextTick()
  await keepInViewport()
  window.addEventListener('resize', onWindowResize)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onWindowResize)
    if (trigger.value) resizeObserver.observe(trigger.value)
  }
  if (props.autofocus && panel.value) focusTarget(panel.value)?.focus()
}, { immediate: true })
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDownOutside)
  stopTracking()
})

defineExpose({ close, focus: () => trigger.value?.focus() })
</script>

<template>
  <div
    ref="root"
    class="dsaasfr-dropdown"
    :class="`dsaasfr-dropdown--${placement}`"
    @keydown="onKeydown"
    @focusout="onFocusOut"
  >
    <button
      ref="trigger"
      type="button"
      :class="triggerClass"
      :aria-label="triggerLabel"
      :title="triggerTitle"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <slot
        name="trigger"
        :open="open"
      />
    </button>

    <!-- Official DSFR menu markup (fr-menu > fr-menu__list); its desktop-only rules are
         applied at all widths in the styles below. -->
    <div
      v-show="open"
      :id="panelId"
      ref="panel"
      class="fr-menu dsaasfr-dropdown__panel"
      :class="{ 'dsaasfr-dropdown__panel--up': opensUp, 'dsaasfr-dropdown__panel--down': !opensUp }"
      :style="shift ? { translate: `${shift}px 0` } : undefined"
    >
      <div
        class="fr-menu__list dsaasfr-dropdown__surface"
        :style="maxHeight !== undefined ? { maxHeight: `${maxHeight}px` } : undefined"
      >
        <slot :close="close" />
        <div
          v-if="$slots.footer"
          class="dsaasfr-dropdown__footer"
        >
          <slot
            name="footer"
            :close="close"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-dropdown {
  position: relative;
  display: inline-block;
}

.dsaasfr-dropdown--top-stretch,
.dsaasfr-dropdown--bottom-stretch {
  display: block;
}

/* fr-menu only floats from the DSFR lg breakpoint (below, it is the mobile header's
   inline collapse). A dropdown floats at every width: the DSFR desktop fr-menu rules
   (absolute, layer, drop shadow, overlap surface) are applied at all sizes. */
.dsaasfr-dropdown__panel.fr-menu {
  position: absolute;
  z-index: calc(var(--ground) + 1000);
  filter: drop-shadow(var(--overlap-shadow));
  width: max-content;
  min-width: 100%;
  max-width: min(var(--dsaasfr-dropdown-max-width), calc(100vw - var(--dsaasfr-space-4w)));
  margin: 0;
  padding: 0;
}

.dsaasfr-dropdown__panel--down.fr-menu {
  top: calc(100% + var(--dsaasfr-space-1v));
}

.dsaasfr-dropdown__panel--up.fr-menu {
  top: auto;
  bottom: calc(100% + var(--dsaasfr-space-1v));
}

.dsaasfr-dropdown--bottom-start .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--top-start .dsaasfr-dropdown__panel.fr-menu {
  left: 0;
}

.dsaasfr-dropdown--bottom-end .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--top-end .dsaasfr-dropdown__panel.fr-menu {
  right: 0;
}

.dsaasfr-dropdown--top-stretch .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--bottom-stretch .dsaasfr-dropdown__panel.fr-menu {
  right: 0;
  left: 0;
  width: auto;
  max-width: none;
}

.dsaasfr-dropdown__surface.fr-menu__list {
  width: auto;
  margin: 0;
  padding: var(--dsaasfr-space-1w) 0;
  overflow-y: auto;
  background-color: var(--background-overlap-grey);

  /* No DSFR open-blue top line: it only exists from lg up; consistent at all widths. */
  background-image: none;

  --idle: transparent;
  --hover: var(--background-overlap-grey-hover);
  --active: var(--background-overlap-grey-active);
}

.dsaasfr-dropdown__footer {
  position: sticky;
  bottom: calc(-1 * var(--dsaasfr-space-1w));
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--dsaasfr-space-1w);
  margin-top: var(--dsaasfr-space-1w);
  margin-bottom: calc(-1 * var(--dsaasfr-space-1w));
  padding: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);
  border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: inherit;
}

/* DSFR adds the high-contrast edge to fr-menu__list only from lg up. */
@media (forced-colors: active) {
  .dsaasfr-dropdown__surface.fr-menu__list {
    outline: var(--dsaasfr-shell-border-width) solid;
  }
}
</style>
