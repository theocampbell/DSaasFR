<script setup lang="ts">
/**
 * DsaasfrFilterChip — one active filter, Linear-style: [field] [operator] [values] [×].
 *
 * Presentational: it shows what it is given. Each part whose slot is provided becomes a
 * button opening a DsaasfrDropdown with that slot's content (+ the shared `footer` slot,
 * e.g. an "Appliquer" button) (the app decides what to
 * show: field list, operator choice, value checkboxes). Parts without a slot are plain
 * text. × emits `remove`. Filter logic (fields, values, applying them) stays in the app.
 * Looks like a DSFR neutral tag split into segments. See docs/decisions/0009-filters.md.
 */
import { computed } from 'vue'
import DsaasfrDropdown from '../DsaasfrDropdown/DsaasfrDropdown.vue'
import type { DsaasfrFilterChipPart, DsaasfrFilterChipProps } from './DsaasfrFilterChip.types'

const props = withDefaults(defineProps<DsaasfrFilterChipProps>(), {
  operator: undefined,
  values: () => [],
  maxVisibleValues: 2,
  maxValuesLength: 32,
  emptyValuesText: 'Choisir…',
  groupLabel: 'Filtre',
  editFieldLabel: 'Modifier le champ :',
  editOperatorLabel: 'Modifier la condition :',
  editValuesLabel: 'Modifier les valeurs :',
  removeLabel: 'Retirer le filtre',
})

const emit = defineEmits<{ remove: [] }>()

/** Which part's dropdown is open (lets the app open "values" right after adding a filter). */
const openPart = defineModel<DsaasfrFilterChipPart | undefined>('openPart', { default: undefined })

const slots = defineSlots<{
  field?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
  operator?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
  values?: (scope: { close: (returnFocus?: boolean) => void }) => unknown
  /** Pinned footer of the open part's panel (e.g. "Appliquer"); `part` tells which one. */
  footer?: (scope: { part: DsaasfrFilterChipPart, close: (returnFocus?: boolean) => void }) => unknown
}>()

/**
 * Values summary that keeps the chip on one line: as many values as fit in
 * `maxValuesLength` characters (at most `maxVisibleValues`, at least one), then
 * "et N autres". A single very long value is shortened by CSS with a tooltip.
 */
const valuesText = computed(() => {
  const { values, maxVisibleValues, maxValuesLength } = props
  if (!values.length) return props.emptyValuesText
  const shown: string[] = []
  for (const value of values) {
    const next = [...shown, value].join(', ')
    if (shown.length && (shown.length >= maxVisibleValues || next.length > maxValuesLength)) break
    shown.push(value)
  }
  const rest = values.length - shown.length
  return rest ? `${shown.join(', ')} et ${rest} autre${rest > 1 ? 's' : ''}` : shown.join(', ')
})
const fullValues = computed(() => props.values.join(', '))

/** Values in the chip's accessible name: all of them up to 10, then "et N autres" (a long
 * list, e.g. 200 communes, would otherwise be read out in full). */
const NAMED_VALUES = 10
const namedValues = computed(() => {
  const { values } = props
  if (!values.length) return props.emptyValuesText
  const rest = values.length - NAMED_VALUES
  return rest > 0
    ? `${values.slice(0, NAMED_VALUES).join(', ')} et ${rest} autre${rest > 1 ? 's' : ''}`
    : values.join(', ')
})
const groupName = computed(() =>
  [`${props.groupLabel} :`, props.field, props.operator, namedValues.value].filter(Boolean).join(' '))

interface PartDef { part: DsaasfrFilterChipPart, text: string, label: string }
const parts = computed<PartDef[]>(() => [
  { part: 'field', text: props.field, label: props.editFieldLabel },
  ...(props.operator ? [{ part: 'operator' as const, text: props.operator, label: props.editOperatorLabel }] : []),
  {
    part: 'values',
    text: valuesText.value,
    label: props.editValuesLabel,
    // The chip's group name already carries the full list of values.
  },
])

function setOpen(part: DsaasfrFilterChipPart, open: boolean) {
  if (open) openPart.value = part
  else if (openPart.value === part) openPart.value = undefined
}
</script>

