import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { DsfsSidebar } from '../DsfsSidebar'
import type { DsfsSidebarItem } from '../DsfsSidebar'
import DsfsAppShell from './DsfsAppShell.vue'

const meta = {
  title: 'Shell/DsfsAppShell',
  component: DsfsAppShell,
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
} satisfies Meta<typeof DsfsAppShell>

export default meta
type Story = StoryObj<typeof meta>

export const navItems: DsfsSidebarItem[] = [
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
  components: { DsfsAppShell, DsfsSidebar },
  setup() {
    const preview = ref(previewOpen)
    const links = [{ to: '/', text: 'Accueil' }, { to: '/dossiers', text: 'Dossiers' }, { text: 'Dossier #2041' }]
    return { preview, links, navItems }
  },
  template: `
    <DsfsAppShell v-model:preview-open="preview">
      <template #sidebar>
        <DsfsSidebar service-title="Démarches Pro" service-description="Back-office instructeurs" :items="navItems">
          <template #footer>
            <p class="fr-text--sm fr-mb-0">Camille Martin</p>
            <p class="fr-text--xs fr-mb-0">Instructrice · DDT 33</p>
          </template>
        </DsfsSidebar>
      </template>

      <template #breadcrumb>
        <DsfrBreadcrumb :links="links" />
      </template>

      <template #toolbar>
        <DsfrButton label="Nouveau dossier" size="sm" />
        <DsfrButton label="Filtrer" secondary size="sm" />
        <DsfrButton :label="preview ? 'Masquer l’aperçu' : 'Afficher l’aperçu'" tertiary size="sm" @click="preview = !preview" />
      </template>

      <h1 class="fr-h3">Dossier #2041</h1>
      <p>Contenu principal de l’application.</p>

      <template #preview="{ close }">
        <div class="fr-p-3w">
          <h2 class="fr-h5">Aperçu</h2>
          <p>Pièce justificative.pdf</p>
          <DsfrButton label="Fermer l’aperçu" tertiary size="sm" @click="close" />
        </div>
      </template>
    </DsfsAppShell>
  `,
})

export const Default: Story = { render: () => template(false) }
export const WithPreview: Story = { render: () => template(true) }
export const SecondaryNavigation: Story = {
  parameters: { route: '/admin/agents' },
  render: () => template(false),
}
