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
import { computed, inject, nextTick, onBeforeUnmount, onMounted, useSlots, useTemplateRef, watch } from 'vue'
import { routeLocationKey } from 'vue-router'
import type { DsaasfrAppShellPreviewScope, DsaasfrAppShellProps } from './DsaasfrAppShell.types'

const props = withDefaults(defineProps<DsaasfrAppShellProps>(), {
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

// Focus management (RGAA 12.8): remember what opened the preview and, when it
// closes while focus is inside it (or lost), give focus back to that element.
let opener: HTMLElement | null = null
watch(previewOpen, async (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
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
    :class="{ 'dsaasfr-app-shell--preview-open': hasPreview }"
  >
    <DsfrSkipLinks
      v-if="!hideSkipLinks"
      :links="skipLinks"
    />

    <div
      v-if="$slots.header"
      class="dsaasfr-app-shell__header"
    >
      <slot name="header" />
    </div>

    <div class="dsaasfr-app-shell__body">
      <div
        v-if="$slots.sidebar"
        :id="sidebarId"
        class="dsaasfr-app-shell__sidebar"
        tabindex="-1"
      >
        <slot name="sidebar" />
      </div>

      <div class="dsaasfr-app-shell__content">
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
        <main
          :id="mainId"
          class="dsaasfr-app-shell__main"
          tabindex="-1"
        >
          <slot />
        </main>
      </div>

      <aside
        v-if="hasPreview"
        :id="previewId"
        class="dsaasfr-app-shell__preview"
        :aria-label="previewLabel"
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

/* Toolbar items keep their natural width and wrap onto a new line as a whole,
   instead of being squeezed until their labels break (e.g. "Nouveau dossier").
   max-width keeps a single very long label inside the row at 320px (RGAA 10.11). */
.dsaasfr-app-shell__toolbar {
  flex-wrap: wrap;
  row-gap: var(--dsaasfr-space-1w);
  padding-block: var(--dsaasfr-space-1w);
}

.dsaasfr-app-shell__toolbar > :deep(*) {
  flex: 0 0 auto;
  max-width: 100%;
}

/* DsfrBreadcrumb ships with vertical margins designed for content pages. */
.dsaasfr-app-shell__breadcrumb :deep(.fr-breadcrumb) {
  margin: 0;
}

.dsaasfr-app-shell__main {
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

/* Below 62em (DSFR "lg", i.e. high zoom) nothing is pinned: pinned areas would eat the
   little screen space left at 400% zoom. The preview stacks under the content. */
@media (width < 62em) {
  .dsaasfr-app-shell__sidebar,
  .dsaasfr-app-shell__preview,
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

  .dsaasfr-app-shell__main {
    padding: var(--dsaasfr-space-2w);
  }

  .dsaasfr-app-shell__preview {
    overflow: visible;
    border-left: 0;
    border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  }
}
</style>