<template>
  <div
    class="dsaasfr-filter-chip"
    role="group"
    :aria-label="groupName"
  >
    <template
      v-for="p in parts"
      :key="p.part"
    >
      <DsaasfrDropdown
        v-if="slots[p.part]"
        class="dsaasfr-filter-chip__part"
        :class="`dsaasfr-filter-chip__part--${p.part}`"
        placement="bottom-start"
        autofocus
        :trigger-class="['dsaasfr-filter-chip__button', 'fr-text--sm', 'fr-m-0', p.part === 'field' ? 'fr-text--bold' : '']"
        :trigger-label="`${p.label} ${p.text}`"
        :trigger-title="p.part === 'values' && fullValues !== p.text ? fullValues : undefined"
        :open="openPart === p.part"
        @update:open="setOpen(p.part, $event)"
      >
        <template #trigger>
          {{ p.text }}
        </template>
        <template #default="{ close }">
          <slot
            :name="p.part"
            :close="close"
          />
        </template>
        <template
          v-if="slots.footer"
          #footer="{ close }"
        >
          <slot
            name="footer"
            :part="p.part"
            :close="close"
          />
        </template>
      </DsaasfrDropdown>
      <span
        v-else
        class="dsaasfr-filter-chip__part dsaasfr-filter-chip__text fr-text--sm fr-m-0"
        :class="[`dsaasfr-filter-chip__part--${p.part}`, { 'fr-text--bold': p.part === 'field' }]"
      >{{ p.text }}</span>
    </template>

    <button
      type="button"
      class="dsaasfr-filter-chip__remove fr-icon-close-line fr-icon--sm"
      :aria-label="`${removeLabel} ${field}`"
      :title="`${removeLabel} ${field}`"
      @click="emit('remove')"
    />
  </div>
</template>

<style scoped>
/* A DSFR neutral tag (fr-tag) split into segments: same surface, radius, height, text. */
.dsaasfr-filter-chip {
  display: inline-flex;
  align-items: stretch;
  max-width: 100%;
  border-radius: var(--dsaasfr-chip-radius);
  background-color: var(--background-contrast-grey);
  color: var(--text-label-grey);
  vertical-align: top;

  --idle: transparent;
  --hover: var(--background-contrast-grey-hover);
  --active: var(--background-contrast-grey-active);
}

.dsaasfr-filter-chip__part {
  display: flex;
  min-width: 0;
}

.dsaasfr-filter-chip__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--dsaasfr-chip-height);
  min-height: var(--dsaasfr-chip-height);
  padding: 0 var(--dsaasfr-space-1w) 0 var(--dsaasfr-space-3v);
  border-radius: 0 var(--dsaasfr-chip-radius) var(--dsaasfr-chip-radius) 0;
  background-color: var(--idle);
}

.dsaasfr-filter-chip__part + .dsaasfr-filter-chip__part,
.dsaasfr-filter-chip__part + .dsaasfr-filter-chip__remove {
  border-left: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

.dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button),
.dsaasfr-filter-chip__text {
  display: flex;
  align-items: center;
  min-height: var(--dsaasfr-chip-height);
  padding: 0 var(--dsaasfr-space-3v);
  color: inherit;
  text-align: left;
}

/* Wide screens: one line. Values are summarised to fit (valuesText); a single very long
   value is shortened with an ellipsis and a tooltip, its full text stays in the names. */
.dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button) {
  display: block;
  max-width: var(--dsaasfr-chip-part-max-width);
  overflow: hidden;
  line-height: var(--dsaasfr-chip-height);
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: var(--idle);
}

.dsaasfr-filter-chip__part--field {
  flex-shrink: 0;
}

.dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button:hover),
.dsaasfr-filter-chip__remove:hover {
  background-color: var(--hover);
}

.dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button:active),
.dsaasfr-filter-chip__remove:active {
  background-color: var(--active);
}

.dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button[aria-expanded="true"]) {
  background-color: var(--background-open-blue-france);
  color: var(--text-active-blue-france);
}

/* Rounded ends follow the chip. */
.dsaasfr-filter-chip > :first-child :deep(.dsaasfr-filter-chip__button),
.dsaasfr-filter-chip > .dsaasfr-filter-chip__text:first-child {
  border-radius: var(--dsaasfr-chip-radius) 0 0 var(--dsaasfr-chip-radius);
}

/* Narrow screens / high zoom: never cut text (RGAA 10.11). Parts wrap their text and the
   chip wraps its parts. */
@media (width < 62em) {
  .dsaasfr-filter-chip {
    flex-wrap: wrap;
  }

  /* Field, condition and × on the first row; the values on a full second row. */
  .dsaasfr-filter-chip__part--values {
    order: 1;
    flex-basis: 100%;
    border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  }

  .dsaasfr-filter-chip .dsaasfr-filter-chip__part--values {
    border-left: 0;
  }

  .dsaasfr-filter-chip__remove {
    margin-left: auto;
  }

  .dsaasfr-filter-chip__part--values :deep(.dsaasfr-filter-chip__button) {
    width: 100%;
    max-width: none;
    padding-left: var(--dsaasfr-space-3v);
    border-radius: 0 0 var(--dsaasfr-chip-radius) var(--dsaasfr-chip-radius);
  }

  .dsaasfr-filter-chip :deep(.dsaasfr-filter-chip__button) {
    display: flex;
    overflow: visible;
    line-height: inherit;
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
