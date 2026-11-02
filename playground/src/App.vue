<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteBreadcrumb } from 'dsaasfr'
import type { DsaasfrSidebarItem, DsaasfrUserMenuItem } from 'dsaasfr'
import PageBody from './PageBody.vue'

const route = useRoute()
const preview = ref(false)

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

// One key action per page, top right of the breadcrumb row (demo: buttons do nothing).
const keyAction = computed(() => {
  const path = route.path
  if (/^\/dossiers\/[^/]+\/pieces/.test(path)) return { label: 'Ajouter une pièce', icon: 'fr-icon-attachment-line' }
  if (/^\/dossiers\/[^/]+$/.test(path)) return { label: 'Rendre une décision', icon: 'fr-icon-check-line' }
  if (path === '/' || path === '/dossiers') return { label: 'Nouveau dossier', icon: 'fr-icon-add-line' }
  if (path === '/usagers') return { label: 'Inviter un usager', icon: 'fr-icon-user-add-line' }
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
  <DsaasfrAppShell v-model:preview-open="preview">
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

    <template #toolbar="{ togglePreview, previewToggleAttrs }">
      <DsfrButton
        label="Aperçu"
        secondary
        size="sm"
        v-bind="previewToggleAttrs"
        @click="togglePreview"
      />
    </template>

    <DsfrNotice
      class="fr-mb-3w"
      title="Démonstration"
      desc="Ce site est un bac à sable du projet DSaaSFR (proposition communautaire). Ce n’est pas un service public réel et aucune donnée n’est enregistrée."
    />

    <h1 class="fr-h3">
      {{ pageTitle }}
    </h1>
    <PageBody :path="route.path" />

    <template #preview="{ closePreview }">
      <div class="fr-p-3w">
        <h2 class="fr-h5">
          Aperçu
        </h2>
        <p>Pièce justificative.pdf</p>
        <DsfrButton
          label="Fermer l’aperçu"
          tertiary
          size="sm"
          @click="closePreview"
        />
      </div>
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
