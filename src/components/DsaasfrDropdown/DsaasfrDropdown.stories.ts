import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrDropdown from './DsaasfrDropdown.vue'

const meta = {
  title: 'Building blocks/DsaasfrDropdown',
  component: DsaasfrDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A trigger button opening a floating panel (disclosure pattern, official DSFR menu surface). Escape returns focus to the trigger; click outside / tab out close it; `autofocus` moves focus into the panel; the panel stays inside the viewport. Used by DsaasfrUserMenu, DsaasfrFilterChip and the "Filtrer" trigger. See docs/decisions/0009.',
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
