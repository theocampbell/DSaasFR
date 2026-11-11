import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrFilterDropdown from './DsaasfrFilterDropdown.vue'

const statuts = ['À instruire', 'En cours', 'Incomplet', 'Accepté', 'Refusé']

const meta = {
  title: 'Briques/DsaasfrFilterDropdown',
  component: DsaasfrFilterDropdown,
  tags: ['autodocs'],
  args: { label: 'Instruction', icon: 'fr-icon-todo-line' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Un **groupe de filtres** dans la barre d’outils (« Instruction », « Projet ») : un bouton secondaire DSFR avec son icône et le nombre de filtres actifs (« Instruction (2) »), qui ouvre un panneau ; le contenu (un `DsfrCheckboxSet` par champ…) vient de l’emplacement par défaut ; « Réinitialiser » et un bouton d’application (« Afficher 12 dossiers ») en pied. Le comportement est dans le composant ; le brouillon, les nombres et l’application restent dans l’application. Voir la fiche de décision docs/decisions/0009.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrFilterDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Groupe de filtres',
  render: args => ({
    components: { DsaasfrFilterDropdown },
    setup: () => {
      const applied = ref<string[]>(['En cours'])
      const draft = ref<string[]>([])
      const open = ref(false)
      const onOpen = (o: boolean) => {
        open.value = o
        if (o) draft.value = [...applied.value]
      }
      return { args, applied, draft, open, onOpen, options: statuts.map((s, i) => ({ label: s, value: s, name: 'statut', id: `statut-${i}` })) }
    },
    template: `
      <div class="fr-p-3w" style="min-height: 24rem; display: flex; justify-content: flex-end">
        <DsaasfrFilterDropdown
          v-bind="args"
          :open="open"
          :count="applied.length ? 1 : 0"
          :apply-label="'Afficher ' + (draft.length * 12 || 250) + ' dossiers'"
          :reset-disabled="!draft.length"
          @update:open="onOpen"
          @apply="applied = [...draft]"
          @reset="draft = []"
        >
          <DsfrCheckboxSet v-model="draft" legend="Statut" small :options="options" />
        </DsaasfrFilterDropdown>
      </div>`,
  }),
}
