import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DsaasfrSearchableCheckboxSet from '../DsaasfrSearchableCheckboxSet/DsaasfrSearchableCheckboxSet.vue'
import DsaasfrFilterModal from './DsaasfrFilterModal.vue'

const roots = ['Arsac', 'Bassens', 'Blanquefort', 'Carcans', 'Cestas', 'Eysines', 'Floirac', 'Lacanau', 'Léognan', 'Margaux']
const suffixes = ['', '-sur-Dordogne', '-sur-Garonne', '-en-Médoc', '-de-Guyenne', '-les-Vignes', '-le-Haut', '-le-Bas']
const communes = roots.flatMap(r => suffixes.map(s => r + s)).sort((a, b) => a.localeCompare(b, 'fr'))

const meta = {
  title: 'Briques/DsaasfrFilterModal',
  component: DsaasfrFilterModal,
  tags: ['autodocs'],
  args: { label: 'Communes', icon: 'fr-icon-map-pin-2-line' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Un **filtre à beaucoup de valeurs** (les communes d’un département) dans son propre bouton de la barre d’outils, qui ouvre une **fenêtre modale DSFR** (`DsfrModal`) : le bouton montre le nombre de valeurs choisies (« Communes (3) ») ; le contenu (en général un `DsaasfrSearchableCheckboxSet`) vient de l’emplacement par défaut. Intégrés : modale au niveau de la page (Teleport), hauteur fixe pendant la recherche, défilement unique sur une fenêtre basse, focus rendu au bouton. Voir la fiche de décision docs/decisions/0010.',
      },
    },
  },
} satisfies Meta<typeof DsaasfrFilterModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Communes',
  render: args => ({
    components: { DsaasfrFilterModal, DsaasfrSearchableCheckboxSet },
    setup: () => {
      const applied = ref<string[]>(['Lacanau'])
      const draft = ref<string[]>([])
      const open = ref(false)
      const onOpen = (o: boolean) => {
        open.value = o
        if (o) draft.value = [...applied.value]
      }
      return { args, applied, draft, open, onOpen, options: communes.map(c => ({ value: c, label: c })) }
    },
    template: `
      <div class="fr-p-3w" style="display: flex; justify-content: flex-end">
        <DsaasfrFilterModal
          v-bind="args"
          :open="open"
          :count="applied.length"
          :count-text="n => n + ' communes sélectionnées'"
          apply-label="Appliquer"
          @update:open="onOpen"
          @apply="applied = [...draft]"
        >
          <DsaasfrSearchableCheckboxSet v-model="draft" label="Commune" :options="options" />
        </DsaasfrFilterModal>
      </div>`,
  }),
}
