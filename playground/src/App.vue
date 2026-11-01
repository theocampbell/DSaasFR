<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DsfsSidebarItem } from 'dsaasfr'

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

const links = computed(() => [{ to: '/', text: 'Accueil' }, { text: route.path }])
</script>

<template>
  <DsfsAppShell v-model:preview-open="preview">
    <template #sidebar>
      <DsfsSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="items"
      />
    </template>

    <template #breadcrumb>
      <DsfrBreadcrumb :links="links" />
    </template>

    <template #toolbar>
      <DsfrButton
        label="Nouveau dossier"
        size="sm"
      />
      <DsfrButton
        :label="preview ? 'Masquer l’aperçu' : 'Afficher l’aperçu'"
        secondary
        size="sm"
        @click="preview = !preview"
      />
    </template>

    <h1 class="fr-h3">
      {{ route.path }}
    </h1>
    <p>Playground : une fausse application de back-office pour tester les composants en conditions réelles.</p>

    <template #preview="{ close }">
      <div class="fr-p-3w">
        <h2 class="fr-h5">
          Aperçu
        </h2>
        <p>Pièce justificative.pdf</p>
        <DsfrButton
          label="Fermer l’aperçu"
          tertiary
          size="sm"
          @click="close"
        />
      </div>
    </template>
  </DsfsAppShell>
</template>
