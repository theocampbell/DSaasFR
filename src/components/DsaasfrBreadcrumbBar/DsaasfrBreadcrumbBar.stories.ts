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
          'First row of the app shell: the breadcrumb (official DSFR markup) on the left, the page\'s key action(s) on the right. Items come from the router (`meta.breadcrumb` or `meta.title` of each route) or from the `items` prop. Long labels are truncated; above `maxItems` levels the middle ones collapse into a "…" button. See docs/decisions/0006.',
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
        <DsfrButton label="Nouveau dossier" icon="fr-icon-add-line" size="sm" />
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
