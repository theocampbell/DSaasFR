<script setup lang="ts">
/**
 * DsfsSidebar — application sidebar replacing the DSFR header in the app shell.
 *
 *   ┌───────────────────────┐
 *   │ bloc-marque (DsfrLogo)│  <header>  (banner landmark)
 *   │ Service name          │
 *   │ baseline              │
 *   ├───────────────────────┤
 *   │ primary nav           │  <nav>     DsfrSideMenuList, groups = secondary nav
 *   │   ▸ group             │
 *   │       sub-item        │
 *   ├───────────────────────┤
 *   │ footer slot           │  account, settings, display parameters…
 *   └───────────────────────┘
 *
 * Below the DSFR lg breakpoint (narrow window or high zoom) it turns into the DSFR
 * mobile header pattern: a bar with bloc-marque + service name + "Menu" button opening
 * the navigation in a modal. Two experimental implementations (see `narrowVariant`).
 *
 * See docs/decisions/0003-brand-in-sidebar.md and 0004-narrow-screens.md.
 */
import { DsfrHeader } from '@gouvminint/vue-dsfr'
import { computed, inject, nextTick, ref, useTemplateRef, watch } from 'vue'
import type { Component } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import { useNarrowViewport } from '../../composables/useNarrowViewport'
import SidebarBrand from './SidebarBrand.vue'
import SidebarNav from './SidebarNav.vue'
import type { RouteLocationRaw } from 'vue-router'
import type { DsfsSidebarItem, DsfsSidebarProps } from './DsfsSidebar.types'

const props = withDefaults(defineProps<DsfsSidebarProps>(), {
  serviceDescription: undefined,
  logoText: () => ['République', 'Française'],
  homeTo: '/',
  items: () => [],
  navLabel: 'Navigation principale',
  footerLabel: 'Mon espace',
  menuLabel: 'Menu',
  closeMenuLabel: 'Fermer',
  id: 'dsfs-sidebar',
  narrowVariant: 'dsfr-header',
})

defineSlots<{
  brand?: () => unknown
  default?: () => unknown
  footer?: () => unknown
}>()

// Vue DSFR assumes vue-router; we stay usable without it (tests, static pages).
const router = inject(routerKey, null)
const route = inject(routeLocationKey, null)

const isExternal = (to?: RouteLocationRaw) => typeof to === 'string' && /^https?:\/\//.test(to)

const logoLines = computed(() => (Array.isArray(props.logoText) ? props.logoText : [props.logoText]))
const homeTitle = computed(() => `Accueil - ${props.serviceTitle} - ${logoLines.value.join(' ')}`)
const homeIsRouterLink = computed(() => !!router && !isExternal(props.homeTo))
const homeHref = computed(() => (typeof props.homeTo === 'string' ? props.homeTo : '/'))

function pathOf(to?: RouteLocationRaw): string | undefined {
  if (to === undefined || isExternal(to)) return undefined
  if (typeof to === 'string') return to
  return router ? router.resolve(to).path : undefined
}

