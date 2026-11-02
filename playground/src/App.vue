<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DsfsSidebarItem, DsfsUserMenuItem } from 'dsaasfr'
import PageBody from './PageBody.vue'

const route = useRoute()
const preview = ref(false)

const items: DsfsSidebarItem[] = [
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

// Page title from the navigation item matching the URL (flattening groups).
const flat = (list: DsfsSidebarItem[]): DsfsSidebarItem[] =>
  list.flatMap(item => (item.menuItems ? flat(item.menuItems) : [item]))
const pageTitle = computed(() =>
  [...flat(items), ...accountItems].find(item => item.to === route.path)?.text ?? 'Page introuvable',
)
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

const accountItems: DsfsUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Préférences', to: '/preferences', icon: 'fr-icon-settings-5-line' },
  { text: 'Notifications', to: '/notifications', icon: 'fr-icon-notification-3-line' },
  { text: 'Paramètres d’affichage', icon: 'fr-icon-theme-fill', action: () => (displaySettingsOpen.value = true) },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true, action: () => alert('Démonstration : déconnexion simulée.') },
]

const links = computed(() =>
  route.path === '/' ? [{ text: 'Tableau de bord' }] : [{ to: '/', text: 'Tableau de bord' }, { text: pageTitle.value }],
)
</script>

<template>
  <DsfsAppShell v-model:preview-open="preview">
    <template #sidebar>
      <DsfsSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="items"
      >
        <template #footer>
          <DsfsUserMenu
            name="Camille Martin"
            description="Instructrice · DDT 33"
            :items="accountItems"
          />
        </template>
      </DsfsSidebar>
    </template>

    <template #breadcrumb>
      <DsfrBreadcrumb :links="links" />
    </template>

    <template #toolbar="{ togglePreview, previewToggleAttrs }">
      <DsfrButton
        label="Nouveau dossier"
        size="sm"
      />
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
  </DsfsAppShell>

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
