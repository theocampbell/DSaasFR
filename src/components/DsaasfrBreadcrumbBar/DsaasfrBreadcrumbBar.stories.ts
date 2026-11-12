import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrBreadcrumbBar from './DsaasfrBreadcrumbBar.vue'

const meta = {
  title: 'Shell/DsaasfrBreadcrumbBar',
  component: DsaasfrBreadcrumbBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Première ligne du shell applicatif : le fil d’Ariane (balisage officiel du DSFR) à gauche, l’action ou les actions principales de la page à droite. Les éléments proviennent du routeur (`meta.breadcrumb` ou `meta.title` de chaque route) ou de la prop `items`. Les libellés longs sont tronqués ; au-delà de `maxItems` niveaux, les niveaux intermédiaires se replient dans un bouton « … ». Voir la fiche de décision docs/decisions/0006.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrBreadcrumbBar>

export default meta
type Story = StoryObj<typeof meta>

const withAction = (args: object) => ({
  components: { DsaasfrBreadcrumbBar },
  setup: () => ({ args }),
  template: `
    <DsaasfrBreadcrumbBar v-bind="args">
      <template #actions>
        <DsfrButton label="Action principale" icon="fr-icon-add-line" size="sm" />
      </template>
    </DsaasfrBreadcrumbBar>`,
})

export const WithKeyAction: Story = {
  args: { items: [{ text: 'Tableau de bord', to: '/' }, { text: 'Dossiers' }] },
  render: withAction,
}

export const DeepCollapsed: Story = {
  args: {
    items: [
      { text: 'Tableau de bord', to: '/' },
      { text: 'Dossiers', to: '/dossiers' },
      { text: 'Dossier D-2026-2041', to: '/dossiers/D-2026-2041' },
      { text: 'Pièces justificatives', to: '/dossiers/D-2026-2041/pieces' },
      { text: 'Plan de situation du terrain et plan de masse des constructions' },
    ],
  },
  render: withAction,
}

export const WithoutAction: Story = {
  args: { items: [{ text: 'Tableau de bord', to: '/' }, { text: 'Administration', to: '/admin' }, { text: 'Agents' }] },
}
