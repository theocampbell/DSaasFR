<script setup lang="ts">
/**
 * DsaasfrContextSwitcher — the context the whole app works in (a département, an
 * organisation…), as a trigger opening the other choices. Goes in DsaasfrSidebar's
 * `context` slot, under the service name.
 *
 * Pattern: the DSFR language selector (DsfrLanguageSelector): a disclosure button showing
 * the current value, opening a list of LINKS, the current one with aria-current="true".
 * Links, because switching context is a change of context the user triggers (RGAA 7.4).
 * No search field in the panel: with many choices, `moreLink` leads to a page listing
 * them all. Built on DsaasfrDropdown (Escape, click outside, tab out, focus return).
 *
 * See docs/decisions/0011-context-switcher.md.
 */
import { computed, useId } from 'vue'
import { RouterLink } from 'vue-router'
import DsaasfrDropdown from '../DsaasfrDropdown/DsaasfrDropdown.vue'
import type { DsaasfrContextSwitcherItem, DsaasfrContextSwitcherProps } from './DsaasfrContextSwitcher.types'

const props = withDefaults(defineProps<DsaasfrContextSwitcherProps>(), {
  items: () => [],
  groups: () => [],
  moreLink: undefined,
  listLabel: undefined,
  placement: 'bottom',
  id: undefined,
})

const emit = defineEmits<{ select: [item: DsaasfrContextSwitcherItem] }>()

const open = defineModel<boolean>('open', { default: false })

const uid = useId()
const baseId = computed(() => props.id ?? `dsaasfr-context-switcher-${uid}`)
const listLabel = computed(() => props.listLabel ?? `${props.label} : changer`)

function select(item: DsaasfrContextSwitcherItem, close: () => void) {
  emit('select', item)
  close()
}

const itemClass = (item: DsaasfrContextSwitcherItem) => [
  'fr-btn fr-btn--tertiary-no-outline fr-btn--sm dsaasfr-context-switcher__item',
  { 'fr-text--bold dsaasfr-context-switcher__item--current': item.current },
]
</script>

<template>
  <DsaasfrDropdown
    :id="baseId"
    v-model:open="open"
    class="dsaasfr-context-switcher"
    :placement="placement === 'top' ? 'top-stretch' : 'bottom-stretch'"
    trigger-class="dsaasfr-context-switcher__trigger"
    :trigger-label="`${label} : ${current}`"
    autofocus
  >
    <template #trigger>
      <!-- Accessible name set above: the two lines would otherwise be read as one word
           ("DépartementGironde"). It contains the visible text (RGAA 7.1.3). -->
      <span class="dsaasfr-context-switcher__value">
        <span class="fr-text--xs dsaasfr-context-switcher__label">{{ label }}</span>
        <span class="fr-text--sm fr-text--bold dsaasfr-context-switcher__current">{{ current }}</span>
      </span>
      <span
        class="dsaasfr-context-switcher__chevron"
        :class="placement === 'top' ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
        aria-hidden="true"
      />
    </template>

    <template #default="{ close }">
      <ul
        v-if="items.length"
        class="dsaasfr-context-switcher__list"
        :aria-label="listLabel"
      >
        <li
          v-for="item in items"
          :key="item.text"
        >
          <RouterLink
            v-if="item.to"
            :to="item.to"
            :class="itemClass(item)"
            :aria-current="item.current ? 'true' : undefined"
            @click="select(item, close)"
          >
            {{ item.text }}
          </RouterLink>
          <a
            v-else
            :href="item.href"
            :class="itemClass(item)"
            :aria-current="item.current ? 'true' : undefined"
            @click="select(item, close)"
          >{{ item.text }}</a>
        </li>
      </ul>

      <template
        v-for="(group, g) in groups"
        :key="group.title"
      >
        <p
          :id="`${baseId}-group-${g}`"
          class="fr-text--xs fr-text--bold fr-mb-0 dsaasfr-context-switcher__group-title"
        >
          {{ group.title }}
        </p>
        <ul
          class="dsaasfr-context-switcher__list"
          :aria-labelledby="`${baseId}-group-${g}`"
        >
          <li
            v-for="item in group.items"
            :key="item.text"
          >
            <RouterLink
              v-if="item.to"
              :to="item.to"
              :class="itemClass(item)"
              :aria-current="item.current ? 'true' : undefined"
              @click="select(item, close)"
            >
              {{ item.text }}
            </RouterLink>
            <a
              v-else
              :href="item.href"
              :class="itemClass(item)"
              :aria-current="item.current ? 'true' : undefined"
              @click="select(item, close)"
            >{{ item.text }}</a>
          </li>
        </ul>
      </template>

      <div
        v-if="moreLink"
        class="dsaasfr-context-switcher__more"
      >
        <RouterLink
          v-if="moreLink.to"
          :to="moreLink.to"
          :class="itemClass(moreLink)"
          @click="select(moreLink, close)"
        >
          {{ moreLink.text }}
        </RouterLink>
        <a
          v-else
          :href="moreLink.href"
          :class="itemClass(moreLink)"
          @click="select(moreLink, close)"
        >{{ moreLink.text }}</a>
      </div>
    </template>
  </DsaasfrDropdown>
