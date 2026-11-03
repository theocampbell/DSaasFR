import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrPreviewPanel from './DsaasfrPreviewPanel.vue'

const meta = {
  title: 'Shell/DsaasfrPreviewPanel',
  component: DsaasfrPreviewPanel,
  tags: ['autodocs'],
  args: { title: 'Dossier D-2026-2041', description: 'Permis de construire' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Content of the DsaasfrAppShell `preview` slot: sticky header (title, DSFR close button), optional actions and footer, scrolling body. In the shell, the title names the preview region and receives focus when the user opens it; Escape and "Fermer" close it and focus returns to the opener. Layout is handled by the shell: pushes the content from 78em, slides over it from 62em, full screen (rest of the page inert) below. Pair with `usePreviewQuery()` to keep the preview in the URL. See docs/decisions/0008.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 32rem; height: 100vh; overflow: auto; border-left: 1px solid var(--border-default-grey)"><story /></div>' })],
} satisfies Meta<typeof DsaasfrPreviewPanel>

export default meta
type Story = StoryObj<typeof meta>

export const CaseFile: Story = {
  render: args => ({
    components: { DsaasfrPreviewPanel },
    setup: () => ({ args }),
    template: `
      <DsaasfrPreviewPanel v-bind="args">
        <template #actions>
          <a class="fr-btn fr-btn--secondary fr-btn--sm" href="#dossier">Ouvrir le dossier</a>
        </template>
        <dl>
          <dt class="fr-text--sm fr-text--bold fr-mb-0">Demandeur</dt><dd class="fr-ml-0 fr-mb-2w">Alix Petit</dd>
          <dt class="fr-text--sm fr-text--bold fr-mb-0">Commune</dt><dd class="fr-ml-0 fr-mb-2w">Pessac</dd>
          <dt class="fr-text--sm fr-text--bold fr-mb-0">Statut</dt><dd class="fr-ml-0 fr-mb-2w">À instruire</dd>
        </dl>
      </DsaasfrPreviewPanel>`,
  }),
}

export const WithFooter: Story = {
  args: { title: 'Plan de situation du terrain et plan de masse des constructions', description: 'Pièce justificative' },
  render: args => ({
    components: { DsaasfrPreviewPanel },
    setup: () => ({ args }),
    template: `
      <DsaasfrPreviewPanel v-bind="args">
        <p v-for="n in 20" :key="n">Page {{ n }} — contenu du document.</p>
        <template #footer>
          <DsfrButton label="Télécharger" icon="fr-icon-download-line" secondary size="sm" />
        </template>
      </DsaasfrPreviewPanel>`,
  }),
}
