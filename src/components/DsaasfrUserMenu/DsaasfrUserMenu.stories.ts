import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrUserMenu from './DsaasfrUserMenu.vue'
import { accountItems } from '../../../.storybook/fixtures'

const meta = {
  title: 'Shell/DsaasfrUserMenu',
  component: DsaasfrUserMenu,
  tags: ['autodocs'],
  args: { name: 'Camille Martin', description: 'Instructrice · DDT 33', items: accountItems },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'La personne connectée sert de déclencheur (nom + rôle) et ouvre les actions de compte : liens (profil, préférences) et boutons (paramètres d’affichage, déconnexion). Pattern de divulgation comme les menus de l’en-tête DSFR. Conçu pour le pied de DsaasfrSidebar ; s’ouvre vers le haut par défaut. Voir la fiche de décision docs/decisions/0005.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 16rem; padding-top: 22rem; background: var(--background-alt-grey)"><story /></div>' })],
} satisfies Meta<typeof DsaasfrUserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Open: Story = { args: { open: true } }