function isCurrent(to?: RouteLocationRaw): boolean {
  const target = pathOf(to)
  const current = route?.path
  if (!target || !current) return false
  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

/**
 * Derive active/expanded states from the route. The result is kept in a ref because
 * DsfrSideMenuList toggles `expanded` directly on the items it receives.
 */
function decorate(items: DsfsSidebarItem[], prefix: string): DsfsSidebarItem[] {
  return items.map((item, index) => {
    if (item.menuItems?.length) {
      const id = item.id ?? `${prefix}-group-${index}`
      const children = decorate(item.menuItems, id)
      const hasActiveChild = children.some(child => child.active)
      return {
        ...item,
        id,
        menuItems: children,
        // Not `active`: Vue DSFR would put aria-current="page" on the group button,
        // announcing two current pages. The open group + active child are enough.
        active: item.active ?? false,
        expanded: item.expanded ?? hasActiveChild,
      }
    }
    return { ...item, active: item.active ?? isCurrent(item.to) }
  })
}

const brandProps = computed(() => ({
  logoText: props.logoText,
  serviceTitle: props.serviceTitle,
  serviceDescription: props.serviceDescription,
  homeTo: props.homeTo,
  homeHref: homeHref.value,
  homeTitle: homeTitle.value,
  homeIsRouterLink: homeIsRouterLink.value,
}))

const menuItems = ref<DsfsSidebarItem[]>([])
watch(
  () => [props.items, route?.path] as const,
  () => {
    menuItems.value = decorate(props.items, props.id)
  },
  { immediate: true, deep: true },
)

// ── Narrow screens ────────────────────────────────────────────────────────────
const narrow = useNarrowViewport()

/** Close the menu modal when the user follows a link inside it. */
function closeOnLink(event: MouseEvent, close: () => void) {
  if ((event.target as HTMLElement | null)?.closest('a[href]')) close()
}

// Vue DSFR passes { hidemodal } to its `mainnav` slot at runtime, but types the slot
// without props (to report upstream). Loosen the component type so we can read it.
const AppHeader = DsfrHeader as unknown as Component
function hideModalOf(scope: unknown): () => void {
  return (scope as { hidemodal?: () => void } | undefined)?.hidemodal ?? (() => {})
}

// Variant "dialog": native <dialog> gives modality (inert page), Escape, and focus
// return to the opener on close.
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const menuOpen = ref(false)
const dialogId = computed(() => `${props.id}-menu`)

async function openMenu() {
  menuOpen.value = true
  await nextTick()
  dialog.value?.showModal()
}
function closeMenu() {
  dialog.value?.close()
}
watch(() => route?.path, closeMenu)
</script>

<template>
  <!-- Wide: full-height sidebar -->
  <div
    v-if="!narrow"
    :id="id"
    class="dsfs-sidebar"
  >
    <header class="dsfs-sidebar__brand fr-enlarge-link">
      <slot name="brand">
        <SidebarBrand v-bind="brandProps" />
      </slot>
    </header>

    <SidebarNav
      :id="`${id}-list`"
      class="dsfs-sidebar__nav"
      :label="navLabel"
      :items="menuItems"
    >
      <slot v-if="$slots.default" />
    </SidebarNav>

    <section
      v-if="$slots.footer"
      class="dsfs-sidebar__footer"
      :aria-label="footerLabel"
    >
      <slot name="footer" />
    </section>
  </div>

  <!-- Narrow, variant A: Vue DSFR's own header and its mobile menu modal -->
  <div
    v-else-if="narrowVariant === 'dsfr-header'"
    :id="id"
    class="dsfs-sidebar dsfs-sidebar--narrow"
  >
    <AppHeader
      :service-title="serviceTitle"
      :service-description="serviceDescription"
      :logo-text="logoText"
      :home-to="homeHref"
      :menu-label="menuLabel"
      :menu-modal-label="menuLabel"
      :close-menu-modal-label="closeMenuLabel"
    >
      <template #mainnav="mainnavScope">
        <div @click="closeOnLink($event, hideModalOf(mainnavScope))">
          <SidebarNav
            :id="`${id}-list`"
            :label="navLabel"
            :items="menuItems"
          >
            <slot v-if="$slots.default" />
          </SidebarNav>
          <section
            v-if="$slots.footer"
            class="dsfs-sidebar__footer dsfs-sidebar__footer--modal"
            :aria-label="footerLabel"
          >
            <slot name="footer" />
          </section>
        </div>
      </template>
    </AppHeader>
  </div>

  <!-- Narrow, variant B: our bar + native <dialog> keeping the sidebar look -->
  <div
    v-else
    :id="id"
    class="dsfs-sidebar dsfs-sidebar--narrow"
  >
    <header class="dsfs-sidebar__bar">
      <div class="dsfs-sidebar__bar-brand fr-enlarge-link">
        <slot name="brand">
          <SidebarBrand v-bind="brandProps" />
        </slot>
      </div>
      <button
        type="button"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-menu-fill fr-btn--icon-left"
        aria-haspopup="dialog"
        :aria-controls="dialogId"
        :aria-expanded="menuOpen"
        @click="openMenu"
      >
        {{ menuLabel }}
      </button>
    </header>

    <dialog
      :id="dialogId"
      ref="dialog"
      class="dsfs-sidebar__dialog"
      :aria-label="menuLabel"
      @close="menuOpen = false"
      @click="closeOnLink($event, closeMenu)"
    >
      <div class="dsfs-sidebar__dialog-header">
        <button
          type="button"
          class="fr-btn--close fr-btn"
          @click="closeMenu"
        >
          {{ closeMenuLabel }}
        </button>
      </div>
      <SidebarNav
        v-if="menuOpen"
        :id="`${id}-list`"
        :label="navLabel"
        :items="menuItems"
      >
        <slot v-if="$slots.default" />
      </SidebarNav>
      <section
        v-if="menuOpen && $slots.footer"
        class="dsfs-sidebar__footer"
        :aria-label="footerLabel"
      >
        <slot name="footer" />
      </section>
    </dialog>
  </div>
</template>

<style scoped>
.dsfs-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.dsfs-sidebar__brand {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--dsfs-space-2w);
  padding: var(--dsfs-space-3w) var(--dsfs-space-3w) var(--dsfs-space-2w);
  border-bottom: var(--dsfs-shell-border-width) solid var(--border-default-grey);

  /* Same hover/active feedback as .fr-header__brand.fr-enlarge-link. */
  --idle: transparent;
  --hover: var(--background-alt-grey-hover);
  --active: var(--background-alt-grey-active);
}

/* As in the DSFR header: keep the enlarged link focus ring inside the block,
   otherwise the scrolling sidebar clips it. */
.dsfs-sidebar__brand.fr-enlarge-link :deep(a[href])::before,
.dsfs-sidebar__bar-brand.fr-enlarge-link :deep(a[href])::before {
  outline-offset: calc(-1 * var(--dsfs-focus-offset));
}

.dsfs-sidebar__service a {
  color: var(--text-title-grey);
}

.dsfs-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--dsfs-space-1w) var(--dsfs-space-1w) var(--dsfs-space-2w);
}

.dsfs-sidebar__footer {
  /* 1w + the user menu trigger's own 1w padding line up with the nav labels. */
  padding: var(--dsfs-space-1w) var(--dsfs-space-2w);
  border-top: var(--dsfs-shell-border-width) solid var(--border-default-grey);
}

.dsfs-sidebar--narrow {
  height: auto;
}

.dsfs-sidebar__footer--modal {
  border-top: 0;
  padding-left: 0;
  padding-right: 0;
}

/* Variant B: bar */
.dsfs-sidebar__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dsfs-space-2w);
  padding: var(--dsfs-space-2w);
  background-color: var(--background-default-grey);
  border-bottom: var(--dsfs-shell-border-width) solid var(--border-default-grey);
}

.dsfs-sidebar__bar-brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--dsfs-space-2w);
  min-width: 0;

  --idle: transparent;
  --hover: var(--background-default-grey-hover);
  --active: var(--background-default-grey-active);
}

/* Variant B: full-screen menu dialog */
.dsfs-sidebar__dialog {
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: var(--dsfs-space-2w);
  border: 0;
  background-color: var(--background-default-grey);
  color: var(--text-default-grey);
}

.dsfs-sidebar__dialog-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--dsfs-space-2w);
}
</style>
