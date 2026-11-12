<script setup lang="ts">
/**
 * DsaasfrUserMenu — the signed-in person, as a trigger opening account actions.
 *
 * Pattern: disclosure (button + aria-expanded/aria-controls + list of links and
 * buttons), like the DSFR header menus and DsfrLanguageSelector — not an ARIA
 * `role="menu"`. Built on DsaasfrDropdown (Escape, click outside, tab out, focus return).
 *
 * See docs/decisions/0005-user-menu.md.
 */
import { RouterLink } from 'vue-router'
import DsaasfrDropdown from '../DsaasfrDropdown/DsaasfrDropdown.vue'
import type { DsaasfrUserMenuItem, DsaasfrUserMenuProps } from './DsaasfrUserMenu.types'

const props = withDefaults(defineProps<DsaasfrUserMenuProps>(), {
  description: undefined,
  items: () => [],
  menuLabel: 'Mon compte',
  placement: 'top',
  id: 'dsaasfr-user-menu',
})

const emit = defineEmits<{ select: [item: DsaasfrUserMenuItem] }>()

const open = defineModel<boolean>('open', { default: false })

function select(item: DsaasfrUserMenuItem, close: () => void) {
  emit('select', item)
  item.action?.()
  close()
}

const itemClass = (item: DsaasfrUserMenuItem) => [
  'fr-btn fr-btn--tertiary-no-outline fr-btn--sm dsaasfr-user-menu__item',
  item.icon ? `fr-btn--icon-left ${item.icon}` : '',
]
</script>

<template>
  <DsaasfrDropdown
    :id="id"
    v-model:open="open"
    class="dsaasfr-user-menu"
    :placement="props.placement === 'top' ? 'top-stretch' : 'bottom-stretch'"
    trigger-class="dsaasfr-user-menu__trigger"
  >
    <template #trigger>
      <span
        class="dsaasfr-user-menu__avatar fr-icon-account-circle-line"
        aria-hidden="true"
      />
      <span class="dsaasfr-user-menu__identity">
        <span class="fr-text--sm fr-text--bold dsaasfr-user-menu__name">{{ name }}</span>
        <span
          v-if="description"
          class="fr-text--xs dsaasfr-user-menu__description"
        >{{ description }}</span>
      </span>
      <span
        class="dsaasfr-user-menu__chevron"
        :class="props.placement === 'top' ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
        aria-hidden="true"
      />
    </template>

    <template #default="{ close }">
      <ul
        class="dsaasfr-user-menu__list"
        :aria-label="menuLabel"
      >
        <li
          v-for="item in items"
          :key="item.text"
          :class="{ 'dsaasfr-user-menu__entry--separated': item.separated }"
        >
          <RouterLink
            v-if="item.to"
            :to="item.to"
            :class="itemClass(item)"
            @click="select(item, close)"
          >
            {{ item.text }}
          </RouterLink>
          <a
            v-else-if="item.href"
            :href="item.href"
            :class="itemClass(item)"
            @click="select(item, close)"
          >{{ item.text }}</a>
          <button
            v-else
            type="button"
            :class="itemClass(item)"
            @click="select(item, close)"
          >
            {{ item.text }}
          </button>
        </li>
        <slot :close="close" />
      </ul>
    </template>
  </DsaasfrDropdown>
</template>

<style scoped>
/* Custom trigger (two-line name + role does not fit fr-btn). It inherits the
   --idle/--hover/--active pair from its container, like DSFR tertiary buttons,
   and copies the fr-translate__btn expanded state. See 0005. */
.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger) {
  display: flex;
  align-items: center;
  gap: var(--dsaasfr-space-3v);
  width: 100%;
  padding: var(--dsaasfr-space-1w);
  text-align: left;
  color: var(--text-default-grey);
  background-color: var(--idle);
}

.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger:hover) {
  background-color: var(--hover);
}

.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger:active) {
  background-color: var(--active);
}

.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger[aria-expanded="true"]) {
  background-color: var(--background-open-blue-france);
  color: var(--text-active-blue-france);
}

/* Open: no darker hover background. The DSFR pair (text-active-blue-france on
   background-open-blue-france-hover) falls to 2.6:1 in dark mode (RGAA 3.2). */
.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger[aria-expanded="true"]:hover),
.dsaasfr-user-menu :deep(.dsaasfr-user-menu__trigger[aria-expanded="true"]:active) {
  background-color: var(--background-open-blue-france);
}

.dsaasfr-user-menu__avatar,
.dsaasfr-user-menu__chevron {
  color: var(--text-action-high-blue-france);
}

.dsaasfr-user-menu :deep([aria-expanded="true"]) .dsaasfr-user-menu__chevron {
  transform: rotate(-180deg);
}

@media (prefers-reduced-motion: no-preference) {
  .dsaasfr-user-menu__chevron {
    transition: transform 0.3s;
  }
}

.dsaasfr-user-menu__identity {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dsaasfr-user-menu__name,
.dsaasfr-user-menu__description {
  margin: 0;
  overflow-wrap: anywhere;
}

.dsaasfr-user-menu__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsaasfr-user-menu__list > li {
  padding: 0;
}

.dsaasfr-user-menu__entry--separated {
  margin-top: var(--dsaasfr-space-1w);
  padding-top: var(--dsaasfr-space-1w);
  border-top: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
}

.dsaasfr-user-menu__item {
  width: 100%;
  max-width: none;
}
</style>
