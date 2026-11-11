import { defineConfig } from 'vitepress'

// Documentation site (French), published at the root of the sandbox:
//   /DSaasFR/            this site
//   /DSaasFR/storybook/  Storybook (live examples are embedded from it)
//   /DSaasFR/playground/ the fake back-office
export default defineConfig({
  lang: 'fr-FR',
  title: 'DSaaSFR',
  description: 'Composants Vue 3 pour les applications métier de l’État, construits sur Vue DSFR et le DSFR.',
  base: '/DSaasFR/',
  cleanUrls: true,
  srcExclude: ['storybook/**', '*.png'],
  // Decision records link to source files of the repository, which are not pages.
  ignoreDeadLinks: true,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#000091' }]],
  // Component and recipe pages: no outline column, wider content, so live examples render
  // at a desktop width (components switch layout below 62em) close to real size.
  transformPageData(pageData) {
    if (/^(composants|recettes)\//.test(pageData.relativePath)) {
      pageData.frontmatter.aside ??= false
      pageData.frontmatter.pageClass ??= 'dsaasfr-wide'
    }
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/pour-commencer', activeMatch: '/guide/' },
      { text: 'Composants', link: '/composants/', activeMatch: '/composants/' },
      { text: 'Recettes', link: '/recettes/filtres', activeMatch: '/recettes/' },
      { text: 'Décisions', link: '/decisions/', activeMatch: '/decisions/' },
      {
        text: 'Liens',
        items: [
          { text: 'Storybook', link: 'https://theocampbell.github.io/DSaasFR/storybook/' },
          { text: 'Bac à sable', link: 'https://theocampbell.github.io/DSaasFR/playground/' },
          { text: 'npm : @dsaasfr/vue', link: 'https://www.npmjs.com/package/@dsaasfr/vue' },
          { text: 'Journal des modifications', link: 'https://github.com/theocampbell/DSaasFR/blob/develop/CHANGELOG.md' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Pour commencer', link: '/guide/pour-commencer' },
            { text: 'Intégrer dans une application', link: '/guide/integration' },
            { text: 'Principes', link: '/guide/principes' },
            { text: 'Contribuer', link: '/guide/contribuer' },
          ],
        },
      ],
      '/composants/': [
        { text: 'Composants', items: [{ text: 'Vue d’ensemble', link: '/composants/' }] },
        {
          text: 'Shell',
          items: [
            { text: 'DsaasfrAppShell', link: '/composants/app-shell' },
            { text: 'DsaasfrSidebar', link: '/composants/sidebar' },
            { text: 'DsaasfrUserMenu', link: '/composants/user-menu' },
            { text: 'DsaasfrContextSwitcher', link: '/composants/context-switcher' },
            { text: 'DsaasfrBreadcrumbBar', link: '/composants/breadcrumb-bar' },
            { text: 'DsaasfrToolbar', link: '/composants/toolbar' },
            { text: 'DsaasfrPreviewPanel', link: '/composants/preview-panel' },
          ],
        },
        {
          text: 'Briques',
          items: [
            { text: 'DsaasfrDropdown', link: '/composants/dropdown' },
            { text: 'DsaasfrSelectedFilters', link: '/composants/selected-filters' },
            { text: 'DsaasfrSearchableCheckboxSet', link: '/composants/searchable-checkbox-set' },
          ],
        },
        {
          text: 'Composables',
          items: [
            { text: 'useRouteBreadcrumb', link: '/composants/use-route-breadcrumb' },
            { text: 'usePreviewQuery', link: '/composants/use-preview-query' },
          ],
        },
      ],
      '/recettes/': [
        {
          text: 'Recettes',
          items: [
            { text: 'Filtres d’une liste', link: '/recettes/filtres' },
            { text: 'Aperçu lié à l’URL', link: '/recettes/apercu' },
            { text: 'Navigation selon les rôles', link: '/recettes/roles' },
          ],
        },
      ],
      '/decisions/': [
        {
          text: 'Fiches de décision',
          items: [
            { text: 'Vue d’ensemble', link: '/decisions/' },
            { text: '0001 — Construire sur Vue DSFR', link: '/decisions/0001-build-on-vue-dsfr' },
            { text: '0002 — Mise en page applicative', link: '/decisions/0002-app-shell-layout' },
            { text: '0003 — Bloc-marque dans la barre latérale', link: '/decisions/0003-brand-in-sidebar' },
            { text: '0004 — Écrans étroits et zoom', link: '/decisions/0004-narrow-screens' },
            { text: '0005 — Menu utilisateur', link: '/decisions/0005-user-menu' },
            { text: '0006 — Barre de fil d’Ariane', link: '/decisions/0006-breadcrumb-bar' },
            { text: '0007 — Barre d’outils', link: '/decisions/0007-toolbar' },
            { text: '0008 — Panneau d’aperçu', link: '/decisions/0008-preview-panel' },
            { text: '0009 — Filtres', link: '/decisions/0009-filters' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/theocampbell/DSaasFR' }],
    editLink: {
      pattern: 'https://github.com/theocampbell/DSaasFR/edit/develop/docs/:path',
      text: 'Proposer une modification de cette page',
    },
    footer: {
      message: 'Projet expérimental, non officiel. Code sous licence MIT.',
      copyright: 'Construit sur Vue DSFR et le Système de Design de l’État.',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
          modal: {
            noResultsText: 'Aucun résultat pour',
            resetButtonTitle: 'Effacer la recherche',
            footer: { selectText: 'choisir', navigateText: 'naviguer', closeText: 'fermer' },
          },
        },
      },
    },
    outline: { label: 'Sur cette page', level: [2, 3] },
    docFooter: { prev: 'Page précédente', next: 'Page suivante' },
    lastUpdated: { text: 'Mis à jour le' },
    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Thème',
    lightModeSwitchTitle: 'Passer au thème clair',
    darkModeSwitchTitle: 'Passer au thème sombre',
    skipToContentLabel: 'Aller au contenu',
    langMenuLabel: 'Langue',
    notFound: { title: 'Page introuvable', quote: 'Cette page n’existe pas ou a été déplacée.', linkText: 'Retour à l’accueil', linkLabel: 'Retour à l’accueil' },
  },
})
