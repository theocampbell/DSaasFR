<script setup lang="ts">
/**
 * DsaasfrAppShell — DRAFT layout skeleton.
 *
 * Regions (see docs/decisions/0002 and 0003):
 *
 *   ┌──────────────┬──────────────────────────────────────┬────────────────┐
 *   │ sidebar      │ breadcrumb row      ┐ pinned (sticky) │ preview (opt.) │
 *   │ (pinned)     │ toolbar row         ┘                 │ (pinned)       │
 *   │ bloc-marque, │ main                                  │                │
 *   │ nav, footer  │ (the page scrolls)                    │                │
 *   └──────────────┴──────────────────────────────────────┴────────────────┘
 *
 * The document scrolls (not an inner box), so keyboard scrolling, find-in-page and
 * scroll restoration work natively; the sidebar, the two rows and the preview are
 * pinned with position: sticky. Below 62em (high zoom) nothing is pinned.
 *
 * There is no DSFR header: the bloc-marque lives at the top of DsaasfrSidebar, which
 * also provides the banner and navigation landmarks. The optional `header` slot
 * remains for apps that want a classic DsfrHeader above everything.
 *
 * The shell owns layout and landmarks only. Content comes from slots, so teams
 * keep using Vue DSFR components (DsfrBreadcrumb, DsfrButton...).
 */
import { DsfrSkipLinks } from '@gouvminint/vue-dsfr'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, useSlots, useTemplateRef, watch } from 'vue'
import { routeLocationKey } from 'vue-router'
import { useNarrowViewport } from '../../composables/useNarrowViewport'
import { previewContextKey } from './previewContext'
import type { DsaasfrAppShellPreviewScope, DsaasfrAppShellProps } from './DsaasfrAppShell.types'

const props = withDefaults(defineProps<DsaasfrAppShellProps>(), {
  sidebarSize: undefined,
  previewMode: 'push',
  previewSize: undefined,
  previewLabel: 'Aperçu',
  mainId: 'dsaasfr-main',
  hideSkipLinks: false,
})

const previewOpen = defineModel<boolean>('previewOpen', { default: false })

defineSlots<{
  header?: () => unknown
  sidebar?: () => unknown
  breadcrumb?: () => unknown
  toolbar?: (scope: DsaasfrAppShellPreviewScope) => unknown
  default?: () => unknown
  preview?: (scope: DsaasfrAppShellPreviewScope) => unknown
}>()

const slots = useSlots()

// Size → DSFR-scale token. Without a size, the token's default (or a custom value set by
// the app on --dsaasfr-shell-sidebar-width) applies.
const sizeStyle = computed(() => ({
  ...(props.sidebarSize && { '--dsaasfr-shell-sidebar-width': `var(--dsaasfr-shell-sidebar-width-${props.sidebarSize})` }),
  ...(props.previewSize && { '--dsaasfr-shell-preview-width': `var(--dsaasfr-shell-preview-width-${props.previewSize})` }),
}))
const sidebarId = computed(() => `${props.mainId}-sidebar`)
const hasPreview = computed(() => previewOpen.value && !!slots.preview)
const skipLinks = computed(() => [
  { id: props.mainId, text: 'Contenu' },
  ...(slots.sidebar ? [{ id: sidebarId.value, text: 'Menu' }] : []),
])

const previewId = computed(() => `${props.mainId}-preview`)

function closePreview() {
  previewOpen.value = false
}

function togglePreview() {
  previewOpen.value = !previewOpen.value
}

const previewScope = computed<DsaasfrAppShellPreviewScope>(() => ({
  previewId: previewId.value,
  previewOpen: previewOpen.value,
  closePreview,
  togglePreview,
  // Spread on the button that toggles the preview.
  previewToggleAttrs: { 'aria-controls': previewId.value, 'aria-expanded': previewOpen.value },
}))

// A new page starts at the top (query/hash changes keep the position). Apps may also
// set the router's scrollBehavior; doing both is harmless.
const route = inject(routeLocationKey, null)
watch(
  () => route?.path,
  async (path, previous) => {
    if (path === previous || typeof window === 'undefined') return
    await nextTick()
    window.scrollTo({ top: 0 })
  },
)

