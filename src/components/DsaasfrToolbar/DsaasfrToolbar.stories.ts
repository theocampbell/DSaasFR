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
          'Second row of the app shell. Generic container: put anything in `start` (left) and `end` (right) — buttons, triggers, active filters, view switches. Items wrap as a whole on narrow screens. Optional `label` exposes it as a labelled group. See docs/decisions/0007.',
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
