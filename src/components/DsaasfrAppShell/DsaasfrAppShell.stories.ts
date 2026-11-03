import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { DsaasfrBreadcrumbBar } from '../DsaasfrBreadcrumbBar'
import { DsaasfrPreviewPanel } from '../DsaasfrPreviewPanel'
import { DsaasfrToolbar } from '../DsaasfrToolbar'
import { DsaasfrSidebar } from '../DsaasfrSidebar'
import { DsaasfrUserMenu } from '../DsaasfrUserMenu'
import { accountItems } from '../DsaasfrUserMenu/DsaasfrUserMenu.stories'
import type { DsaasfrSidebarItem } from '../DsaasfrSidebar'
import DsaasfrAppShell from './DsaasfrAppShell.vue'

const meta = {
  title: 'Shell/DsaasfrAppShell',
  component: DsaasfrAppShell,
  tags: ['autodocs'],
  parameters: {
    route: '/dossiers/2041',
    docs: {
      description: {
        component:
          'DRAFT. Application layout: full-height sidebar carrying the bloc-marque and the navigation (no DSFR header), breadcrumb row, toolbar row, main content and an optional preview panel. See docs/decisions/0002 and 0003.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrAppShell>

export default meta
type Story = StoryObj<typeof meta>

export const navItems: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  { text: 'Usagers', to: '/usagers' },
  { text: 'Statistiques', to: '/statistiques' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Démarches', to: '/admin/demarches' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]

const template = (previewOpen: boolean) => ({
  components: { DsaasfrAppShell, DsaasfrBreadcrumbBar, DsaasfrPreviewPanel, DsaasfrSidebar, DsaasfrToolbar, DsaasfrUserMenu },
  setup() {
    const preview = ref(previewOpen)
    const links = [{ to: '/', text: 'Accueil' }, { to: '/dossiers', text: 'Dossiers' }, { text: 'Dossier #2041' }]
    return { preview, links, navItems, accountItems }
  },
  template: `
    <DsaasfrAppShell v-model:preview-open="preview">
      <template #sidebar>
        <DsaasfrSidebar service-title="Démarches Pro" service-description="Back-office instructeurs" :items="navItems">
          <template #footer>
            <DsaasfrUserMenu name="Camille Martin" description="Instructrice · DDT 33" :items="accountItems" />
          </template>
        </DsaasfrSidebar>
      </template>

      <template #breadcrumb>
        <DsaasfrBreadcrumbBar :items="links">
          <template #actions>
            <DsfrButton label="Nouveau dossier" icon="fr-icon-add-line" size="sm" />
          </template>
        </DsaasfrBreadcrumbBar>
      </template>

      <template #toolbar="{ togglePreview, previewToggleAttrs }">
        <DsaasfrToolbar label="Filtres et actions de la liste">
          <template #start><p class="fr-text--sm fr-mb-0">40 dossiers</p></template>
          <template #end>
            <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
            <DsfrButton label="Aperçu" icon="fr-icon-eye-line" tertiary size="sm" v-bind="previewToggleAttrs" @click="togglePreview" />
          </template>
        </DsaasfrToolbar>
      </template>

      <h1 class="fr-h3">Dossier #2041</h1>
      <p>Contenu principal de l’application.</p>

      <template #preview>
        <DsaasfrPreviewPanel title="Dossier D-2026-2041" description="Permis de construire">
          <p>Demandeur : Alix Petit — Pessac</p>
        </DsaasfrPreviewPanel>
      </template>
    </DsaasfrAppShell>
  `,
})

export const Default: Story = { render: () => template(false) }
export const WithPreview: Story = { render: () => template(true) }
export const SecondaryNavigation: Story = {
  parameters: { route: '/admin/agents' },
  render: () => template(false),
}

/**
 * Narrow screens (< 62em: small window or high zoom) switch the sidebar to the DSFR
 * mobile header. Shrink the browser window or zoom to 400% to see it (decision 0004).
 */
