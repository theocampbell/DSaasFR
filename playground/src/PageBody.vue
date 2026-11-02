<script setup lang="ts">
// Long, realistic content per page, to test scrolling in the shell.
import { activity, dossiers, lorem, usagers } from './fakeData'

defineProps<{ path: string }>()

const stats = [
  { label: 'Dossiers à instruire', value: '128' },
  { label: 'Délai moyen', value: '34 j' },
  { label: 'Dossiers incomplets', value: '17' },
  { label: 'Décisions ce mois-ci', value: '56' },
]
</script>

<template>
  <!-- Tableau de bord -->
  <template v-if="path === '/'">
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="fr-col-12 fr-col-md-6 fr-col-xl-3"
      >
        <div class="fr-tile">
          <div class="fr-tile__body">
            <div class="fr-tile__content">
              <p class="fr-h2 fr-mb-1v">
                {{ stat.value }}
              </p>
              <p class="fr-tile__desc">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="fr-h5">
      Activité récente
    </h2>
    <ul>
      <li
        v-for="line in activity"
        :key="line"
      >
        {{ line }}
      </li>
    </ul>
  </template>

  <!-- Dossiers -->
  <DsfrTable
    v-else-if="path === '/dossiers'"
    title="Dossiers en cours (40)"
    :headers="['N°', 'Demandeur', 'Type', 'Commune', 'Statut', 'Dépôt']"
    :rows="dossiers"
  />

  <!-- Usagers -->
  <DsfrTable
    v-else-if="path === '/usagers'"
    title="Usagers (30)"
    :headers="['Nom', 'Commune', 'Dossiers', 'Dernière demande']"
    :rows="usagers"
  />

  <!-- Other pages: long text -->
  <template v-else>
    <section
      v-for="n in 8"
      :key="n"
      class="fr-mb-4w"
    >
      <h2 class="fr-h5">
        Section {{ n }}
      </h2>
      <p
        v-for="paragraph in lorem"
        :key="paragraph"
      >
        {{ paragraph }}
      </p>
    </section>
  </template>
</template>
