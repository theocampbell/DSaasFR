import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { navItems } from '../../../.storybook/fixtures'
import DsaasfrSidebar from './DsaasfrSidebar.vue'

const meta = {
  title: 'Shell/DsaasfrSidebar',
  component: DsaasfrSidebar,
  tags: ['autodocs'],
  args: {
    serviceTitle: 'Démarches Pro',
    serviceDescription: 'Back-office instructeurs',
    items: navItems,
  },
  parameters: {
    layout: 'fullscreen',
    route: '/dossiers',
    docs: {
      description: {
        component:
          'Barre latérale d’application qui remplace l’en-tête DSFR : bloc-marque et nom du service en haut (région banner), navigation principale en dessous (groupes = navigation secondaire, ouverts automatiquement lorsqu’ils contiennent la page courante), slot de pied pour le compte et les réglages. L’état actif est déduit de vue-router. Voir la fiche de décision docs/decisions/0003.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="height: 100vh; width: 16rem; background: var(--background-alt-grey)"><story /></div>' })],
} satisfies Meta<typeof DsaasfrSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ActiveInGroup: Story = { parameters: { route: '/admin/demarches' } }
export const WithoutBaseline: Story = { args: { serviceDescription: undefined } }
