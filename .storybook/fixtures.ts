// Shared demo data for stories. Kept out of *.stories.ts files: Storybook turns every
// named export of a stories file into a story.
import type { DsaasfrSidebarItem } from '../src/components/DsaasfrSidebar'
import type { DsaasfrUserMenuItem } from '../src/components/DsaasfrUserMenu'

export const navItems: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  { text: 'Usagers', to: '/usagers' },
  { text: 'Statistiques', to: '/statistiques' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Démarches', to: '/admin/demarches' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]

export const accountItems: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Préférences', to: '/preferences', icon: 'fr-icon-settings-5-line' },
  { text: 'Notifications', to: '/notifications', icon: 'fr-icon-notification-3-line' },
  { text: 'Paramètres d’affichage', icon: 'fr-icon-theme-fill' },
  { text: 'Aide', href: '#aide', icon: 'fr-icon-question-line' },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true },
]
