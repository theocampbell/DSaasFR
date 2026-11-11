<script setup lang="ts">
/**
 * DsaasfrSidebar — application sidebar replacing the DSFR header in the app shell.
 *
 *   ┌───────────────────────┐
 *   │ bloc-marque (DsfrLogo)│  <header>  (banner landmark)
 *   │ Service name          │
 *   │ baseline              │
 *   ├───────────────────────┤
 *   │ context slot          │  <section> e.g. DsaasfrContextSwitcher (département)
 *   ├───────────────────────┤
 *   │ primary nav           │  <nav>     DsfrSideMenuList, groups = secondary nav
 *   │   ▸ group             │
 *   │       sub-item        │
 *   ├───────────────────────┤
 *   │ footer slot           │  account, settings, display parameters…
 *   └───────────────────────┘
 *
 * Below the DSFR lg breakpoint (narrow window or high zoom) it turns into the DSFR
 * mobile header pattern: Vue DSFR's DsfrHeader (bloc-marque + service name + "Menu"
 * button) with the same navigation and footer in its menu modal.
 *
 * See docs/decisions/0003-brand-in-sidebar.md and 0004-narrow-screens.md.
 */
import { DsfrHeader } from '@gouvminint/vue-dsfr'
import { computed, inject, ref, watch } from 'vue'
import type { Component } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import { useNarrowViewport } from '../../composables/useNarrowViewport'
import SidebarBrand from './SidebarBrand.vue'
import SidebarNav from './SidebarNav.vue'
import type { RouteLocationRaw } from 'vue-router'
import type { DsaasfrSidebarItem, DsaasfrSidebarProps } from './DsaasfrSidebar.types'

const props = withDefaults(defineProps<DsaasfrSidebarProps>(), {
  serviceDescription: undefined,
  logoText: () => ['République', 'Française'],
  homeTo: '/',
  items: () => [],
  navLabel: 'Navigation principale',
  contextLabel: 'Périmètre',
  footerLabel: 'Mon espace',
  menuLabel: 'Menu',
  closeMenuLabel: 'Fermer',
  id: 'dsaasfr-sidebar',
})

defineSlots<{
  brand?: () => unknown
  /** The context the app works in (e.g. DsaasfrContextSwitcher), under the brand. */
  context?: () => unknown
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
function decorate(items: DsaasfrSidebarItem[], prefix: string): DsaasfrSidebarItem[] {
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

const menuItems = ref<DsaasfrSidebarItem[]>([])
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

</script>

<template>
  <!-- Wide: full-height sidebar -->
  <div
    v-if="!narrow"
    :id="id"
    class="dsaasfr-sidebar"
  >
    <header class="dsaasfr-sidebar__brand fr-enlarge-link">
      <slot name="brand">
        <SidebarBrand v-bind="brandProps" />
      </slot>
    </header>

    <section
      v-if="$slots.context"
      class="dsaasfr-sidebar__context"
      :aria-label="contextLabel"
    >
      <slot name="context" />
    </section>

    <SidebarNav
      :id="`${id}-list`"
      class="dsaasfr-sidebar__nav"
      :label="navLabel"
      :items="menuItems"
    >
      <slot v-if="$slots.default" />
    </SidebarNav>

    <section
      v-if="$slots.footer"
      class="dsaasfr-sidebar__footer"
      :aria-label="footerLabel"
    >
      <slot name="footer" />
    </section>
  </div>

  <!-- Narrow screens / high zoom: Vue DSFR's own header and its mobile menu modal -->
  <div
    v-else
    :id="id"
    class="dsaasfr-sidebar dsaasfr-sidebar--narrow"
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
          <section
            v-if="$slots.context"
            class="dsaasfr-sidebar__context dsaasfr-sidebar__context--modal"
            :aria-label="contextLabel"
          >
            <slot name="context" />
          </section>
          <SidebarNav
            :id="`${id}-list`"
            :label="navLabel"
            :items="menuItems"
          >
            <slot v-if="$slots.default" />
          </SidebarNav>
          <section
            v-if="$slots.footer"
            class="dsaasfr-sidebar__footer dsaasfr-sidebar__footer--modal"
            :aria-label="footerLabel"
          >
            <slot name="footer" />
          </section>
        </div>
      </template>
    </AppHeader>
  </div>
</template>

<style scoped>
.dsaasfr-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.dsaasfr-sidebar__brand {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--dsaasfr-space-2w);
  padding: var(--dsaasfr-space-3w) var(--dsaasfr-space-3w) var(--dsaasfr-space-2w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);

  /* Same hover/active feedback as .fr-header__brand.fr-enlarge-link. */
  --idle: transparent;
  --hover: var(--background-alt-grey-hover);
  --active: var(--background-alt-grey-active);
}

/* As in the DSFR header: keep the enlarged link focus ring inside the block,
   otherwise the scrolling sidebar clips it. */
.dsaasfr-sidebar__brand.fr-enlarge-link :deep(a[href])::before {
  outline-offset: calc(-1 * var(--dsaasfr-focus-offset));
}

.dsaasfr-sidebar__service a {
  color: var(--text-title-grey);
}

.dsaasfr-sidebar__context {
  padding: var(--dsaasfr-space-2w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);

  /* Hover pair for controls here (e.g. DsaasfrContextSwitcher), on the alt-grey sidebar. */
  --idle: transparent;
  --hover: var(--background-alt-grey-hover);
  --active: var(--background-alt-grey-active);
}

.dsaasfr-sidebar__context--modal {
  --hover: var(--background-default-grey-hover);
  --active: var(--background-default-grey-active);

  padding: 0 0 var(--dsaasfr-space-2w);
  border-bottom: 0;
}

.dsaasfr-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--dsaasfr-space-1w) var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);
}

.dsaasfr-sidebar__footer {
  /* 1w + the user menu trigger's own 1w padding line up with the nav labels. */
  padding: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);

  /* Hover pair for controls in the footer (e.g. DsaasfrUserMenu), on the alt-grey sidebar. */
  --idle: transparent;
  --hover: var(--background-alt-grey-hover);
  --active: var(--background-alt-grey-active);

  border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

.dsaasfr-sidebar--narrow {
  height: auto;
}

.dsaasfr-sidebar__footer--modal {
  --hover: var(--background-default-grey-hover);
  --active: var(--background-default-grey-active);

  border-top: 0;
  padding-left: 0;
  padding-right: 0;
}

</style>
