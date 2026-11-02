import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrUserMenu from './DsaasfrUserMenu.vue'
import type { DsaasfrUserMenuItem } from './DsaasfrUserMenu.types'

export const accountItems: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Préférences', to: '/preferences', icon: 'fr-icon-settings-5-line' },
  { text: 'Notifications', to: '/notifications', icon: 'fr-icon-notification-3-line' },
  { text: 'Paramètres d’affichage', icon: 'fr-icon-theme-fill' },
  { text: 'Aide', href: '#aide', icon: 'fr-icon-question-line' },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true },
]

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
          'The signed-in person as a trigger (name + role) opening account actions: links (profile, preferences) and buttons (display settings, log out). Disclosure pattern like the DSFR header menus. Designed for the DsaasfrSidebar footer; opens upwards by default. See docs/decisions/0005.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 16rem; padding-top: 22rem; background: var(--background-alt-grey)"><story /></div>' })],
} satisfies Meta<typeof DsaasfrUserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Open: Story = { args: { open: true } }
