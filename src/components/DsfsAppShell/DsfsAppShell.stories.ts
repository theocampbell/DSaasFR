import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsfsAppShell from './DsfsAppShell.vue'

const meta = {
  title: 'Shell/DsfsAppShell',
  component: DsfsAppShell,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DRAFT. Layout and landmarks for a SaaS application: header, primary navigation (sidebar), breadcrumb row, toolbar row, main content and an optional preview panel. See docs/decisions/0002-app-shell-layout.md.',
      },
    },
  },
} satisfies Meta<typeof DsfsAppShell>

export default meta
type Story = StoryObj<typeof meta>

const template = (previewOpen: boolean) => ({
  components: { DsfsAppShell },
  setup() {
    const collapsed = ref(false)
    const preview = ref(previewOpen)
    const links = [{ to: '/', text: 'Accueil' }, { to: '/dossiers', text: 'Dossiers' }, { text: 'Dossier #2041' }]
    return { collapsed, preview, links }
  },
  template: `
    <DsfsAppShell v-model:sidebar-collapsed="collapsed" v-model:preview-open="preview">
      <template #header>
        <DsfrHeader service-title="Nom du service" service-description="Back-office" :logo-text="['République', 'Française']" />
      </template>

      <template #sidebar>
        <ul class="fr-sidemenu__list fr-p-1w">
          <li class="fr-sidemenu__item fr-sidemenu__item--active">
            <a class="fr-sidemenu__link" href="#" aria-current="page">Dossiers</a>
          </li>
          <li class="fr-sidemenu__item"><a class="fr-sidemenu__link" href="#">Usagers</a></li>
          <li class="fr-sidemenu__item"><a class="fr-sidemenu__link" href="#">Statistiques</a></li>
          <li class="fr-sidemenu__item"><a class="fr-sidemenu__link" href="#">Paramètres</a></li>
        </ul>
      </template>

      <template #breadcrumb>
        <DsfrBreadcrumb :links="links" />
      </template>

      <template #toolbar>
        <DsfrButton label="Nouveau dossier" icon="ri-add-line" size="sm" />
        <DsfrButton label="Filtrer" secondary size="sm" />
        <DsfrButton :label="preview ? 'Masquer l’aperçu' : 'Afficher l’aperçu'" tertiary size="sm" @click="preview = !preview" />
      </template>

      <h1 class="fr-h3">Dossier #2041</h1>
      <p>Contenu principal de l’application.</p>

      <template #preview="{ close }">
        <div class="fr-p-3w">
          <h2 class="fr-h5">Aperçu</h2>
          <p>Pièce jointe, document, détail d’un élément…</p>
          <DsfrButton label="Fermer l’aperçu" tertiary size="sm" @click="close" />
        </div>
      </template>
    </DsfsAppShell>
  `,
})

export const Default: Story = { render: () => template(false) }
export const WithPreview: Story = { render: () => template(true) }
