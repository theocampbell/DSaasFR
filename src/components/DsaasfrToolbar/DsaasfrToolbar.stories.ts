import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrToolbar from './DsaasfrToolbar.vue'

const meta = {
  title: 'Shell/DsaasfrToolbar',
  component: DsaasfrToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Seconde ligne du shell applicatif. Conteneur générique : placez ce que vous voulez dans `start` (à gauche) et `end` (à droite) — boutons, déclencheurs, filtres actifs, choix de vue. Sur écran étroit, les éléments passent à la ligne d’un bloc. La prop facultative `label` l’expose comme un groupe nommé. Voir la fiche de décision docs/decisions/0007.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const StartAndEnd: Story = {
  args: { label: 'Filtres et actions de la liste' },
  render: args => ({
    components: { DsaasfrToolbar },
    setup: () => ({ args }),
    template: `
      <DsaasfrToolbar v-bind="args">
        <template #start>
          <p class="fr-text--sm fr-mb-0">40 dossiers</p>
        </template>
        <template #end>
          <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
          <DsfrButton label="Exporter" icon="fr-icon-download-line" tertiary size="sm" />
        </template>
      </DsaasfrToolbar>`,
  }),
}

export const EndOnly: Story = {
  render: () => ({
    components: { DsaasfrToolbar },
    template: `
      <DsaasfrToolbar>
        <template #end>
          <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
        </template>
      </DsaasfrToolbar>`,
  }),
}
