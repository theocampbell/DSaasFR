import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrSelectedFilters from './DsaasfrSelectedFilters.vue'

const meta = {
  title: 'Briques/DsaasfrSelectedFilters',
  component: DsaasfrSelectedFilters,
  tags: ['autodocs'],
  args: {
    items: [
      { key: 'commune', label: 'Commune', values: ['Pessac', 'Talence'] },
      { key: 'statut', label: 'Statut', values: ['En cours'] },
      { key: 'type', label: 'Type de demande', values: ['Certificat d’urbanisme', 'Déclaration préalable', 'Permis de construire'] },
    ],
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Les filtres en cours, au-dessus d’une liste de résultats : un **tag supprimable** DSFR par filtre (« Commune : Pessac et 1 autre × ») et « Tout effacer ». Plus simple que DsaasfrFilterChip : pas de condition, pas de modification sur place ; pour changer un filtre, on revient à son bouton dans la barre d’outils. Le focus passe au tag suivant après un retrait. Voir la fiche de décision docs/decisions/0009.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrSelectedFilters>

export default meta
type Story = StoryObj<typeof meta>

export const WithCount: Story = {
  name: 'Avec le nombre de résultats',
  render: args => ({
    components: { DsaasfrSelectedFilters },
    setup: () => {
      const items = ref([...args.items])
      return { items, remove: (key: string) => (items.value = items.value.filter(i => i.key !== key)) }
    },
    template: `
      <DsaasfrSelectedFilters :items="items" @remove="remove" @clear="items = []">
        <p class="fr-text--sm fr-mb-0" role="status">4 dossiers sur 250</p>
      </DsaasfrSelectedFilters>`,
  }),
}
