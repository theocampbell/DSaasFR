import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrFilterChip from './DsaasfrFilterChip.vue'

const meta = {
  title: 'Building blocks/DsaasfrFilterChip',
  component: DsaasfrFilterChip,
  tags: ['autodocs'],
  args: { field: 'Assigné à', operator: 'est', values: ['Personne A', 'Personne B'] },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One active filter, Linear-style: `[field] [operator] [values] [×]`, looking like a DSFR neutral tag split into segments. Presentational: each part whose slot is provided opens a dropdown with that content (the app decides: field list, condition radios, value checkboxes); × emits `remove`. The filter logic stays in the app. See docs/decisions/0009 and the playground (Dossiers page).',
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
