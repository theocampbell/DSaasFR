import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrBreadcrumbBar from './DsaasfrBreadcrumbBar.vue'

const Empty = { render: () => null }
const routes: RouteRecordRaw[] = [
  { path: '/', component: Empty, meta: { title: 'Tableau de bord' } },
  { path: '/dossiers', component: Empty, meta: { title: 'Dossiers' } },
  { path: '/dossiers/:id', component: Empty, meta: { title: route => `Dossier ${route.params.id}` } },
  { path: '/dossiers/:id/pieces', component: Empty, meta: { title: 'Pièces justificatives' } },
  { path: '/dossiers/:id/pieces/:piece', component: Empty, meta: { breadcrumb: route => `Pièce ${route.params.piece}` } },
  { path: '/admin', component: Empty, meta: { breadcrumb: false } },
  { path: '/admin/agents', component: Empty, meta: { title: 'Agents' } },
]

async function setup(path: string, options: { props?: Record<string, unknown>, slots?: Record<string, string> } = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  const user = userEvent.setup()
  const result = render(DsaasfrBreadcrumbBar, { ...options, global: { plugins: [router] } })
  const nav = screen.getByRole('navigation', { name: 'vous êtes ici :' })
  return { ...result, user, router, nav }
}

const labels = (nav: HTMLElement) =>
  within(nav).getAllByRole('listitem').map(li => li.textContent?.trim())

describe('DsaasfrBreadcrumbBar', () => {
  it('builds the trail from the router, current page last and not a link', async () => {
    const { nav } = await setup('/dossiers/2041')

    expect(labels(nav)).toEqual(['Tableau de bord', 'Dossiers', 'Dossier 2041'])
    expect(within(nav).getByRole('link', { name: 'Dossiers' }).getAttribute('href')).toBe('/dossiers')
    const current = within(nav).getByText('Dossier 2041')
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(current.hasAttribute('href')).toBe(false)
  })

  it('skips levels whose breadcrumb is false', async () => {
    const { nav } = await setup('/admin/agents')

    expect(labels(nav)).toEqual(['Tableau de bord', 'Agents'])
  })

  it('collapses the middle levels into a "…" button above maxItems', async () => {
    const { nav } = await setup('/dossiers/2041/pieces/7')

    expect(labels(nav)).toEqual(['Tableau de bord', '…', 'Pièces justificatives', 'Pièce 7'])
    const more = within(nav).getByRole('button', { name: /Afficher tous les niveaux/ })
    expect(more.getAttribute('aria-label')).toContain('(2)')
  })

  it('reveals every level and moves focus to the first revealed one', async () => {
    const { nav, user } = await setup('/dossiers/2041/pieces/7')

    await user.click(within(nav).getByRole('button', { name: /Afficher tous les niveaux/ }))

    expect(labels(nav)).toEqual(['Tableau de bord', 'Dossiers', 'Dossier 2041', 'Pièces justificatives', 'Pièce 7'])
    expect(document.activeElement?.textContent?.trim()).toBe('Dossiers')
  })

  it('collapses again when the page changes', async () => {
    const { nav, user, router } = await setup('/dossiers/2041/pieces/7')
    await user.click(within(nav).getByRole('button', { name: /Afficher tous les niveaux/ }))

    await router.push('/dossiers/2042/pieces/8')

    await vi.waitFor(() => expect(labels(nav)).toContain('…'))
  })

  it('accepts explicit items instead of the router', async () => {
    const { nav } = await setup('/', {
      props: { items: [{ text: 'Accueil', to: '/' }, { text: 'Recherche' }] },
    })

    expect(labels(nav)).toEqual(['Accueil', 'Recherche'])
  })

  it('marks only the last level as current; ancestors without a link are plain text', async () => {
    const { nav } = await setup('/', {
      props: { items: [{ text: 'Accueil', to: '/' }, { text: 'Rubrique' }, { text: 'Page' }] },
    })

    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
    expect(within(nav).getByText('Page').getAttribute('aria-current')).toBe('page')
    expect(within(nav).getByText('Rubrique').tagName).toBe('SPAN')
  })

  it('gives each instance a unique list id', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/dossiers')
    render({
      components: { DsaasfrBreadcrumbBar },
      template: '<div><DsaasfrBreadcrumbBar /><DsaasfrBreadcrumbBar /></div>',
    }, { global: { plugins: [router] } })

    const ids = [...document.querySelectorAll('ol')].map(ol => ol.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })

  it('renders the key action on the right, outside the navigation', async () => {
    const { nav } = await setup('/dossiers', {
      slots: { actions: '<button type="button">Nouveau dossier</button>' },
    })

    const action = screen.getByRole('button', { name: 'Nouveau dossier' })
    expect(nav.contains(action)).toBe(false)
  })

  it('has no detectable accessibility violations, collapsed and expanded', async () => {
    const { container, nav, user } = await setup('/dossiers/2041/pieces/7', {
      slots: { actions: '<button type="button">Nouveau dossier</button>' },
    })
    await expectNoA11yViolations(container)

    await user.click(within(nav).getByRole('button', { name: /Afficher tous les niveaux/ }))
    await expectNoA11yViolations(container)
  })
})
