<script setup lang="ts">
/**
 * DsfsUserMenu — the signed-in person, as a trigger opening account actions.
 *
 * Pattern: disclosure (button + aria-expanded/aria-controls + list of links and
 * buttons), like the DSFR header menus and DsfrLanguageSelector — not an ARIA
 * `role="menu"`. Escape, click outside and tabbing out close it.
 *
 * See docs/decisions/0005-user-menu.md.
 */
import { computed, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { DsfsUserMenuItem, DsfsUserMenuProps } from './DsfsUserMenu.types'

const props = withDefaults(defineProps<DsfsUserMenuProps>(), {
  description: undefined,
  items: () => [],
  menuLabel: 'Mon compte',
  placement: 'top',
  id: 'dsfs-user-menu',
})

const emit = defineEmits<{ select: [item: DsfsUserMenuItem] }>()

const open = defineModel<boolean>('open', { default: false })
const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const panelId = computed(() => `${props.id}-panel`)

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

function select(item: DsfsUserMenuItem) {
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

const itemClass = (item: DsfsUserMenuItem) => [
  'fr-btn fr-btn--tertiary-no-outline fr-btn--sm dsfs-user-menu__item',
  item.icon ? `fr-btn--icon-left ${item.icon}` : '',
]
</script>

<template>
  <div
    ref="root"
    class="dsfs-user-menu"
    :class="`dsfs-user-menu--${placement}`"
    @keydown="onKeydown"
    @focusout="onFocusOut"
  >
    <button
      ref="trigger"
      type="button"
      class="dsfs-user-menu__trigger"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <span
        class="dsfs-user-menu__avatar fr-icon-account-circle-line"
        aria-hidden="true"
      />
      <span class="dsfs-user-menu__identity">
        <span class="fr-text--sm fr-text--bold dsfs-user-menu__name">{{ name }}</span>
        <span
          v-if="description"
          class="fr-text--xs dsfs-user-menu__description"
        >{{ description }}</span>
      </span>
      <span
        class="dsfs-user-menu__chevron"
        :class="placement === 'top' ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'"
        aria-hidden="true"
      />
    </button>

    <!-- Official DSFR menu markup (as in fr-translate / fr-nav): fr-menu > fr-menu__list
         brings the overlap background, hover pair, drop shadow and high-contrast outline. -->
    <div
      v-show="open"
      :id="panelId"
      class="fr-menu dsfs-user-menu__panel"
    >
      <ul
        class="fr-menu__list dsfs-user-menu__list"
        :aria-label="menuLabel"
      >
        <li
          v-for="item in items"
          :key="item.text"
          :class="{ 'dsfs-user-menu__entry--separated': item.separated }"
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
.dsfs-user-menu {
  position: relative;
}

/* Custom trigger (two-line name + role does not fit fr-btn). It inherits the
   --idle/--hover/--active pair from its container, like DSFR tertiary buttons,
   and copies the fr-translate__btn expanded state. See 0005. */
.dsfs-user-menu__trigger {
  display: flex;
  align-items: center;
  gap: var(--dsfs-space-3v);
  width: 100%;
  padding: var(--dsfs-space-1w);
  text-align: left;
  color: var(--text-default-grey);
  background-color: var(--idle);
}

.dsfs-user-menu__trigger:hover {
  background-color: var(--hover);
}

.dsfs-user-menu__trigger:active {
  background-color: var(--active);
}

.dsfs-user-menu__trigger[aria-expanded="true"] {
  --idle: transparent;
  --hover: var(--background-open-blue-france-hover);
  --active: var(--background-open-blue-france-active);

  background-color: var(--background-open-blue-france);
  color: var(--text-active-blue-france);
}

.dsfs-user-menu__trigger[aria-expanded="true"]:hover {
  background-color: var(--hover);
}

.dsfs-user-menu__avatar,
.dsfs-user-menu__chevron {
  color: var(--text-action-high-blue-france);
}

.dsfs-user-menu__trigger[aria-expanded="true"] .dsfs-user-menu__chevron {
  transform: rotate(-180deg);
}

@media (prefers-reduced-motion: no-preference) {
  .dsfs-user-menu__chevron {
    transition: transform 0.3s;
  }
}

.dsfs-user-menu__identity {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dsfs-user-menu__name,
.dsfs-user-menu__description {
  margin: 0;
  overflow-wrap: anywhere;
}

/* Layout-only overrides of fr-menu: it is designed to drop below a header nav item
   (top: 100%, 20rem wide). Here it spans the sidebar and opens upwards. */
.dsfs-user-menu__panel.fr-menu {
  right: 0;
  left: 0;
  width: auto;
  margin: 0;
  padding: 0;
}

.dsfs-user-menu--top .dsfs-user-menu__panel.fr-menu {
  top: auto;
  bottom: calc(100% + var(--dsfs-space-1v));
}

.dsfs-user-menu--bottom .dsfs-user-menu__panel.fr-menu {
  top: calc(100% + var(--dsfs-space-1v));
}

.dsfs-user-menu__list.fr-menu__list {
  width: auto;
  margin: 0;
  padding: var(--dsfs-space-1w) 0;
  list-style: none;
}

.dsfs-user-menu__list > li {
  padding: 0;
}

.dsfs-user-menu__entry--separated {
  margin-top: var(--dsfs-space-1w);
  padding-top: var(--dsfs-space-1w);
  border-top: var(--dsfs-shell-border-width) solid var(--border-default-grey);
}

.dsfs-user-menu__item {
  width: 100%;
  max-width: none;
}
</style>
