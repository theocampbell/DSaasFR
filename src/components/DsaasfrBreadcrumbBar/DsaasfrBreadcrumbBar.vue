<script setup lang="ts">
/**
 * DsaasfrBreadcrumbBar — first row of the app shell: breadcrumb on the left, the page's
 * key action(s) on the right.
 *
 * Uses the official DSFR breadcrumb markup (fr-breadcrumb, fr-breadcrumb__list,
 * fr-breadcrumb__link). Vue DSFR's DsfrBreadcrumb only takes links, so it cannot
 * host the "…" button nor the actions. See docs/decisions/0006-breadcrumb-bar.md.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouteBreadcrumb } from '../../composables/useRouteBreadcrumb'
import type { DsaasfrBreadcrumbBarProps, DsaasfrBreadcrumbItem } from './DsaasfrBreadcrumbBar.types'

const props = withDefaults(defineProps<DsaasfrBreadcrumbBarProps>(), {
  items: undefined,
  maxItems: 4,
  navigationLabel: 'vous êtes ici :',
  expandLabel: 'Afficher tous les niveaux du fil d’Ariane',
  id: undefined,
})

const uid = useId()
const listId = computed(() => props.id ?? `dsaasfr-breadcrumb-${uid}`)

defineSlots<{ actions?: () => unknown }>()

const fromRoute = useRouteBreadcrumb()
const allItems = computed<DsaasfrBreadcrumbItem[]>(() => props.items ?? fromRoute.value)

// A new trail (page change) starts collapsed again.
const expanded = ref(false)
watch(allItems, () => (expanded.value = false))

const limit = computed(() => Math.max(3, props.maxItems))
const collapsed = computed(() => !expanded.value && allItems.value.length > limit.value)

type Entry = { kind: 'item', item: DsaasfrBreadcrumbItem, index: number } | { kind: 'more' }
const entries = computed<Entry[]>(() => {
  const all = allItems.value.map((item, index) => ({ kind: 'item' as const, item, index }))
  if (!collapsed.value) return all
  // First level, "…", then the last (limit - 2) levels.
  return [all[0]!, { kind: 'more' as const }, ...all.slice(all.length - (limit.value - 2))]
})
const hiddenCount = computed(() => allItems.value.length - (limit.value - 1))

// After expanding, the "…" button disappears: move focus to the first revealed level.
const list = useTemplateRef<HTMLOListElement>('list')
async function expand() {
  expanded.value = true
  await nextTick()
  list.value?.querySelectorAll<HTMLElement>('a[href]')[1]?.focus()
}

/*
 * Layout, measured in the browser:
 * - ancestors never shrink (capped at 16rem), only the current page shrinks, down to a
 *   minimum; if the trail still does not fit on one line, it wraps (`wrapped`), at any
 *   width or text zoom, so no level is ever cut to a fragment;
 * - every label that is actually truncated gets its full text as a tooltip, on the <li>
 *   (the current page has pointer-events: none in the DSFR).
 */
