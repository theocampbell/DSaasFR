<script setup lang="ts">
/**
 * DsaasfrUserMenu — the signed-in person, as a trigger opening account actions.
 *
 * Pattern: disclosure (button + aria-expanded/aria-controls + list of links and
 * buttons), like the DSFR header menus and DsfrLanguageSelector — not an ARIA
 * `role="menu"`. Escape, click outside and tabbing out close it.
 *
 * See docs/decisions/0005-user-menu.md.
 */
import { computed, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
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
const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const panelId = computed(() => `${props.id}-panel`)

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

function select(item: DsaasfrUserMenuItem) {
  emit('select', item)
  item.action?.()
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    close(true)
  }
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) close()
}

function onPointerDownOutside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) document.addEventListener('pointerdown', onPointerDownOutside)
  else document.removeEventListener('pointerdown', onPointerDownOutside)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDownOutside))

const itemClass = (item: DsaasfrUserMenuItem) => [
  'fr-btn fr-btn--tertiary-no-outline fr-btn--sm dsaasfr-user-menu__item',
  item.icon ? `fr-btn--icon-left ${item.icon}` : '',
]
</script>

<template>
  <div
    ref="root"
    class="dsaasfr-user-menu"
    :class="`dsaasfr-user-menu--${placement}`"
    @keydown="onKeydown"
    @focusout="onFocusOut"
  >
    <button
      ref="trigger"
      type="button"
      class="dsaasfr-user-menu__trigger"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
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
        :class="placement === 'top' ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
        aria-hidden="true"
      />
    </button>

    <!-- Official DSFR menu markup (as in fr-translate / fr-nav): fr-menu > fr-menu__list
         brings the overlap background, hover pair, drop shadow and high-contrast outline. -->
    <div
      v-show="open"
      :id="panelId"
      class="fr-menu dsaasfr-user-menu__panel"
    >
      <ul
        class="fr-menu__list dsaasfr-user-menu__list"
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
            @click="select(item)"
          >
            {{ item.text }}
          </RouterLink>
          <a
            v-else-if="item.href"
            :href="item.href"
            :class="itemClass(item)"
            @click="select(item)"
          >{{ item.text }}</a>
          <button
            v-else
            type="button"
            :class="itemClass(item)"
            @click="select(item)"
          >
            {{ item.text }}
          </button>
        </li>
        <slot :close="close" />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dsaasfr-user-menu {
  position: relative;
}

/* Custom trigger (two-line name + role does not fit fr-btn). It inherits the
   --idle/--hover/--active pair from its container, like DSFR tertiary buttons,
   and copies the fr-translate__btn expanded state. See 0005. */
.dsaasfr-user-menu__trigger {
  display: flex;
  align-items: center;
  gap: var(--dsaasfr-space-3v);
  width: 100%;
  padding: var(--dsaasfr-space-1w);
  text-align: left;
  color: var(--text-default-grey);
  background-color: var(--idle);
}

.dsaasfr-user-menu__trigger:hover {
  background-color: var(--hover);
}

.dsaasfr-user-menu__trigger:active {
  background-color: var(--active);
}

.dsaasfr-user-menu__trigger[aria-expanded="true"] {
  --idle: transparent;
  --hover: var(--background-open-blue-france-hover);
  --active: var(--background-open-blue-france-active);

  background-color: var(--background-open-blue-france);
  color: var(--text-active-blue-france);
}

.dsaasfr-user-menu__trigger[aria-expanded="true"]:hover {
  background-color: var(--hover);
}

.dsaasfr-user-menu__avatar,
.dsaasfr-user-menu__chevron {
  color: var(--text-action-high-blue-france);
}

.dsaasfr-user-menu__trigger[aria-expanded="true"] .dsaasfr-user-menu__chevron {
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

/* Layout-only overrides of fr-menu: it is designed to drop below a header nav item
   (top: 100%, 20rem wide). Here it spans the sidebar and opens upwards. */
.dsaasfr-user-menu__panel.fr-menu {
  right: 0;
  left: 0;
  width: auto;
  margin: 0;
  padding: 0;
}

.dsaasfr-user-menu--top .dsaasfr-user-menu__panel.fr-menu {
  top: auto;
  bottom: calc(100% + var(--dsaasfr-space-1v));
}

.dsaasfr-user-menu--bottom .dsaasfr-user-menu__panel.fr-menu {
  top: calc(100% + var(--dsaasfr-space-1v));
}

.dsaasfr-user-menu__list.fr-menu__list {
  width: auto;
  margin: 0;
  padding: var(--dsaasfr-space-1w) 0;
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
