import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsaasfrContextSwitcher from './DsaasfrContextSwitcher.vue'

const meta = {
  title: 'Shell/DsaasfrContextSwitcher',
  component: DsaasfrContextSwitcher,
  tags: ['autodocs'],
  args: {
    label: 'Département',
    current: 'Gironde (33)',
    items: [
      { text: 'Gironde (33)', href: '#33', current: true },
      { text: 'Landes (40)', href: '#40' },
      { text: 'Pyrénées-Atlantiques (64)', href: '#64' },
    ],
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Le contexte dans lequel toute l’application travaille (un département, une organisation…), sous le nom du service dans l’emplacement `context` de DsaasfrSidebar. Modèle du sélecteur de langue DSFR : un bouton qui montre la valeur courante et ouvre une liste de **liens**, le courant marqué `aria-current`. Pas de champ de recherche : avec beaucoup de choix, `moreLink` mène à une page qui les liste tous. Voir la fiche de décision docs/decisions/0011.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 16rem; padding: 1rem; min-height: 22rem; background: var(--background-alt-grey)"><story /></div>' })],
} satisfies Meta<typeof DsaasfrContextSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Quelques départements' }
export const Open: Story = { name: 'Ouvert', args: { open: true } }
export const WithMoreLink: Story = {
  name: 'Avec « Tous les départements »',
  args: { open: true, moreLink: { text: 'Tous les départements', href: '#tous' } },
}
export const Grouped: Story = {
  name: 'Par région',
  args: {
    open: true,
    items: [],
    groups: [
      { title: 'Nouvelle-Aquitaine', items: [{ text: 'Gironde (33)', href: '#33', current: true }, { text: 'Landes (40)', href: '#40' }] },
      { title: 'Occitanie', items: [{ text: 'Gers (32)', href: '#32' }, { text: 'Haute-Garonne (31)', href: '#31' }] },
    ],
  },
}
