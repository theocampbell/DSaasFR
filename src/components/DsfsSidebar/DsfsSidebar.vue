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
 * See docs/decisions/0003-brand-in-sidebar.md.
 */
import { DsfrLogo, DsfrSideMenuList } from '@gouvminint/vue-dsfr'
import { computed, inject, ref, watch } from 'vue'
import { RouterLink, routeLocationKey, routerKey } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import type { DsfsSidebarItem, DsfsSidebarProps } from './DsfsSidebar.types'

const props = withDefaults(defineProps<DsfsSidebarProps>(), {
  serviceDescription: undefined,
  logoText: () => ['République', 'Française'],
  homeTo: '/',
  items: () => [],
  navLabel: 'Navigation principale',
  id: 'dsfs-sidebar',
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
        active: item.active ?? hasActiveChild,
        expanded: item.expanded ?? hasActiveChild,
      }
    }
    return { ...item, active: item.active ?? isCurrent(item.to) }
  })
}

const menuItems = ref<DsfsSidebarItem[]>([])
watch(
  () => [props.items, route?.path] as const,
  () => {
    menuItems.value = decorate(props.items, props.id)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div
    :id="id"
    class="dsfs-sidebar"
  >
    <header class="dsfs-sidebar__brand fr-enlarge-link">
      <slot name="brand">
        <DsfrLogo
          :logo-text="logoText"
          small
        />
        <div class="dsfs-sidebar__service">
          <component
            :is="homeIsRouterLink ? RouterLink : 'a'"
            v-bind="homeIsRouterLink ? { to: homeTo } : { href: homeHref }"
            :title="homeTitle"
          >
            <p class="dsfs-sidebar__service-title fr-text--lg fr-text--bold fr-mb-0">
              {{ serviceTitle }}
            </p>
          </component>
          <p
            v-if="serviceDescription"
            class="fr-text--sm fr-mb-0 dsfs-sidebar__service-description"
          >
            {{ serviceDescription }}
          </p>
        </div>
      </slot>
    </header>

    <nav
      class="dsfs-sidebar__nav fr-sidemenu"
      :aria-label="navLabel"
    >
      <slot>
        <DsfrSideMenuList
          :id="`${id}-list`"
          :menu-items="menuItems"
        />
      </slot>
    </nav>

    <div
      v-if="$slots.footer"
      class="dsfs-sidebar__footer"
    >
      <slot name="footer" />
    </div>
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
.dsfs-sidebar__brand.fr-enlarge-link :deep(a[href])::before {
  outline-offset: calc(-1 * var(--dsfs-focus-offset));
}

.dsfs-sidebar__service a {
  color: var(--text-title-grey);
}

.dsfs-sidebar__service-description {
  color: var(--text-mention-grey);
}

/* Application nav: drop the in-page sidemenu offsets, keep DSFR items as-is. */
.dsfs-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--dsfs-space-1w) var(--dsfs-space-1w) var(--dsfs-space-2w);
}

.dsfs-sidebar__nav.fr-sidemenu {
  margin: 0;

  /* Below 48em DSFR draws inset borders for the in-page mobile sidemenu. */
  box-shadow: none;
}

.dsfs-sidebar__footer {
  padding: var(--dsfs-space-2w) var(--dsfs-space-3w);
  border-top: var(--dsfs-shell-border-width) solid var(--border-default-grey);
}
</style>
