<script setup lang="ts">
/** Internal: bloc-marque + service name, shared by the wide sidebar and the narrow bar. */
import { DsfrLogo } from '@gouvminint/vue-dsfr'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  logoText: string | string[]
  serviceTitle: string
  serviceDescription?: string
  homeTo: RouteLocationRaw
  homeHref: string
  homeTitle: string
  homeIsRouterLink: boolean
}>()
</script>

<template>
  <DsfrLogo
    :logo-text="logoText"
    small
  />
  <div class="dsfs-sidebar-brand__service">
    <component
      :is="homeIsRouterLink ? RouterLink : 'a'"
      v-bind="homeIsRouterLink ? { to: homeTo } : { href: homeHref }"
      :title="homeTitle"
    >
      <p class="fr-text--lg fr-text--bold fr-mb-0">
        {{ serviceTitle }}
      </p>
    </component>
    <p
      v-if="serviceDescription"
      class="fr-text--sm fr-mb-0"
    >
      {{ serviceDescription }}
    </p>
  </div>
</template>

<style scoped>
.dsfs-sidebar-brand__service a {
  color: var(--text-title-grey);
}
</style>
