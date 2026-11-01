<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
const preview = ref(false)
const links = [{ to: '/', text: 'Accueil' }, { to: '/dossiers', text: 'Dossiers' }, { text: 'Dossier #2041' }]
</script>

<template>
  <DsfsAppShell
    v-model:sidebar-collapsed="collapsed"
    v-model:preview-open="preview"
  >
    <template #header>
      <DsfrHeader
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :logo-text="['République', 'Française']"
      />
    </template>

    <template #sidebar>
      <ul class="fr-sidemenu__list fr-p-1w">
        <li class="fr-sidemenu__item fr-sidemenu__item--active">
          <a
            class="fr-sidemenu__link"
            href="#"
            aria-current="page"
          >Dossiers</a>
        </li>
        <li class="fr-sidemenu__item">
          <a
            class="fr-sidemenu__link"
            href="#"
          >Usagers</a>
        </li>
        <li class="fr-sidemenu__item">
          <a
            class="fr-sidemenu__link"
            href="#"
          >Statistiques</a>
        </li>
      </ul>
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
      Dossier #2041
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
