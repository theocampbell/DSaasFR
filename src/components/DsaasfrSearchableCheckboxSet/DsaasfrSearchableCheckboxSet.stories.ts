import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrFilterChip from '../DsaasfrFilterChip/DsaasfrFilterChip.vue'
import DsaasfrSearchableCheckboxSet from './DsaasfrSearchableCheckboxSet.vue'

// Invented communes: over a thousand, as in a real département.
const roots = ['Arsac', 'Avensan', 'Bassens', 'Blanquefort', 'Cadaujac', 'Carcans', 'Castelnau', 'Cestas', 'Créon', 'Eysines',
  'Floirac', 'Gradignan', 'Hourtin', 'Izon', 'Lacanau', 'Léognan', 'Lormont', 'Ludon', 'Macau', 'Margaux']
const saints = ['Médard', 'Aubin', 'Jean', 'Pierre', 'Germain', 'Martin', 'Laurent', 'André', 'Seurin', 'Sulpice',
  'Vincent', 'Denis', 'Émilion', 'Estèphe', 'Julien', 'Macaire', 'Michel', 'Paul', 'Romain', 'Sauveur']
const suffixes = ['', '-sur-Dordogne', '-sur-Garonne', '-en-Médoc', '-de-Guyenne', '-et-Bastide', '-les-Vignes', '-le-Haut', '-le-Bas', '-du-Bois']
const communes = [...new Set([
  ...roots.flatMap(r => suffixes.map(s => r + s)),
  ...saints.flatMap(n => suffixes.map(s => `Saint-${n}${s}`)),
  ...saints.flatMap(n => roots.map(r => `Saint-${n}-de-${r}`)),
])].sort((a, b) => a.localeCompare(b, 'fr'))
const options = communes.map(c => ({ value: c, label: c }))

const meta = {
  title: 'Briques/DsaasfrSearchableCheckboxSet',
  component: DsaasfrSearchableCheckboxSet,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cases à cocher pour une **liste longue** (des centaines ou des milliers de valeurs, par exemple les communes d’un département), à placer dans un panneau comme celui d’une étiquette de filtre. Un champ de recherche d’abord ; la sélection, toujours visible ; des résultats limités (« précisez la recherche »). Cocher une case ne la déplace jamais : les listes ne changent qu’avec la recherche. Compose `DsfrInputGroup` et `DsfrCheckboxSet`. Voir la fiche de décision docs/decisions/0010.',
      },
    },
  },
  args: { label: 'Commune', options },
} satisfies Meta<typeof DsaasfrSearchableCheckboxSet>

export default meta
type Story = StoryObj<typeof meta>

export const LongList: Story = {
  name: 'Liste longue (communes)',
  render: args => ({
    components: { DsaasfrSearchableCheckboxSet },
    setup: () => ({ args, selected: ref(['Lacanau', 'Saint-Médard-en-Médoc']) }),
    template: `
      <div style="max-width: 24rem">
        <DsaasfrSearchableCheckboxSet v-bind="args" v-model="selected" />
      </div>`,
  }),
}

export const ShortList: Story = {
  name: 'Liste courte (tout affichée)',
  args: {
    label: 'Service instructeur',
    options: ['DDT Gironde', 'DDTM Landes', 'DREAL Nouvelle-Aquitaine', 'Préfecture'].map(s => ({ value: s, label: s })),
  },
  render: args => ({
    components: { DsaasfrSearchableCheckboxSet },
    setup: () => ({ args, selected: ref<string[]>([]) }),
    template: `
      <div style="max-width: 24rem">
        <DsaasfrSearchableCheckboxSet v-bind="args" v-model="selected" />
      </div>`,
  }),
}

export const InFilterChip: Story = {
  name: 'Dans une étiquette de filtre',
  parameters: { layout: 'fullscreen' },
  render: args => ({
    components: { DsaasfrFilterChip, DsaasfrSearchableCheckboxSet },
    setup: () => ({ args, applied: ref(['Lacanau']), draft: ref(['Lacanau']), openPart: ref<'values' | undefined>('values') }),
    template: `
      <div class="fr-p-3w" style="min-height: 34rem">
        <DsaasfrFilterChip
          v-model:open-part="openPart"
          field="Commune"
          operator="est"
          :values="applied"
          @update:open-part="part => { if (part) draft = [...applied] }"
        >
          <template #values>
            <div class="fr-px-2w fr-pt-1w">
              <DsaasfrSearchableCheckboxSet v-bind="args" v-model="draft" />
            </div>
          </template>
          <template #footer="{ close }">
            <DsfrButton label="Appliquer" size="sm" @click="applied = [...draft]; close(true)" />
          </template>
        </DsaasfrFilterChip>
      </div>`,
  }),
}
