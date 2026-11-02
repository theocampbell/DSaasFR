<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DsfsSidebarItem } from 'dsaasfr'
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
const pageTitle = computed(() => flat(items).find(item => item.to === route.path)?.text ?? 'Page introuvable')
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
          <p class="fr-text--sm fr-text--bold fr-mb-0">
            Camille Martin
          </p>
          <p class="fr-text--xs fr-mb-1w">
            Instructrice · DDT 33
          </p>
          <DsfrButton
            label="Se déconnecter"
            tertiary
            no-outline
            size="sm"
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
</template>