// WCAG 2.4.11 (focus not obscured): keep focused elements and anchor targets below
// the pinned rows by mirroring their height into the page's scroll-padding-top.
const bars = useTemplateRef<HTMLElement>('bars')
let observer: ResizeObserver | undefined
onMounted(() => {
  if (!bars.value || typeof ResizeObserver === 'undefined') return
  const root = document.documentElement
  observer = new ResizeObserver(() => {
    const pinned = bars.value && getComputedStyle(bars.value).position === 'sticky'
    root.style.setProperty('scroll-padding-top', pinned ? `${bars.value!.offsetHeight}px` : '')
  })
  observer.observe(bars.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  document.documentElement.style.removeProperty('scroll-padding-top')
})

// Preview panel context: DsaasfrPreviewPanel registers its heading (region name and
// focus target) and closes through the shell.
const previewHeadingId = ref<string>()
provide(previewContextKey, {
  close: closePreview,
  registerHeading: (id) => { previewHeadingId.value = id },
})

// The preview pauses the rest of the page (inert) when it covers it: full screen below
// 62em, or floating (`overlay`) on wide screens.
const narrow = useNarrowViewport()
const overlay = computed(() => hasPreview.value && props.previewMode === 'overlay' && !narrow.value)
const pageInert = computed(() => (hasPreview.value && (narrow.value || overlay.value)) || undefined)

function onPreviewKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    closePreview()
  }
}

// Focus management (RGAA 12.8): when the user opens the preview, move focus to the
// panel (its heading when there is one) so it is announced and reachable; on close, while focus is inside it
// (or lost), give focus back to the element that opened it.
let opener: HTMLElement | null = null
watch(hasPreview, async (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    const active = document.activeElement
    opener = active instanceof HTMLElement && active !== document.body ? active : null
    // Opened from a shared link / page load (no user action): leave focus at the page
    // start, the panel is announced by its region name when reached.
    if (!opener) return
    await nextTick()
    const target = (previewHeadingId.value && document.getElementById(previewHeadingId.value))
      || document.getElementById(previewId.value)
    target?.focus()
    return
  }
  const panel = document.getElementById(previewId.value)
  const focusWasInPanel = !!panel && panel.contains(document.activeElement)
  await nextTick()
  const focusLost = document.activeElement === document.body
  if ((focusWasInPanel || focusLost) && opener?.isConnected) opener.focus()
  opener = null
})
</script>

<template>
  <div
    class="dsaasfr-app-shell"
    :class="{
      'dsaasfr-app-shell--preview-open': hasPreview && !overlay,
      'dsaasfr-app-shell--preview-overlay': overlay,
    }"
    :style="sizeStyle"
  >
    <div
      v-if="!hideSkipLinks"
      :inert="pageInert"
    >
      <DsfrSkipLinks :links="skipLinks" />
    </div>

    <div
      v-if="$slots.header"
      class="dsaasfr-app-shell__header"
      :inert="pageInert"
    >
      <slot name="header" />
    </div>

    <div class="dsaasfr-app-shell__body">
      <div
        v-if="$slots.sidebar"
        :id="sidebarId"
        class="dsaasfr-app-shell__sidebar"
        tabindex="-1"
        :inert="pageInert"
      >
        <slot name="sidebar" />
      </div>

      <div
        class="dsaasfr-app-shell__content"
        :inert="pageInert"
      >
        <!-- The breadcrumb and toolbar rows are part of the page: inside <main>, so their
             content (e.g. "40 dossiers") belongs to a landmark. -->
        <main
          :id="mainId"
          class="dsaasfr-app-shell__main"
          tabindex="-1"
        >
          <div
            v-if="$slots.breadcrumb || $slots.toolbar"
            ref="bars"
            class="dsaasfr-app-shell__bars"
          >
            <div
              v-if="$slots.breadcrumb"
              class="dsaasfr-app-shell__breadcrumb"
            >
              <slot name="breadcrumb" />
            </div>
            <div
              v-if="$slots.toolbar"
              class="dsaasfr-app-shell__toolbar"
            >
              <slot
                name="toolbar"
                v-bind="previewScope"
              />
            </div>
          </div>
          <div class="dsaasfr-app-shell__page">
            <slot />
          </div>
        </main>
      </div>

      <!-- Floating preview: veil over the paused page; clicking it closes the preview.
           While the page is paused (floating, or full screen below 62em) the preview is a
           modal dialog, like DsfrModal; otherwise a complementary region. -->
      <div
        v-if="overlay"
        class="dsaasfr-app-shell__backdrop"
        aria-hidden="true"
        @click="closePreview"
      />
      <aside
        v-if="hasPreview"
        :id="previewId"
        class="dsaasfr-app-shell__preview"
        :role="pageInert ? 'dialog' : undefined"
        :aria-modal="pageInert ? 'true' : undefined"
        :aria-labelledby="previewHeadingId"
        :aria-label="previewHeadingId ? undefined : previewLabel"
        tabindex="-1"
        @keydown="onPreviewKeydown"
      >
        <slot
          name="preview"
          v-bind="previewScope"
        />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-default-grey);
  color: var(--text-default-grey);
}

.dsaasfr-app-shell__body {
  display: grid;
  flex: 1;
  grid-template-columns: var(--dsaasfr-shell-sidebar-width) minmax(0, 1fr);
  align-items: start;
}

