<script setup lang="ts">
/**
 * DsaasfrToolbar — second row of the app shell: generic container with a `start`
 * (left) and an `end` (right) slot. Apps decide what goes where: buttons, triggers,
 * active filters, view switches… The toolbar owns layout only.
 *
 * Not `role="toolbar"`: the ARIA toolbar pattern requires a single tab stop with arrow
 * keys, which does not suit mixed content (filter chips, menus, buttons). With a
 * `label`, it is a labelled group. See docs/decisions/0007-toolbar.md.
 */
import type { DsaasfrToolbarProps } from './DsaasfrToolbar.types'

const props = defineProps<DsaasfrToolbarProps>()

defineSlots<{
  start?: () => unknown
  end?: () => unknown
}>()
</script>

<template>
  <div
    class="dsaasfr-toolbar"
    :role="props.label ? 'group' : undefined"
    :aria-label="props.label"
  >
    <div
      v-if="$slots.start"
      class="dsaasfr-toolbar__start"
    >
      <slot name="start" />
    </div>
    <div
      v-if="$slots.end"
      class="dsaasfr-toolbar__end"
    >
      <slot name="end" />
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-toolbar {
  display: flex;
  flex: 1 1 100%;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w);
  min-width: 0;
}

.dsaasfr-toolbar__start,
.dsaasfr-toolbar__end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dsaasfr-space-1w);
  min-width: 0;
}

.dsaasfr-toolbar__start {
  flex: 1 1 auto;
}

.dsaasfr-toolbar__end {
  flex: 0 1 auto;
  margin-left: auto;
}

/* Items keep their natural width and wrap as a whole instead of being squeezed until
   their labels break; max-width keeps a very long one inside the row at 320px. */
.dsaasfr-toolbar__start > :deep(*),
.dsaasfr-toolbar__end > :deep(*) {
  flex: 0 0 auto;
  max-width: 100%;
}
</style>
