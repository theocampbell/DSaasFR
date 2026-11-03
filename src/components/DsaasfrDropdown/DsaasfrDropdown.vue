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
  autofocus: false,
  id: undefined,
})

const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  trigger?: (scope: { open: boolean }) => unknown
  default?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
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

// Keep the panel inside the viewport (RGAA 10.11: no horizontal scroll at 320px): if it
// would overflow on one side, shift it back by the overflow.
const EDGE = 16
const shift = ref(0)
function keepInViewport() {
  shift.value = 0
  const rect = panel.value?.getBoundingClientRect()
  if (!rect || typeof window === 'undefined') return
  const width = document.documentElement.clientWidth
  if (rect.right > width - EDGE) shift.value = width - EDGE - rect.right
  if (rect.left + shift.value < EDGE) shift.value = EDGE - rect.left
}

watch(open, async (isOpen) => {
  if (typeof document === 'undefined') return
  if (!isOpen) {
    document.removeEventListener('pointerdown', onPointerDownOutside)
    shift.value = 0
    return
  }
  document.addEventListener('pointerdown', onPointerDownOutside)
  await nextTick()
  keepInViewport()
  if (props.autofocus) {
    panel.value?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()
  }
}, { immediate: true })
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDownOutside))

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
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <slot
        name="trigger"
        :open="open"
      />
    </button>

    <!-- Official DSFR menu surface: overlap background, hover pair, drop shadow,
         high-contrast outline (fr-menu__list). -->
    <div
      v-show="open"
      :id="panelId"
      ref="panel"
      class="fr-menu dsaasfr-dropdown__panel"
      :style="shift ? { translate: `${shift}px 0` } : undefined"
    >
      <div class="fr-menu__list dsaasfr-dropdown__surface">
        <slot :close="close" />
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

.dsaasfr-dropdown--bottom-start .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--bottom-end .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--bottom-stretch .dsaasfr-dropdown__panel.fr-menu {
  top: calc(100% + var(--dsaasfr-space-1v));
}

.dsaasfr-dropdown--top-start .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--top-end .dsaasfr-dropdown__panel.fr-menu,
.dsaasfr-dropdown--top-stretch .dsaasfr-dropdown__panel.fr-menu {
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
  background-color: var(--background-overlap-grey);

  --idle: transparent;
  --hover: var(--background-overlap-grey-hover);
  --active: var(--background-overlap-grey-active);
}
</style>