.dsaasfr-app-shell--preview-open .dsaasfr-app-shell__body {
  grid-template-columns: var(--dsaasfr-shell-sidebar-width) minmax(0, 1fr) var(--dsaasfr-shell-preview-width);
}

.dsaasfr-app-shell__sidebar,
.dsaasfr-app-shell__preview {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
}

.dsaasfr-app-shell__sidebar {
  border-right: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-alt-grey);
}

.dsaasfr-app-shell__sidebar:focus {
  outline: none;
}

.dsaasfr-app-shell__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

.dsaasfr-app-shell__bars {
  position: sticky;
  z-index: 2;
  top: 0;
  background-color: var(--background-default-grey);
}

.dsaasfr-app-shell__breadcrumb,
.dsaasfr-app-shell__toolbar {
  display: flex;
  align-items: center;
  gap: var(--dsaasfr-space-2w);
  min-height: var(--dsaasfr-shell-row-height);
  padding: 0 var(--dsaasfr-space-3w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

/* Room above/below when the breadcrumb bar's actions wrap. */
.dsaasfr-app-shell__breadcrumb {
  padding-block: var(--dsaasfr-space-1w);
}

/* Raw items put directly in the toolbar row (without DsaasfrToolbar) keep their natural
   width and wrap as a whole instead of being squeezed until their labels break.
   max-width keeps a single very long label inside the row at 320px (RGAA 10.11). */
.dsaasfr-app-shell__toolbar {
  flex-wrap: wrap;
  row-gap: var(--dsaasfr-space-1w);
  padding-block: var(--dsaasfr-space-1w);
}

.dsaasfr-app-shell__toolbar > :deep(:not(.dsaasfr-toolbar)) {
  flex: 0 0 auto;
  max-width: 100%;
}

/* DsfrBreadcrumb ships with vertical margins designed for content pages. */
.dsaasfr-app-shell__breadcrumb :deep(.fr-breadcrumb) {
  margin: 0;
}

.dsaasfr-app-shell__main {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.dsaasfr-app-shell__page {
  flex: 1;
  padding: var(--dsaasfr-space-3w);
}

.dsaasfr-app-shell__main:focus {
  outline: none;
}

.dsaasfr-app-shell__preview {
  border-left: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-default-grey);
}

.dsaasfr-app-shell__preview:focus {
  outline: none;
}

/* Floating preview (previewMode="overlay"): above the page and a DSFR-modal veil, at the
   DSFR modal layer; lifted surface and shadow, as fr-modal. */
.dsaasfr-app-shell__backdrop {
  position: fixed;
  z-index: 1749;
  inset: 0;
  background-color: var(--dsaasfr-backdrop);
}

.dsaasfr-app-shell--preview-overlay .dsaasfr-app-shell__preview {
  position: fixed;
  z-index: 1750;
  top: 0;
  right: 0;
  width: var(--dsaasfr-shell-preview-width);
  max-width: 100%;
  border-left: 0;
  background-color: var(--background-lifted-grey);
  box-shadow: var(--lifted-shadow);
}

/* Below 62em (DSFR "lg", i.e. high zoom) nothing is pinned: pinned areas would eat the
   little screen space left at 400% zoom. The preview stays fixed but full width (full
   screen), and the rest of the page is inert (see pageInert). */
@media (width < 62em) {
  .dsaasfr-app-shell__sidebar,
  .dsaasfr-app-shell__bars {
    position: static;
    height: auto;
  }

  .dsaasfr-app-shell__content {
    min-height: 0;
  }

  .dsaasfr-app-shell__body,
  .dsaasfr-app-shell--preview-open .dsaasfr-app-shell__body {
    grid-template-columns: minmax(0, 1fr);
    align-content: start;
  }

  /* The sidebar becomes a header bar (DSFR mobile header pattern), see 0004. */
  .dsaasfr-app-shell__sidebar {
    overflow: visible;
    border-right: 0;
    background-color: transparent;
  }

  /* DSFR mobile gutters (fr-container uses 1rem below md). */
  .dsaasfr-app-shell__breadcrumb,
  .dsaasfr-app-shell__toolbar {
    padding-inline: var(--dsaasfr-space-2w);
  }

  .dsaasfr-app-shell__page {
    padding: var(--dsaasfr-space-2w);
  }

  /* Full screen above everything (incl. the DSFR header, +1000; below DSFR modals,
     +1750); the rest of the page, skip links included, is inert (see pageInert). */
  .dsaasfr-app-shell__preview {
    position: fixed;
    z-index: calc(var(--ground) + 1500);
    inset: 0;
    width: 100%;
    height: 100%;
    border-left: 0;
  }
}
</style>
