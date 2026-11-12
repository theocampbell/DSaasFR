<script setup lang="ts">
/**
 * DsaasfrFilterModal — a filter with many values (the communes of a département) in its own
 * toolbar button, opening a DSFR modal (DsfrModal): the button shows its icon and the number
 * of values in use ("Communes (3)"); the modal's content comes from the default slot
 * (typically a DsaasfrSearchableCheckboxSet), with an apply button ("Afficher 12 dossiers")
 * and "Annuler".
 *
 * The behaviour lives here; the data stays in the app: it keeps a draft (reset it when
 * `open` becomes true), counts results and applies on `apply`. Built in:
 * - rendered at page level (Teleport): inside the shell's pinned bars the modal shared
 *   their stacking context and the narrow-screen DSFR header covered it (RGAA 10.4, 10.7);
 * - focus back to the button when it closes (apply, cancel, Escape);
 * - a fixed height for the content, so the modal keeps its size while a search changes it;
 *   on a short window (high zoom) no fixed height and no pinned footer, a single scrolling
 *   area, so focus is never hidden under the buttons (RGAA 10.7, 10.11).
 * See docs/decisions/0010-long-lists.md.
 */
import { computed, useId, useTemplateRef } from 'vue'
import { DsfrButton, DsfrModal } from '@gouvminint/vue-dsfr'
import type { DsaasfrFilterModalProps } from './DsaasfrFilterModal.types'

const props = withDefaults(defineProps<DsaasfrFilterModalProps>(), {
  title: undefined,
  icon: undefined,
  count: 0,
  countText: (n: number) => `${n} sélectionnée${n > 1 ? 's' : ''}`,
  applyLabel: 'Appliquer',
  cancelLabel: 'Annuler',
  fixedHeight: true,
  size: 'md',
})

const emit = defineEmits<{ apply: [], cancel: [] }>()

/** Modal open; when it becomes true, the app sets its draft from the applied filter. */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** The modal's content: a DsaasfrSearchableCheckboxSet, for instance. */
  default?: () => unknown
}>()

const text = computed(() => (props.count ? `${props.label} (${props.count})` : props.label))
// The name starts with the visible text (RGAA 7.1.3), then says what the number means.
const name = computed(() => (props.count ? `${text.value}, ${props.countText(props.count)}` : undefined))

const modalId = `dsaasfr-filter-modal-${useId()}`
const trigger = useTemplateRef<HTMLElement>('trigger')
const button = () => trigger.value?.querySelector('button')
// DsfrModal gives focus back to `origin` when it closes.
const origin = { focus: () => button()?.focus() }

function apply() {
  emit('apply')
  open.value = false
}
function cancel() {
  emit('cancel')
  open.value = false
}

defineExpose({
  /** Focus the button (e.g. after this filter was removed elsewhere). */
  focus: () => button()?.focus(),
})
</script>

<template>
  <span
    ref="trigger"
    class="dsaasfr-filter-modal__trigger"
  >
    <DsfrButton
      :label="text"
      :aria-label="name"
      :icon="icon"
      secondary
      size="sm"
      aria-haspopup="dialog"
      :aria-controls="modalId"
      @click="open = true"
    />
  </span>
  <Teleport to="body">
    <DsfrModal
      :modal-id="modalId"
      :opened="open"
      class="dsaasfr-filter-modal"
      :class="{ 'dsaasfr-filter-modal--fixed': fixedHeight }"
      :title="title ?? label"
      :size="size"
      :origin="origin"
      :actions="[
        { label: applyLabel, onClick: apply },
        { label: cancelLabel, secondary: true, onClick: cancel },
      ]"
      @close="cancel"
    >
      <div class="dsaasfr-filter-modal__content">
        <slot />
      </div>
    </DsfrModal>
  </Teleport>
</template>

<style scoped>
/* Fixed height: the modal keeps its size while its content changes (search results); the
   content scrolls inside. A 1v negative margin + 1v padding leave room for the DSFR focus
   ring, which the scrolling box would otherwise clip. */
.dsaasfr-filter-modal--fixed .dsaasfr-filter-modal__content {
  height: var(--dsaasfr-modal-list-height);
  margin: calc(-1 * var(--dsaasfr-space-1v));
  padding: var(--dsaasfr-space-1v);
  overflow-y: auto;
}

/* Short window (high zoom on a laptop): one scrolling area, the modal body; the footer is
   not pinned, so it never covers the focused control. */
@media (height < 40em) {
  .dsaasfr-filter-modal--fixed .dsaasfr-filter-modal__content {
    height: auto;
    overflow: visible;
  }

  .dsaasfr-filter-modal :deep(.fr-modal__footer) {
    position: static;
  }
}
</style>
