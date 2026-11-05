import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrFilterChip from './DsaasfrFilterChip.vue'

const meta = {
  title: 'Briques/DsaasfrFilterChip',
  component: DsaasfrFilterChip,
  tags: ['autodocs'],
  args: { field: 'Assigné à', operator: 'est', values: ['Personne A', 'Personne B'] },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Une étiquette de filtre représente un filtre actif, à la manière de Linear : `[field] [operator] [values] [×]`, avec l’apparence d’un tag neutre DSFR découpé en segments. Composant de présentation : chaque partie dont le slot est fourni ouvre un menu déroulant avec ce contenu (c’est l’application qui décide : liste de champs, boutons radio de condition, cases à cocher de valeurs) ; × émet `remove`. La logique de filtrage reste dans l’application. Voir la fiche de décision docs/decisions/0009 et le playground (page Dossiers).',
      },
    },
  },
} satisfies Meta<typeof DsaasfrFilterChip>

export default meta
type Story = StoryObj<typeof meta>

export const Editable: Story = {
  render: args => ({
    components: { DsaasfrFilterChip },
    setup() {
      const values = ref<string[]>([...(args.values ?? [])])
      const operator = ref(args.operator ?? 'est')
      return { args, values, operator, people: ['Personne A', 'Personne B', 'Personne C', 'Personne D'] }
    },
    template: `
      <div style="min-height: 16rem">
        <DsaasfrFilterChip v-bind="args" :operator="operator" :values="values">
          <template #operator>
            <div class="fr-px-2w fr-pt-1w">
              <DsfrRadioButtonSet name="op" legend="Condition" small v-model="operator"
                :options="[{ label: 'est', value: 'est' }, { label: 'n’est pas', value: 'n’est pas' }]" />
            </div>
          </template>
          <template #values>
            <div class="fr-px-2w fr-pt-1w">
              <DsfrCheckboxSet v-model="values" legend="Valeurs : Assigné à" small
                :options="people.map(p => ({ label: p, value: p, name: 'people', id: 'p-' + p }))" />
            </div>
          </template>
        </DsaasfrFilterChip>
      </div>`,
  }),
}

export const ManyValues: Story = { args: { values: ['Personne A', 'Personne B', 'Personne C', 'Personne D'] } }
export const NoValueYet: Story = { args: { values: [] } }
