<script setup lang="ts">
/**
 * DsfsAppShell — DRAFT layout skeleton.
 *
 * Regions (see docs/decisions/0002-app-shell-layout.md):
 *
 *   ┌──────────────────────── header (DSFR, required bloc-marque) ─────────────────┐
 *   │ sidebar │ breadcrumb row                                    │ preview (opt.) │
 *   │ (nav)   │ toolbar row: actions / filters                    │                │
 *   │         │ main                                              │                │
 *   └─────────┴───────────────────────────────────────────────────┴────────────────┘
 *
 * The shell owns layout and landmarks only. Content comes from slots, so teams
 * keep using Vue DSFR components (DsfrHeader, DsfrBreadcrumb, DsfrButton...).
 */
import { computed, useSlots } from 'vue'
import type { DsfsAppShellProps } from './DsfsAppShell.types'

const props = withDefaults(defineProps<DsfsAppShellProps>(), {
  sidebarLabel: 'Navigation principale',
  previewLabel: 'Aperçu',
  mainId: 'dsfs-main',
  hideSkipLinks: false,
})

const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed', { default: false })
const previewOpen = defineModel<boolean>('previewOpen', { default: false })

defineSlots<{
  header?: () => unknown
  sidebar?: (scope: { collapsed: boolean }) => unknown
  breadcrumb?: () => unknown
  toolbar?: () => unknown
  default?: () => unknown
  preview?: (scope: { close: () => void }) => unknown
}>()

const slots = useSlots()
const sidebarId = computed(() => `${props.mainId}-sidebar`)
const hasPreview = computed(() => previewOpen.value && !!slots.preview)

function closePreview() {
  previewOpen.value = false
}
</script>

<template>
  <div
    class="dsfs-app-shell"
    :class="{
      'dsfs-app-shell--sidebar-collapsed': sidebarCollapsed,
      'dsfs-app-shell--preview-open': hasPreview,
    }"
  >
    <div
      v-if="!hideSkipLinks"
      class="fr-skiplinks"
    >
      <nav
        class="fr-container"
        role="navigation"
        aria-label="Accès rapide"
      >
        <ul class="fr-skiplinks__list">
          <li>
            <a
              class="fr-link"
              :href="`#${mainId}`"
            >Contenu</a>
          </li>
          <li v-if="$slots.sidebar">
            <a
              class="fr-link"
              :href="`#${sidebarId}`"
            >Menu</a>
          </li>
        </ul>
      </nav>
    </div>

    <div
      v-if="$slots.header"
      class="dsfs-app-shell__header"
    >
      <slot name="header" />
    </div>

    <div class="dsfs-app-shell__body">
      <nav
        v-if="$slots.sidebar"
        :id="sidebarId"
        class="dsfs-app-shell__sidebar"
        :aria-label="sidebarLabel"
      >
        <slot
          name="sidebar"
          :collapsed="sidebarCollapsed"
        />
      </nav>

      <div class="dsfs-app-shell__content">
        <div
          v-if="$slots.breadcrumb"
          class="dsfs-app-shell__breadcrumb"
        >
          <slot name="breadcrumb" />
        </div>
        <div
          v-if="$slots.toolbar"
          class="dsfs-app-shell__toolbar"
        >
          <slot name="toolbar" />
        </div>
        <main
          :id="mainId"
          class="dsfs-app-shell__main"
          tabindex="-1"
        >
          <slot />
        </main>
      </div>

      <aside
        v-if="hasPreview"
        class="dsfs-app-shell__preview"
        :aria-label="previewLabel"
      >
        <slot
          name="preview"
          :close="closePreview"
        />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.dsfs-app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-default-grey);
  color: var(--text-default-grey);
}

.dsfs-app-shell__body {
  display: grid;
  flex: 1;
  grid-template-columns: var(--dsfs-shell-sidebar-width) minmax(0, 1fr);
  min-height: 0;
}

.dsfs-app-shell--sidebar-collapsed .dsfs-app-shell__body {
  grid-template-columns: var(--dsfs-shell-sidebar-width-collapsed) minmax(0, 1fr);
}

.dsfs-app-shell--preview-open .dsfs-app-shell__body {
  grid-template-columns: var(--dsfs-shell-sidebar-width) minmax(0, 1fr) var(--dsfs-shell-preview-width);
}

.dsfs-app-shell--sidebar-collapsed.dsfs-app-shell--preview-open .dsfs-app-shell__body {
  grid-template-columns:
    var(--dsfs-shell-sidebar-width-collapsed)
    minmax(0, 1fr)
    var(--dsfs-shell-preview-width);
}

.dsfs-app-shell__sidebar {
  overflow-y: auto;
  border-right: var(--dsfs-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-alt-grey);
}

.dsfs-app-shell__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dsfs-app-shell__breadcrumb,
.dsfs-app-shell__toolbar {
  display: flex;
  align-items: center;
  gap: var(--dsfs-space-2w);
  min-height: var(--dsfs-shell-row-height);
  padding: 0 var(--dsfs-space-3w);
  border-bottom: var(--dsfs-shell-border-width) solid var(--border-default-grey);
}

/* DsfrBreadcrumb ships with vertical margins designed for content pages. */
.dsfs-app-shell__breadcrumb :deep(.fr-breadcrumb) {
  margin: 0;
}

.dsfs-app-shell__main {
  flex: 1;
  padding: var(--dsfs-space-3w);
  overflow-y: auto;
}

.dsfs-app-shell__main:focus {
  outline: none;
}

.dsfs-app-shell__preview {
  overflow-y: auto;
  border-left: var(--dsfs-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-default-grey);
}

/* Responsive behaviour is a DRAFT: below 62em (DSFR "lg") the preview stacks. */
@media (width < 62em) {
  .dsfs-app-shell__body,
  .dsfs-app-shell--preview-open .dsfs-app-shell__body,
  .dsfs-app-shell--sidebar-collapsed .dsfs-app-shell__body,
  .dsfs-app-shell--sidebar-collapsed.dsfs-app-shell--preview-open .dsfs-app-shell__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .dsfs-app-shell__sidebar {
    border-right: 0;
    border-bottom: var(--dsfs-shell-border-width) solid var(--border-default-grey);
  }

  .dsfs-app-shell__preview {
    border-left: 0;
    border-top: var(--dsfs-shell-border-width) solid var(--border-default-grey);
  }
}
</style>
