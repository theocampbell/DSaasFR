<script setup lang="ts">
/**
 * DsaasfrPreviewPanel — content of the app shell's preview slot: sticky header (title,
 * optional actions, DSFR close button) and a scrolling body.
 *
 * Inside DsaasfrAppShell it registers its title (region name + focus target on open)
 * and closes the preview itself. Outside the shell, listen to `close`.
 * See docs/decisions/0008-preview-panel.md.
 */
import { computed, inject, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { previewContextKey } from '../DsaasfrAppShell/previewContext'
import type { DsaasfrPreviewPanelProps } from './DsaasfrPreviewPanel.types'

const props = withDefaults(defineProps<DsaasfrPreviewPanelProps>(), {
  titleTag: 'h2',
  description: undefined,
  closeText: 'Fermer',
  closeLabel: 'Fermer l’aperçu',
  hasPrevious: undefined,
  hasNext: undefined,
  previousLabel: 'Élément précédent',
  nextLabel: 'Élément suivant',
})

const emit = defineEmits<{ close: [], previous: [], next: [] }>()

const navigation = computed(() => props.hasPrevious !== undefined || props.hasNext !== undefined)

// Moving to another item keeps focus on the button (to press it again); the new item is
// announced politely instead (RGAA 7.5).
const announcement = ref('')
let navigating = false
// At either end the button stays focusable (aria-disabled, not disabled): a disabled
// button would drop the focus it holds (RGAA 7.3.2).
function go(direction: 'previous' | 'next') {
  if ((direction === 'previous' ? props.hasPrevious : props.hasNext) === false) return
  navigating = true
  if (direction === 'previous') emit('previous')
  else emit('next')
}
watch(() => props.title, (title) => {
  if (navigating) announcement.value = title
  navigating = false
})

defineSlots<{
  default?: () => unknown
  actions?: () => unknown
  footer?: () => unknown
}>()

const headingId = `dsaasfr-preview-title-${useId()}`
const shell = inject(previewContextKey, null)

onMounted(() => shell?.registerHeading(headingId))
onBeforeUnmount(() => shell?.registerHeading(undefined))

function close() {
  emit('close')
  shell?.close()
}
</script>

<template>
  <div class="dsaasfr-preview-panel">
    <div class="dsaasfr-preview-panel__header">
      <div class="dsaasfr-preview-panel__heading">
        <component
          :is="titleTag"
          :id="headingId"
          class="fr-h6 fr-mb-0 dsaasfr-preview-panel__title"
          tabindex="-1"
        >
          {{ title }}
        </component>
        <p
          v-if="description"
          class="fr-text--sm fr-mb-0 dsaasfr-preview-panel__description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="navigation"
        class="dsaasfr-preview-panel__nav"
      >
        <button
          type="button"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-up-s-line"
          :title="previousLabel"
          :aria-disabled="hasPrevious === false ? 'true' : undefined"
          @click="go('previous')"
        >
          {{ previousLabel }}
        </button>
        <button
          type="button"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-arrow-down-s-line"
          :title="nextLabel"
          :aria-disabled="hasNext === false ? 'true' : undefined"
          @click="go('next')"
        >
          {{ nextLabel }}
        </button>
      </div>
      <!-- Official DSFR close button (as in fr-modal). -->
      <button
        type="button"
        class="fr-btn--close fr-btn"
        :aria-label="closeLabel"
        @click="close"
      >
        {{ closeText }}
      </button>
    </div>

    <div
      v-if="$slots.actions"
      class="dsaasfr-preview-panel__actions"
    >
      <slot name="actions" />
    </div>

    <p
      class="fr-sr-only"
      role="status"
    >
      {{ announcement }}
    </p>

    <div class="dsaasfr-preview-panel__body">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="dsaasfr-preview-panel__footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-preview-panel {
  background-color: inherit;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.dsaasfr-preview-panel__header {
  position: sticky;
  z-index: 1;
  top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dsaasfr-space-2w);
  padding: var(--dsaasfr-space-2w) var(--dsaasfr-space-3w);
  border-bottom: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);

  /* Same surface as the panel (default grey when pushed, overlap grey when floating). */
  background-color: inherit;
}

.dsaasfr-preview-panel__heading {
  flex: 1;
  min-width: 0;
}

.dsaasfr-preview-panel__nav {
  display: flex;
  flex: 0 0 auto;
}

/* DSFR disabled look (.fr-btn--tertiary-no-outline:disabled) for buttons kept focusable. */
.dsaasfr-preview-panel__nav .fr-btn[aria-disabled='true'] {
  color: var(--text-disabled-grey);
  cursor: not-allowed;
}

.dsaasfr-preview-panel__title {
  overflow-wrap: anywhere;
}

/* Focus lands here on open (to be announced); the DSFR focus ring stays visible for
   keyboard users only. */
.dsaasfr-preview-panel__title:focus:not(:focus-visible) {
  outline: none;
}

.dsaasfr-preview-panel__description {
  color: var(--text-mention-grey);
}

.dsaasfr-preview-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dsaasfr-space-1w);
  padding: var(--dsaasfr-space-2w) var(--dsaasfr-space-3w) 0;
}

.dsaasfr-preview-panel__body {
  flex: 1;
  padding: var(--dsaasfr-space-3w);
}

.dsaasfr-preview-panel__footer {
  position: sticky;
  z-index: 1;
  bottom: 0;
  padding: var(--dsaasfr-space-2w) var(--dsaasfr-space-3w);
  border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: inherit;
}
</style>
