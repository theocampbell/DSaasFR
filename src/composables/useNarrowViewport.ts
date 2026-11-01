import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * DSFR "lg" breakpoint. Below it, DSFR switches the header to its mobile layout,
 * and so do we. 62em ≈ a 1280px screen at ~130% zoom, and well above 320px (400%).
 * Keep in sync with the `62em` media queries in component styles.
 */
export const DSFR_LG_BREAKPOINT = '62em'

/** True below the DSFR lg breakpoint (narrow window or high zoom). */
export function useNarrowViewport() {
  const narrow = ref(false)
  let query: MediaQueryList | undefined
  const update = () => {
    narrow.value = !!query?.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    query = window.matchMedia(`(max-width: calc(${DSFR_LG_BREAKPOINT} - 0.01em))`)
    update()
    query.addEventListener('change', update)
  })
  onBeforeUnmount(() => query?.removeEventListener('change', update))

  return narrow
}
