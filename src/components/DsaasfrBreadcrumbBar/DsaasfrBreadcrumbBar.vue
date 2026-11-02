<script setup lang="ts">
/**
 * DsaasfrBreadcrumbBar — first row of the app shell: breadcrumb on the left, the page's
 * key action(s) on the right.
 *
 * Uses the official DSFR breadcrumb markup (fr-breadcrumb, fr-breadcrumb__list,
 * fr-breadcrumb__link). Vue DSFR's DsfrBreadcrumb only takes links, so it cannot
 * host the "…" button nor the actions. See docs/decisions/0006-breadcrumb-bar.md.
 */
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouteBreadcrumb } from '../../composables/useRouteBreadcrumb'
import type { DsaasfrBreadcrumbBarProps, DsaasfrBreadcrumbItem } from './DsaasfrBreadcrumbBar.types'

const props = withDefaults(defineProps<DsaasfrBreadcrumbBarProps>(), {
  items: undefined,
  maxItems: 4,
  navigationLabel: 'vous êtes ici :',
  expandLabel: 'Afficher tous les niveaux du fil d’Ariane',
  id: 'dsaasfr-breadcrumb',
})

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

// Labels long enough to be visually truncated get a tooltip with the full text.
const LONG_LABEL = 32
const titleOf = (item: DsaasfrBreadcrumbItem) => (item.text.length > LONG_LABEL ? item.text : undefined)

// After expanding, the "…" button disappears: move focus to the first revealed level.
const list = useTemplateRef<HTMLOListElement>('list')
async function expand() {
  expanded.value = true
  await nextTick()
  list.value?.querySelectorAll<HTMLElement>('.fr-breadcrumb__link')[1]?.focus()
}
</script>

<template>
  <div class="dsaasfr-breadcrumb-bar">
    <nav
      role="navigation"
      class="fr-breadcrumb dsaasfr-breadcrumb-bar__breadcrumb"
      :aria-label="navigationLabel"
    >
      <ol
        :id="id"
        ref="list"
        class="fr-breadcrumb__list dsaasfr-breadcrumb-bar__list"
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
            :aria-expanded="false"
            :aria-controls="id"
            @click="expand"
          >
            …
          </button>
          <RouterLink
            v-else-if="entry.item.to && position < entries.length - 1"
            class="fr-breadcrumb__link dsaasfr-breadcrumb-bar__link"
            :to="entry.item.to"
            :title="titleOf(entry.item)"
          >
            {{ entry.item.text }}
          </RouterLink>
          <a
            v-else
            class="fr-breadcrumb__link dsaasfr-breadcrumb-bar__link"
            aria-current="page"
            :title="titleOf(entry.item)"
          >{{ entry.item.text }}</a>
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
  flex: 0 1 auto;
  align-items: center;
  min-width: 0;
  white-space: nowrap;
}

/* The current page keeps priority over its ancestors when space is short. */
.dsaasfr-breadcrumb-bar__list > li:last-child {
  flex-shrink: 0.5;
}

.dsaasfr-breadcrumb-bar__link {
  display: inline-block;
  max-width: var(--dsaasfr-breadcrumb-label-max-width);
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
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

  .dsaasfr-breadcrumb-bar__link {
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
