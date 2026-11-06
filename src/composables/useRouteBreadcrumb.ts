import { computed, inject } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { DsaasfrBreadcrumbItem } from '../components/DsaasfrBreadcrumbBar/DsaasfrBreadcrumbBar.types'

/** Breadcrumb label of a route: a string, a function of the current route, or `false` to skip it. */
export type DsaasfrRouteBreadcrumb = string | ((route: RouteLocationNormalizedLoaded) => string) | false

declare module 'vue-router' {
  interface RouteMeta {
    /** Label of this level in DsaasfrBreadcrumbBar. Falls back to `title`. `false` hides the level. */
    breadcrumb?: DsaasfrRouteBreadcrumb
    /** Page title, used by the breadcrumb when `breadcrumb` is not set. */
    title?: string | ((route: RouteLocationNormalizedLoaded) => string)
  }
}

/**
 * Builds the breadcrumb from the URL: every path prefix (`/`, `/dossiers`,
 * `/dossiers/2041`) is resolved by the router, and the matching route's
 * `meta.breadcrumb` (or `meta.title`) gives its label. Works with flat and nested
 * routes. Levels without a label are skipped. The last item is the current page.
 */
export function useRouteBreadcrumb() {
  const router = inject(routerKey, null)
  const route = inject(routeLocationKey, null)

  return computed<DsaasfrBreadcrumbItem[]>(() => {
    if (!router || !route) return []
    const segments = route.path.split('/').filter(Boolean)
    const prefixes = ['/', ...segments.map((_, i) => `/${segments.slice(0, i + 1).join('/')}`)]
    const items: DsaasfrBreadcrumbItem[] = []

    for (const path of prefixes) {
      const resolved = router.resolve(path)
      const record = resolved.matched[resolved.matched.length - 1]
      if (!record) continue
      // A prefix that only matches a catch-all ("/:pathMatch(.*)*", e.g. "Page introuvable")
      // is not a level of the trail — unless it is the current page itself.
      const isCatchAll = /\(\.\*\)/.test(record.path)
      if (isCatchAll && path !== prefixes[prefixes.length - 1]) continue
      const label = record.meta.breadcrumb ?? record.meta.title
      if (label === false || label === undefined) continue
      const text = typeof label === 'function' ? label(resolved as RouteLocationNormalizedLoaded) : label
      if (text) items.push({ text, to: path })
    }

    // The current page is the last item and is not a link.
    const last = items[items.length - 1]
    if (last && last.to === (route.path.replace(/\/$/, '') || '/')) delete last.to
    return items
  })
}
