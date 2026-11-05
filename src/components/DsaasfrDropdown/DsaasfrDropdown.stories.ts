import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrDropdown from './DsaasfrDropdown.vue'

const meta = {
  title: 'Briques/DsaasfrDropdown',
  component: DsaasfrDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Un bouton déclencheur qui ouvre un panneau flottant (pattern de divulgation, surface officielle du menu DSFR). Échap rend le focus au déclencheur ; un clic à l’extérieur ou une sortie avec Tab le ferment ; `autofocus` place le focus dans le panneau ; le panneau reste dans la fenêtre d’affichage. Utilisé par DsaasfrUserMenu, DsaasfrFilterChip et le déclencheur « Filtrer ». Voir la fiche de décision docs/decisions/0009.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const FieldList: Story = {
  args: { autofocus: true, triggerClass: 'fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line' },
  render: args => ({
    components: { DsaasfrDropdown },
    setup: () => ({ args }),
    template: `
      <div style="min-height: 14rem">
        <DsaasfrDropdown v-bind="args">
          <template #trigger>Filtrer</template>
          <template #default="{ close }">
            <ul aria-label="Ajouter un filtre" style="list-style: none; margin: 0; padding: 0">
              <li v-for="field in ['Statut', 'Type', 'Commune']" :key="field" style="padding: 0">
                <button type="button" class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm" style="width: 100%" @click="close(true)">{{ field }}</button>
              </li>
            </ul>
          </template>
        </DsaasfrDropdown>
      </div>`,
  }),
}
