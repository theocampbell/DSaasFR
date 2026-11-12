<script setup lang="ts">
/**
 * DsaasfrFilterDropdown — one group of filters in the toolbar ("Instruction", "Projet"):
 * a DSFR secondary button with its icon and the number of filters in use ("Instruction
 * (2)"), opening a panel (DsaasfrDropdown) whose content comes from the default slot
 * (checkbox sets…), with "Réinitialiser" and an apply button ("Afficher 12 dossiers").
 *
 * The behaviour lives here; the data stays in the app: it fills the panel, keeps a draft
 * (reset it when `open` becomes true), counts results and applies on `apply`. Closing
 * without applying discards the draft. Applying closes the panel and gives focus back to
 * the button (RGAA 12.8). See docs/decisions/0009-filters.md.
 */
import { computed, useTemplateRef } from 'vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import DsaasfrDropdown from '../DsaasfrDropdown/DsaasfrDropdown.vue'
import type { DsaasfrFilterDropdownProps } from './DsaasfrFilterDropdown.types'

const props = withDefaults(defineProps<DsaasfrFilterDropdownProps>(), {
  icon: undefined,
  count: 0,
  countText: (n: number) => `${n} filtre${n > 1 ? 's' : ''} actif${n > 1 ? 's' : ''}`,
  applyLabel: 'Appliquer',
  resetLabel: 'Réinitialiser',
  resetDisabled: false,
  placement: 'bottom-end',
  id: undefined,
})

const emit = defineEmits<{ apply: [], reset: [] }>()

/** Panel open; when it becomes true, the app sets its draft from the applied filters. */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** The panel's content: one DsfrCheckboxSet per field of the group, for instance. */
  default?: () => unknown
}>()

const text = computed(() => (props.count ? `${props.label} (${props.count})` : props.label))
// The name starts with the visible text (RGAA 7.1.3), then says what the number means.
const name = computed(() => (props.count ? `${text.value}, ${props.countText(props.count)}` : undefined))

const dropdown = useTemplateRef<InstanceType<typeof DsaasfrDropdown>>('dropdown')
function apply(close: (returnFocus?: boolean) => void) {
  emit('apply')
  close(true)
}

defineExpose({
  /** Focus the button (e.g. after the last filter of this group was removed elsewhere). */
  focus: () => dropdown.value?.focus(),
})
</script>

<template>
  <DsaasfrDropdown
    :id="id"
    ref="dropdown"
    v-model:open="open"
    :placement="placement"
    autofocus
    :trigger-class="['fr-btn fr-btn--secondary fr-btn--sm', icon ? `fr-btn--icon-left ${icon}` : ''].join(' ')"
    :trigger-label="name"
  >
    <template #trigger>
      {{ text }}
    </template>
    <template #default>
      <div class="fr-px-2w fr-pt-1w">
        <slot />
      </div>
    </template>
    <template #footer="{ close }">
      <DsfrButton
        :label="resetLabel"
        tertiary
        no-outline
        size="sm"
        :disabled="resetDisabled"
        @click="emit('reset')"
      />
      <DsfrButton
        :label="applyLabel"
        size="sm"
        @click="apply(close)"
      />
    </template>
  </DsaasfrDropdown>
</template>