</template>

<style scoped>
/* Same custom trigger as DsaasfrUserMenu (two lines do not fit fr-btn): inherits the
   --idle/--hover/--active pair, copies the fr-translate__btn expanded state. See 0011. */
.dsaasfr-context-switcher :deep(.dsaasfr-context-switcher__trigger) {
  display: flex;
  align-items: center;
  gap: var(--dsaasfr-space-1w);
  width: 100%;
  padding: var(--dsaasfr-space-1w);
  border: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  text-align: left;
  color: var(--text-default-grey);
  background-color: var(--idle);
}

.dsaasfr-context-switcher :deep(.dsaasfr-context-switcher__trigger:hover) {
  background-color: var(--hover);
}

.dsaasfr-context-switcher :deep(.dsaasfr-context-switcher__trigger:active) {
  background-color: var(--active);
}

.dsaasfr-context-switcher :deep(.dsaasfr-context-switcher__trigger[aria-expanded="true"]) {
  --idle: transparent;
  --hover: var(--background-open-blue-france-hover);
  --active: var(--background-open-blue-france-active);

  background-color: var(--background-open-blue-france);
  color: var(--text-active-blue-france);
}

.dsaasfr-context-switcher :deep(.dsaasfr-context-switcher__trigger[aria-expanded="true"]:hover) {
  background-color: var(--hover);
}

.dsaasfr-context-switcher__value {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dsaasfr-context-switcher__label,
.dsaasfr-context-switcher__current {
  margin: 0;
  overflow-wrap: anywhere;
}

.dsaasfr-context-switcher__label {
  color: var(--text-mention-grey);
}

.dsaasfr-context-switcher__chevron {
  color: var(--text-action-high-blue-france);
}

.dsaasfr-context-switcher :deep([aria-expanded="true"]) .dsaasfr-context-switcher__chevron {
  transform: rotate(-180deg);
}

@media (prefers-reduced-motion: no-preference) {
  .dsaasfr-context-switcher__chevron {
    transition: transform 0.3s;
  }
}

.dsaasfr-context-switcher__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsaasfr-context-switcher__list > li {
  padding: 0;
}

.dsaasfr-context-switcher__group-title {
  padding: var(--dsaasfr-space-1w) var(--dsaasfr-space-2w) var(--dsaasfr-space-1v);
  color: var(--text-mention-grey);
}

.dsaasfr-context-switcher__item {
  width: 100%;
  max-width: none;
}

/* Current choice: the DSFR active-navigation marker (blue bar on the left, as
   fr-nav__link[aria-current]), not colour alone (RGAA 3.1). */
.dsaasfr-context-switcher__item--current {
  box-shadow: inset var(--dsaasfr-space-1v) 0 0 0 var(--border-active-blue-france);
  color: var(--text-active-blue-france);
}

.dsaasfr-context-switcher__more {
  margin-top: var(--dsaasfr-space-1w);
  padding-top: var(--dsaasfr-space-1w);
  border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}
</style>
