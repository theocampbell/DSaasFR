<script setup lang="ts">
import { ref } from 'vue'
import {
  DsaasfrAppShell, DsaasfrBreadcrumbBar, DsaasfrContextSwitcher, DsaasfrFilterDropdown, DsaasfrFilterModal,
  DsaasfrPreviewPanel, DsaasfrSearchableCheckboxSet, DsaasfrSidebar, 
  DsaasfrUserMenu, usePreviewQuery, useRouteBreadcrumb,
} from '@dsaasfr/vue'
import type { DsaasfrSelectedFilter, DsaasfrSidebarItem } from '@dsaasfr/vue'

const items: DsaasfrSidebarItem[] = [{ text: 'Accueil', to: '/' }, { text: 'Dossiers', to: '/dossiers' }]
const preview = usePreviewQuery()
const trail = useRouteBreadcrumb()
const communes = ref<string[]>(['a'])
const open = ref(false)
const openModal = ref(false)
const selected = ref<DsaasfrSelectedFilter[]>([{ key: 'commune', label: 'Commune', values: ['Pessac', 'Talence'] }])
</script>

<template>
  <DsaasfrAppShell
    v-model:preview-open="preview.isOpen.value"
    preview-mode="overlay"
  >
    <template #sidebar>
      <DsaasfrSidebar
        service-title="Consumer"
        :items="items"
      >
        <template #context>
          <DsaasfrContextSwitcher
            label="Département"
            current="Gironde (33)"
            :items="[{ text: 'Gironde (33)', to: '/', current: true }, { text: 'Landes (40)', href: '#40' }]"
          />
        </template>
        <template #footer>
          <DsaasfrUserMenu
            name="Camille Martin"
            description="DDT 33"
            :items="[{ text: 'Profil', to: '/' }]"
          />
        </template>
      </DsaasfrSidebar>
    </template>
    <template #breadcrumb>
      <DsaasfrBreadcrumbBar />
    </template>
    <template #toolbar>
      <DsaasfrToolbar label="Filtres">
        <template #start>
          <p role="status">
            {{ trail.length }} niveaux
          </p>
        </template>
        <template #end>
          <DsaasfrFilterModal
            v-model:open="openModal"
            label="Communes"
            :count="communes.length"
            @apply="() => {}"
          >
            <DsaasfrSearchableCheckboxSet
              v-model="communes"
              label="Commune"
              :options="[{ value: 'a', label: 'Arsac' }, { value: 'b', label: 'Bordeaux' }]"
            />
          </DsaasfrFilterModal>
          <DsaasfrFilterDropdown
            v-model:open="open"
            label="Instruction"
            :count="1"
            @apply="() => {}"
            @reset="() => {}"
          >
            <p>Contenu</p>
          </DsaasfrFilterDropdown>
        </template>
      </DsaasfrToolbar>
    </template>
    <DsaasfrSelectedFilters
      :items="selected"
      align="end"
      @remove="selected = []"
    />
    <h1>Page</h1>
    <button
      type="button"
      @click="preview.open('1')"
    >
      Aperçu
    </button>
    <RouterView />
    <template #preview>
      <DsaasfrPreviewPanel title="Élément 1" />
    </template>
  </DsaasfrAppShell>
</template>
