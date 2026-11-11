import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import VueDsfr from '@gouvminint/vue-dsfr'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, vi } from 'vitest'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrSidebar from './DsaasfrSidebar.vue'
import type { DsaasfrSidebarItem } from './DsaasfrSidebar.types'

const Empty = { template: '<div />' }

async function makeRouter(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: Empty }],
  })
  await router.push(path)
  await router.isReady()
  return router
}

const items: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]

async function renderSidebar(path = '/', props: Record<string, unknown> = {}) {
  const router = await makeRouter(path)
  return render(DsaasfrSidebar, {
    props: { serviceTitle: 'Démarches Pro', serviceDescription: 'Back-office', items, ...props },
    global: { plugins: [router, VueDsfr] },
  })
}

describe('DsaasfrSidebar', () => {
  it('renders the bloc-marque and the service name in a banner', async () => {
    await renderSidebar()

    const banner = screen.getByRole('banner')
    expect(within(banner).getByText('Démarches Pro')).toBeTruthy()
    expect(within(banner).getByText(/République/)).toBeTruthy()
  })

  it('links the service name to home with the DSFR title convention', async () => {
    await renderSidebar('/dossiers')

    const home = screen.getByRole('link', { name: /Démarches Pro/ })
    expect(home.getAttribute('href')).toBe('/')
    expect(home.getAttribute('title')).toBe('Accueil - Démarches Pro - République Française')
  })

  it('exposes a labelled navigation landmark', async () => {
    await renderSidebar()

    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeTruthy()
  })

  it('marks the current page from the route, including nested paths', async () => {
    await renderSidebar('/dossiers/2041')

    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).getByRole('link', { name: 'Dossiers' }).getAttribute('aria-current')).toBe('page')
    expect(within(nav).getByRole('link', { name: 'Tableau de bord' }).getAttribute('aria-current')).toBeNull()
  })

  it('opens the group that contains the current page (secondary navigation)', async () => {
    await renderSidebar('/admin/agents')

    const group = screen.getByRole('button', { name: 'Administration' })
    expect(group.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: 'Agents' }).getAttribute('aria-current')).toBe('page')
  })

  it('does not mark the home link as current page on the home page', async () => {
    await renderSidebar('/')

    const home = screen.getByRole('link', { name: /Démarches Pro/ })
    expect(home.getAttribute('aria-current')).toBeNull()
    expect(screen.getByRole('link', { name: 'Tableau de bord' }).getAttribute('aria-current')).toBe('page')
  })

  it('announces exactly one current page, never the group', async () => {
    const { container } = await renderSidebar('/admin/agents')

    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Administration' }).getAttribute('aria-current')).toBeNull()
  })

  it('toggles a group with the keyboard', async () => {
    const user = userEvent.setup()
    await renderSidebar('/')

    const group = screen.getByRole('button', { name: 'Administration' })
    expect(group.getAttribute('aria-expanded')).toBe('false')
    expect(group.getAttribute('aria-controls')).toBeTruthy()

    group.focus()
    await user.keyboard('{Enter}')
    expect(group.getAttribute('aria-expanded')).toBe('true')
  })

  it('works without vue-router (plain links)', () => {
    render(DsaasfrSidebar, {
      props: { serviceTitle: 'Démarches Pro' },
      slots: { default: '<ul><li><a href="/x">X</a></li></ul>' },
    })

    expect(screen.getByRole('link', { name: /Démarches Pro/ }).getAttribute('href')).toBe('/')
  })

  it('renders the footer slot', async () => {
    const router = await makeRouter('/')
    render(DsaasfrSidebar, {
      props: { serviceTitle: 'Démarches Pro', items },
      slots: { footer: '<button type="button">Mon compte</button>' },
      global: { plugins: [router, VueDsfr] },
    })

    const region = screen.getByRole('region', { name: 'Mon espace' })
    expect(within(region).getByRole('button', { name: 'Mon compte' })).toBeTruthy()
  })

  it('renders the context slot between the brand and the navigation', async () => {
    const router = await makeRouter('/')
    render(DsaasfrSidebar, {
      props: { serviceTitle: 'Démarches Pro', items },
      slots: { context: '<button type="button">Gironde (33)</button>' },
      global: { plugins: [router, VueDsfr] },
    })

    const region = screen.getByRole('region', { name: 'Périmètre' })
    expect(within(region).getByRole('button', { name: 'Gironde (33)' })).toBeTruthy()
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(region.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = await renderSidebar('/admin/agents')

    await expectNoA11yViolations(container)
  })
})

function mockNarrowViewport(narrow: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: narrow,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

describe('DsaasfrSidebar on narrow screens (< 62em, high zoom)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the DSFR header with a menu button', async () => {
    mockNarrowViewport(true)
    await renderSidebar('/dossiers')

    const banner = await screen.findByRole('banner')
    expect(within(banner).getByText('Démarches Pro')).toBeTruthy()
    const menu = within(banner).getByRole('button', { name: 'Menu' })
    expect(menu.getAttribute('aria-haspopup')).toBe('dialog')
  })


  it('puts the context slot at the top of the menu', async () => {
    mockNarrowViewport(true)
    const router = await makeRouter('/')
    render(DsaasfrSidebar, {
      props: { serviceTitle: 'Démarches Pro', items },
      slots: { context: '<button type="button">Gironde (33)</button>' },
      global: { plugins: [router, VueDsfr] },
    })

    const region = await screen.findByRole('region', { name: 'Périmètre', hidden: true })
    expect(within(region).getByRole('button', { name: 'Gironde (33)', hidden: true })).toBeTruthy()
  })

  it('has a single banner', async () => {
    mockNarrowViewport(true)
    await renderSidebar('/')
    expect(await screen.findAllByRole('banner')).toHaveLength(1)
  })
})
