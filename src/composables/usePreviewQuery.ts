import { computed, inject } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'

/**
 * Keeps the previewed item in the URL query (`?apercu=D-2026-2041`), so a preview can be
 * shared or reloaded, and the browser Back button closes it.
 *
 * - `open(id)` pushes a history entry (Back closes the preview); `open(id, { replace: true })`
 *   moves to another item without one (previous / next);
 * - `close()` replaces the entry (Back then goes to where the user was before opening).
 *
 * Bind `isOpen` to DsaasfrAppShell's `v-model:preview-open` and read `item` to know what
 * to show.
 */
export function usePreviewQuery(key = 'apercu') {
  const router = inject(routerKey, null)
  const route = inject(routeLocationKey, null)

  const item = computed(() => {
    const value = route?.query[key]
    return typeof value === 'string' && value ? value : undefined
  })

  /** `replace: true` to move to another item without a new history entry (previous/next). */
  function open(id: string, options: { replace?: boolean } = {}) {
    if (!router || !route || item.value === id) return
    const location = { query: { ...route.query, [key]: id } }
    void (options.replace ? router.replace(location) : router.push(location))
  }

  function close() {
    if (!router || !route || item.value === undefined) return
    const query = { ...route.query }
    delete query[key]
    void router.replace({ query })
  }

  const isOpen = computed({
    get: () => item.value !== undefined,
    set: (value: boolean) => {
      if (!value) close()
    },
  })

  return { item, isOpen, open, close }
}
