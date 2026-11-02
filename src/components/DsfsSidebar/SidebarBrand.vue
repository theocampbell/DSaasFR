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
    <!-- `custom` RouterLink: no automatic aria-current="page" on the home link (the
         current page is announced once, by the navigation), like the DSFR header. -->
    <RouterLink
      v-if="homeIsRouterLink"
      v-slot="{ href, navigate }"
      :to="homeTo"
      custom
    >
      <a
        :href="href"
        :title="homeTitle"
        @click="navigate"
      >
        <p class="fr-text--lg fr-text--bold fr-mb-0">{{ serviceTitle }}</p>
      </a>
    </RouterLink>
    <a
      v-else
      :href="homeHref"
      :title="homeTitle"
    >
      <p class="fr-text--lg fr-text--bold fr-mb-0">{{ serviceTitle }}</p>
    </a>
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
