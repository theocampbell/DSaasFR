<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePreviewQuery, useRouteBreadcrumb } from '@dsaasfr/vue'
import type { DsaasfrContextSwitcherItem, DsaasfrSidebarItem, DsaasfrUserMenuItem } from '@dsaasfr/vue'
import { currentDep, departementLabel, severalDeps } from './context'
import { departements, perimetre } from './demo'
import type { Departements, Perimetre } from './demo'
import FilterControls from './FilterControls.vue'
import PageBody from './PageBody.vue'
import { describePreview, dossiers } from './fakeData'
import { applied, filteredDossiers, removeFilter } from './filters'

const route = useRoute()
// Preview in the URL (?apercu=…): shareable, Back closes it.
const preview = usePreviewQuery()
const previewed = computed(() => describePreview(preview.item.value))

// Case files: floating preview with previous / next through the filtered list (the table
// is not squeezed). Documents: pushed preview, read alongside the page.
const isDocument = computed(() => preview.item.value?.includes('/') ?? false)
const listIds = computed(() => filteredDossiers.value.map(row => row[0]!))
const position = computed(() => listIds.value.indexOf(preview.item.value ?? ''))
function step(delta: number) {
  const id = listIds.value[position.value + delta]
  if (id) preview.open(id, { replace: true })
}

// Département switcher (sidebar footer, above the user menu). Each choice is a link to the same page
// in the other département; switching drops the commune filter (communes belong to a
// département) and the preview, and says so (role="status", present from the start).
const contextMessage = ref('')
watch(() => route.query.dep, (dep) => {
  if (typeof dep !== 'string' || dep === currentDep.value) return
  currentDep.value = dep
  const hadCommunes = applied.some(f => f.field === 'commune')
  if (hadCommunes) removeFilter('commune')
  contextMessage.value = `Département : ${departementLabel(dep)}.${hadCommunes ? ' Filtre Commune retiré.' : ''}`
}, { immediate: true })
// Most people work in one département: no switcher (their département is already in the
// user line). Only people with several départements get it (demo switch).
const myDeps = computed(() => (departements.value === 'plusieurs' ? severalDeps : [currentDep.value]))
const depChoices = computed<DsaasfrContextSwitcherItem[]>(() => myDeps.value.map(code => ({
  text: departementLabel(code),
  to: { path: route.path === '/departements' ? '/dossiers' : route.path, query: { dep: code } },
  current: code === currentDep.value,
})))

// Demo switches (Dossiers page), kept in the URL to share a variant: the person's
// perimeter (?perimetre=communes) and number of départements (?departements=plusieurs).
const router = useRouter()
watch(() => [route.query.perimetre, route.query.departements], ([scope, deps]) => {
  departements.value = deps === 'plusieurs' ? 'plusieurs' : 'un'
  const next: Perimetre = scope === 'communes' ? 'communes' : 'departement'
  // A smaller perimeter: communes chosen outside it no longer apply.
  if (next !== perimetre.value && applied.some(f => f.field === 'commune')) removeFilter('commune')
  perimetre.value = next
}, { immediate: true })
function setDemo(key: 'perimetre' | 'departements', value: Perimetre | Departements, fallback: string) {
  void router.replace({ query: { ...route.query, [key]: value === fallback ? undefined : value } })
}

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
const listCount = computed(() => ({ '/dossiers': `${dossiers.length} dossiers`, '/usagers': '30 usagers' } as Record<string, string>)[route.path])