const wrapped = ref(false)
async function measure() {
  const el = list.value
  if (!el) return
  wrapped.value = false
  await nextTick()
  wrapped.value = el.scrollWidth > el.clientWidth + 1
  await nextTick()
  el.querySelectorAll<HTMLElement>('.dsaasfr-breadcrumb-bar__label').forEach((label) => {
    const li = label.closest('li')
    if (!li) return
    if (label.scrollWidth > label.clientWidth + 1) li.title = label.textContent?.trim() ?? ''
    else li.removeAttribute('title')
  })
}
let observer: ResizeObserver | undefined
onMounted(() => {
  void measure()
  if (typeof ResizeObserver !== 'undefined' && list.value?.parentElement) {
    observer = new ResizeObserver(() => void measure())
    observer.observe(list.value.parentElement)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(entries, () => void measure(), { flush: 'post' })
</script>

<template>
  <div class="dsaasfr-breadcrumb-bar">
    <nav
      role="navigation"
      class="fr-breadcrumb dsaasfr-breadcrumb-bar__breadcrumb"
      :aria-label="navigationLabel"
    >
      <ol
        :id="listId"
        ref="list"
        class="fr-breadcrumb__list dsaasfr-breadcrumb-bar__list"
        :class="{ 'dsaasfr-breadcrumb-bar__list--wrapped': wrapped }"
        @focusin="measure"
        @focusout="measure"
      >
        <li
          v-for="(entry, position) in entries"
          :key="entry.kind === 'item' ? entry.index : 'more'"
          class="fr-breadcrumb__item"
        >
          <button
            v-if="entry.kind === 'more'"
            type="button"
            class="fr-breadcrumb__link dsaasfr-breadcrumb-bar__more"
            :aria-label="`${expandLabel} (${hiddenCount})`"
            @click="expand"
          >
            …
          </button>
          <!-- Current page: official DSFR rendering (a without href + aria-current). -->
          <a
            v-else-if="position === entries.length - 1"
            class="fr-breadcrumb__link dsaasfr-breadcrumb-bar__label"
            aria-current="page"
          >{{ entry.item.text }}</a>
          <!-- `custom`: RouterLink would add aria-current="page" when an ancestor's
               route is the current one; only the last level is the current page. -->
          <RouterLink
            v-else-if="entry.item.to"
            v-slot="{ href, navigate }"
            :to="entry.item.to"
            custom
          >
            <a
              class="fr-breadcrumb__link dsaasfr-breadcrumb-bar__label"
              :href="href"
              @click="navigate"
            >{{ entry.item.text }}</a>
          </RouterLink>
          <!-- Ancestor without a destination: plain text, never "current page". -->
          <span
            v-else
            class="dsaasfr-breadcrumb-bar__label fr-text--xs fr-mb-0"
          >{{ entry.item.text }}</span>
        </li>
      </ol>
    </nav>

    <div
      v-if="$slots.actions"
      class="dsaasfr-breadcrumb-bar__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-breadcrumb-bar {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);
  min-width: 0;
}

/* Layout-only overrides: no page margins, one line, labels truncated. */
.dsaasfr-breadcrumb-bar__breadcrumb.fr-breadcrumb {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
}

.dsaasfr-breadcrumb-bar__list.fr-breadcrumb__list {
  display: flex;
  align-items: center;
  min-width: 0;
  margin: 0;
  padding: 0;
  transform: none;
}

.dsaasfr-breadcrumb-bar__list > li {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  max-width: 100%;
  white-space: nowrap;
}

/* Only the current page shrinks, down to a minimum; beyond that the trail wraps. */
.dsaasfr-breadcrumb-bar__list > li:last-child {
  flex: 0 1 auto;
  min-width: min(var(--dsaasfr-breadcrumb-current-min-width), 100%);
}

.dsaasfr-breadcrumb-bar__list--wrapped.fr-breadcrumb__list {
  flex-wrap: wrap;
}

/* Once wrapped, the current page wraps its text too instead of being cut. */
.dsaasfr-breadcrumb-bar__list--wrapped > li:last-child {
  white-space: normal;
}

.dsaasfr-breadcrumb-bar__label {
  display: inline-block;
  max-width: var(--dsaasfr-breadcrumb-label-max-width);
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* Keyboard users see the full label of the focused level (the trail is re-measured on
   focusin/focusout, so it wraps if the wider label no longer fits). */
.dsaasfr-breadcrumb-bar__label:focus-visible {
  max-width: none;
}

.dsaasfr-breadcrumb-bar__list > li:last-child .dsaasfr-breadcrumb-bar__label {
  max-width: 100%;
}

/* Room for the DSFR forced-colors underline (text-underline-offset) inside overflow:hidden. */
@media (forced-colors: active) {
  .dsaasfr-breadcrumb-bar__label {
    padding-bottom: var(--dsaasfr-space-1v);
  }
}

.dsaasfr-breadcrumb-bar__more {
  vertical-align: middle;
}

/* Narrow screens / high zoom: wrap instead of squeezing labels into fragments. */
@media (width < 62em) {
  .dsaasfr-breadcrumb-bar__list.fr-breadcrumb__list {
    flex-wrap: wrap;
  }

  .dsaasfr-breadcrumb-bar__list > li {
    flex: 0 0 auto;
    max-width: 100%;
  }

  .dsaasfr-breadcrumb-bar__label {
    max-width: 100%;
    white-space: normal;
  }
}

.dsaasfr-breadcrumb-bar__actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: var(--dsaasfr-space-1w);
  margin-left: auto;
}
</style>
