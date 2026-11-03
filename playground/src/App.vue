<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePreviewQuery, useRouteBreadcrumb } from 'dsaasfr'
import type { DsaasfrSidebarItem, DsaasfrUserMenuItem } from 'dsaasfr'
import PageBody from './PageBody.vue'
import { describePreview } from './fakeData'

const route = useRoute()
// Preview in the URL (?apercu=…): shareable, Back closes it.
const preview = usePreviewQuery()
const previewed = computed(() => describePreview(preview.item.value))

const items: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  { text: 'Usagers', to: '/usagers' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]

// Toolbar row only on list pages.
const listCount = computed(() => ({ '/dossiers': '40 dossiers', '/usagers': '30 usagers' } as Record<string, string>)[route.path])

// Key action, top right of the breadcrumb row, only on pages that have one
// (demo: buttons do nothing).
const keyAction = computed(() => {
  const path = route.path
  if (/^\/dossiers\/[^/]+\/pieces/.test(path)) return { label: 'Ajouter une pièce', icon: 'fr-icon-attachment-line' }
  if (/^\/dossiers\/[^/]+$/.test(path)) return { label: 'Rendre une décision', icon: 'fr-icon-check-line' }
  if (path === '/dossiers') return { label: 'Nouveau dossier', icon: 'fr-icon-add-line' }
  if (path === '/admin/agents') return { label: 'Ajouter un agent', icon: 'fr-icon-user-add-line' }
  return undefined
})

// Page <h1> = current level of the breadcrumb, both coming from the route titles.
const trail = useRouteBreadcrumb()
const pageTitle = computed(() => trail.value[trail.value.length - 1]?.text ?? '')
// DSFR "Paramètres d'affichage": a modal with light / dark / system, backed by
// Vue DSFR's useScheme (sets data-fr-scheme/theme and remembers the choice).
// useScheme() is typed as possibly undefined (it returns nothing outside a browser).
const { scheme, setScheme } = useScheme()!
const displaySettingsOpen = ref(false)
const schemeOptions = [
  { label: 'Thème clair', value: 'light' },
  { label: 'Thème sombre', value: 'dark' },
  { label: 'Système', value: 'system', hint: 'Utilise les paramètres système.' },
]

const accountItems: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Préférences', to: '/preferences', icon: 'fr-icon-settings-5-line' },
  { text: 'Notifications', to: '/notifications', icon: 'fr-icon-notification-3-line' },
  { text: 'Paramètres d’affichage', icon: 'fr-icon-theme-fill', action: () => (displaySettingsOpen.value = true) },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true, action: () => alert('Démonstration : déconnexion simulée.') },
]

</script>

<template>
  <DsaasfrAppShell v-model:preview-open="preview.isOpen.value">
    <template #sidebar>
      <DsaasfrSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="items"
      >
        <template #footer>
          <DsaasfrUserMenu
            name="Camille Martin"
            description="Instructrice · DDT 33"
            :items="accountItems"
          />
        </template>
      </DsaasfrSidebar>
    </template>

    <template #breadcrumb>
      <DsaasfrBreadcrumbBar>
        <template
          v-if="keyAction"
          #actions
        >
          <DsfrButton
            :label="keyAction.label"
            :icon="keyAction.icon"
            size="sm"
          />
        </template>
      </DsaasfrBreadcrumbBar>
    </template>

    <template
      v-if="listCount"
      #toolbar
    >
      <DsaasfrToolbar label="Filtres et actions de la liste">
        <template #start>
          <p class="fr-text--sm fr-mb-0">
            {{ listCount }}
          </p>
        </template>
        <template #end>
          <!-- Filters come next (filter chips in `start`, this trigger opens them). -->
          <DsfrButton
            label="Filtrer"
            icon="fr-icon-filter-line"
            secondary
            size="sm"
          />
          <DsfrButton
            label="Exporter"
            icon="fr-icon-download-line"
            tertiary
            size="sm"
          />
        </template>
      </DsaasfrToolbar>
    </template>

    <DsfrNotice
      class="fr-mb-3w"
      title="Démonstration"
      desc="Ce site est un bac à sable du projet DSaaSFR (proposition communautaire). Ce n’est pas un service public réel et aucune donnée n’est enregistrée."
    />

    <h1 class="fr-h3">
      {{ pageTitle }}
    </h1>
    <PageBody
      :path="route.path"
      @preview="preview.open"
    />

    <template
      v-if="previewed"
      #preview
    >
      <DsaasfrPreviewPanel
        :title="previewed.title"
        :description="previewed.description"
      >
        <template
          v-if="previewed.link"
          #actions
        >
          <RouterLink
            class="fr-btn fr-btn--secondary fr-btn--sm"
            :to="previewed.link"
          >
            Ouvrir le dossier
          </RouterLink>
        </template>
        <dl
          v-if="previewed.fields"
          class="fr-mb-3w"
        >
          <template
            v-for="[label, value] in previewed.fields"
            :key="label"
          >
            <dt class="fr-text--sm fr-text--bold fr-mb-0">
              {{ label }}
            </dt>
            <dd class="fr-ml-0 fr-mb-2w">
              {{ value }}
            </dd>
          </template>
        </dl>
        <div
          v-if="previewed.document"
          class="fr-p-3w fr-mb-3w playground-document"
        >
          <p class="fr-text--xs fr-mb-1w">
            Aperçu du document (simulé)
          </p>
          <p
            v-for="n in 12"
            :key="n"
            class="fr-text--sm"
          >
            Page {{ n }} — contenu du document.
          </p>
        </div>
      </DsaasfrPreviewPanel>
    </template>
  </DsaasfrAppShell>

  <DsfrModal
    :opened="displaySettingsOpen"
    title="Paramètres d’affichage"
    @close="displaySettingsOpen = false"
  >
    <DsfrRadioButtonSet
      name="fr-radios-theme"
      legend="Choisissez un thème pour personnaliser l’apparence du site."
      :model-value="scheme"
      :options="schemeOptions"
      @update:model-value="(value: string | number | boolean | undefined) => setScheme(String(value))"
    />
  </DsfrModal>
</template>

<style scoped>
/* Simulated document page (demo only). */
.playground-document {
  border: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-alt-grey);
}
</style>
