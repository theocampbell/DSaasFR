import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { navItems } from '../DsfsAppShell/DsfsAppShell.stories'
import DsfsSidebar from './DsfsSidebar.vue'

const meta = {
  title: 'Shell/DsfsSidebar',
  component: DsfsSidebar,
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
          'Application sidebar that replaces the DSFR header: bloc-marque and service name at the top (banner landmark), primary navigation below (groups = secondary navigation, opened automatically when they contain the current page), footer slot for account and settings. Active state is derived from vue-router. See docs/decisions/0003.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="height: 100vh; width: 16rem; background: var(--background-alt-grey)"><story /></div>' })],
} satisfies Meta<typeof DsfsSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ActiveInGroup: Story = { parameters: { route: '/admin/demarches' } }
export const WithoutBaseline: Story = { args: { serviceDescription: undefined } }
