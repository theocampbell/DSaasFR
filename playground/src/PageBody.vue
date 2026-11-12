<script setup lang="ts">
// Long, realistic content per page, to test scrolling in the shell.
import { currentDep, regions } from './context'
import { activity, lorem, usagers } from './fakeData'
import { filteredDossiers as dossiers } from './filters'

const props = defineProps<{ path: string }>()
const emit = defineEmits<{ preview: [id: string] }>()
const dossierId = () => props.path.split('/')[2]

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

  <!-- Dossiers: DSFR table markup so the case number can be a link -->
  <p
    v-else-if="path === '/dossiers' && !dossiers.length"
    class="fr-mt-4w"
  >
    Aucun dossier ne correspond à ces filtres.
  </p>
  <div
    v-else-if="path === '/dossiers'"
    class="fr-table"
  >
    <div class="fr-table__wrapper">
      <div class="fr-table__container">
        <div class="fr-table__content">
          <table>
            <caption>Dossiers en cours ({{ dossiers.length }})</caption>
            <thead>
              <tr>
                <th
                  v-for="header in ['N°', 'Demandeur', 'Type', 'Commune', 'Statut', 'Dépôt', 'Aperçu']"
                  :key="header"
                  scope="col"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in dossiers"
                :key="row[0]"
              >
                <td>
                  <RouterLink
                    class="fr-link"
                    :to="`/dossiers/${row[0]}`"
                  >
                    {{ row[0] }}
                  </RouterLink>
                </td>
                <td
                  v-for="cell in row.slice(1)"
                  :key="cell"
                >
                  {{ cell }}
                </td>
                <td>
                  <DsfrButton
                    :label="`Aperçu du dossier ${row[0]}`"
                    :title="`Aperçu du dossier ${row[0]}`"
                    icon="fr-icon-eye-line"
                    icon-only
                    tertiary
                    no-outline
                    size="sm"
                    @click="emit('preview', row[0]!)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Dossier detail -->
  <template v-else-if="/^\/dossiers\/[^/]+$/.test(path)">
    <p>Demande de permis de construire déposée le 01/01/2026 — commune de Pessac.</p>
    <ul class="fr-btns-group fr-btns-group--inline fr-mb-4w">
      <li>
        <RouterLink
          class="fr-btn fr-btn--secondary"
          :to="`${path}/pieces`"
        >
          Pièces justificatives
        </RouterLink>
      </li>
    </ul>
    <p
      v-for="paragraph in lorem"
      :key="paragraph"
    >
      {{ paragraph }}
    </p>
  </template>

  <!-- Pièces justificatives -->
  <ul v-else-if="/^\/dossiers\/[^/]+\/pieces$/.test(path)">
    <li
      v-for="piece in [1, 2, 3]"
      :key="piece"
      class="fr-mb-1w"
    >
      <RouterLink
        class="fr-link"
        :to="`${path}/${piece}`"
      >
        Pièce {{ piece }}
      </RouterLink>
      <button
        type="button"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-eye-line fr-ml-2w"
        @click="emit('preview', `${dossierId()}/${piece}`)"
      >
        Aperçu<span class="fr-sr-only"> de la pièce {{ piece }}</span>
      </button>
    </li>
  </ul>

  <!-- Usagers -->
  <DsfrTable
    v-else-if="path === '/usagers'"
    title="Usagers (30)"
    :headers="['Nom', 'Commune', 'Dossiers', 'Dernière demande']"
    :rows="usagers"
  />

  <!-- Every département (national admin): the list is too long for the switcher's panel,
       so its "Tous les départements" link leads here. Grouped by région, no search needed. -->
  <template v-else-if="path === '/departements'">
    <p>
      Choisissez le département dans lequel travailler. Extrait : 2 régions sur 18.
    </p>
    <section
      v-for="region in regions"
      :key="region.name"
      class="fr-mb-4w"
    >
      <h2 class="fr-h5">
        {{ region.name }}
      </h2>
      <ul class="fr-btns-group fr-btns-group--inline-md fr-btns-group--sm">
        <li
          v-for="dep in region.departements"
          :key="dep.code"
        >
          <RouterLink
            :class="['fr-btn fr-btn--tertiary', { 'fr-btn--icon-left fr-icon-check-line': dep.code === currentDep }]"
            :to="{ path: '/dossiers', query: { dep: dep.code } }"
            :aria-current="dep.code === currentDep ? 'true' : undefined"
          >
            {{ dep.name }} ({{ dep.code }})
          </RouterLink>
        </li>
      </ul>
    </section>
  </template>

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
