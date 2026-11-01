<script setup lang="ts">
/** Internal: the navigation landmark, shared by every layout of DsfsSidebar. */
import { DsfrSideMenuList } from '@gouvminint/vue-dsfr'
import type { DsfsSidebarItem } from './DsfsSidebar.types'

defineProps<{
  id: string
  label: string
  items: DsfsSidebarItem[]
}>()
</script>

<template>
  <nav
    class="dsfs-sidebar-nav fr-sidemenu"
    :aria-label="label"
  >
    <slot>
      <DsfrSideMenuList
        :id="id"
        :menu-items="items"
      />
    </slot>
  </nav>
</template>

<style scoped>
/* Application nav: drop the in-page sidemenu offsets, keep DSFR items as-is. */
.dsfs-sidebar-nav.fr-sidemenu {
  margin: 0;

  /* Below 48em DSFR draws inset borders for the in-page mobile sidemenu. */
  box-shadow: none;
}
</style>