// Key action, top right of the breadcrumb row, only on pages that have one. Demo: the
// buttons do nothing, so they are labelled « Action principale » to show the position
// of the page's primary action (a real app would say « Nouveau dossier »…).
const keyAction = computed(() => {
  const path = route.path
  if (/^\/dossiers\/[^/]+\/pieces/.test(path)) return { label: 'Action principale', icon: 'fr-icon-attachment-line' }
  if (/^\/dossiers\/[^/]+$/.test(path)) return { label: 'Action principale', icon: 'fr-icon-check-line' }
  if (path === '/dossiers') return { label: 'Action principale', icon: 'fr-icon-add-line' }
  if (path === '/admin/agents') return { label: 'Action principale', icon: 'fr-icon-user-add-line' }
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
  <DsaasfrAppShell
    v-model:preview-open="preview.isOpen.value"
    :preview-mode="isDocument ? 'push' : 'overlay'"
  >
    <template #sidebar>
      <DsaasfrSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="items"
      >
        <!-- Département switcher next to the person (who I am / where I work), above
             the user menu; it could also go under the service name (#context slot). -->
        <template #footer>
          <DsaasfrContextSwitcher
            v-if="myDeps.length > 1"
            class="fr-mb-1w"
            label="Département"
            :current="departementLabel(currentDep)"
            :items="depChoices"
            :more-link="{ text: 'Tous les départements', to: '/departements' }"
            placement="top"
          />
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
          <FilterControls
            v-if="route.path === '/dossiers'"
            area="start"
          />
          <p
            v-else
            class="fr-text--sm fr-mb-0"
          >
            {{ listCount }}
          </p>
        </template>
        <template #end>
          <FilterControls
            v-if="route.path === '/dossiers'"
            area="end"
          />
          <DsfrButton
            v-if="route.path !== '/dossiers'"
            label="Exporter"
            icon="fr-icon-download-line"
            tertiary
            size="sm"
          />
        </template>
      </DsaasfrToolbar>
      <FilterControls
        v-if="route.path === '/dossiers'"
        area="summary"
      />
    </template>

    <DsfrNotice
      class="fr-mb-3w"
      title="Démonstration"
      desc="Ce site est un bac à sable du projet DSaaSFR (projet expérimental, non officiel). Ce n’est pas un service public réel et aucune donnée n’est enregistrée."
    />

    <p
      class="fr-sr-only"
      role="status"
    >
      {{ contextMessage }}
    </p>
    <h1 class="fr-h3">
      {{ pageTitle }}
    </h1>
    <FilterControls
      v-if="route.path === '/dossiers'"
      area="search"
    />
    <div
      v-if="route.path === '/dossiers'"
      class="fr-p-2w fr-mb-3w playground-demo"
    >
      <p class="fr-text--sm fr-text--bold fr-mb-1w">
        Comparer (démonstration)
      </p>
      <DsfrSegmentedSet
        :model-value="perimetre"
        name="demo-perimetre"
        legend="Périmètre de la personne connectée"
        small
        inline
        :options="[
          { label: 'Département entier (1 178 communes)', value: 'departement' },
          { label: '10 communes', value: 'communes' },
        ]"
        @update:model-value="setDemo('perimetre', $event as Perimetre, 'departement')"
      />
      <DsfrSegmentedSet
        :model-value="departements"
        name="demo-departements"
        legend="Départements de la personne connectée"
        small
        inline
        :options="[
          { label: '1 département (le cas courant)', value: 'un' },
          { label: '3 départements', value: 'plusieurs' },
        ]"
        @update:model-value="setDemo('departements', $event as Departements, 'un')"
      />
    </div>
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
        :has-previous="isDocument ? undefined : position > 0"
        :has-next="isDocument ? undefined : position > -1 && position < listIds.length - 1"
        previous-label="Dossier précédent"
        next-label="Dossier suivant"
        @previous="step(-1)"
        @next="step(1)"
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
        <template v-if="previewed.history">
          <h3 class="fr-h6 fr-mb-2w">
            Historique
          </h3>
          <ol class="fr-raw-list fr-mb-3w">
            <li
              v-for="([date, event], n) in previewed.history"
              :key="n"
              class="fr-mb-2w"
            >
              <p class="fr-text--xs fr-mb-0 playground-mention">
                {{ date }}
              </p>
              <p class="fr-text--sm fr-mb-0">
                {{ event }}
              </p>
            </li>
          </ol>
        </template>
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
.playground-demo {
  border: var(--dsaasfr-shell-border-width) dashed var(--border-default-grey);
}

.playground-mention {
  color: var(--text-mention-grey);
}

.playground-document {
  border: var(--dsaasfr-shell-border-width) solid var(--border-default-grey);
  background-color: var(--background-alt-grey);
}
</style>
