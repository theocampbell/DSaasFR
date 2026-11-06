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
          'Contenu du slot `preview` de DsaasfrAppShell : en-tête fixé (titre, bouton de fermeture DSFR), actions et pied facultatifs, corps qui défile. Dans le shell, le titre nomme la région d’aperçu et reçoit le focus lorsque l’utilisateur l’ouvre ; Échap et « Fermer » la ferment et le focus revient à l’élément déclencheur. La mise en page est assurée par le shell : le panneau pousse le contenu à partir de 62em, et passe en plein écran (reste de la page inerte) en dessous. À associer à `usePreviewQuery()` pour conserver l’aperçu dans l’URL. Voir la fiche de décision docs/decisions/0008.',
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
