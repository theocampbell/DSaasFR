import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, createRouter } from 'vue-router'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrContextSwitcher from './DsaasfrContextSwitcher.vue'

function setup(props: Record<string, unknown> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<p>Accueil</p>' } },
      { path: '/departements', component: { template: '<p>Tous</p>' } },
    ],
  })
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(DsaasfrContextSwitcher, {
    global: { plugins: [router] },
    props: {
      label: 'Département',
      current: 'Gironde (33)',
      items: [
        { text: 'Gironde (33)', to: { query: { dep: '33' } }, current: true },
        { text: 'Landes (40)', to: { query: { dep: '40' } } },
      ],
      onSelect,
      ...props,
    },
  })
  return { user, router, onSelect, trigger: screen.getByRole('button', { name: 'Département : Gironde (33)' }) }
}

describe('DsaasfrContextSwitcher', () => {
  it('shows the current context in a disclosure button', () => {
    const { trigger } = setup()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('lists the choices as links, the current one marked, and moves focus to it', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)

    const list = screen.getByRole('list', { name: 'Département : changer' })
    const current = within(list).getByRole('link', { name: 'Gironde (33)' })
    expect(current.getAttribute('aria-current')).toBe('true')
    expect(within(list).getByRole('link', { name: 'Landes (40)' }).hasAttribute('aria-current')).toBe(false)
    await vi.waitFor(() => expect(document.activeElement).toBe(current))
  })

  it('switches by following a link, then closes', async () => {
    const { user, router, trigger, onSelect } = setup()
    await user.click(trigger)
    await user.click(screen.getByRole('link', { name: 'Landes (40)' }))

    await vi.waitFor(() => expect(router.currentRoute.value.query.dep).toBe('40'))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ text: 'Landes (40)' }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('shows choices under named groups, and a link to every choice', async () => {
    const { user, trigger } = setup({
      items: [],
      groups: [
        { title: 'Nouvelle-Aquitaine', items: [{ text: 'Gironde (33)', to: '/', current: true }] },
        { title: 'Occitanie', items: [{ text: 'Gers (32)', to: '/' }] },
      ],
      moreLink: { text: 'Tous les départements', to: '/departements' },
    })
    await user.click(trigger)

    const occitanie = screen.getByRole('list', { name: 'Occitanie' })
    expect(within(occitanie).getByRole('link', { name: 'Gers (32)' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Tous les départements' }).getAttribute('href')).toBe('/departements')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('has no detectable accessibility violations, closed and open', async () => {
    const { user, trigger } = setup({ moreLink: { text: 'Tous les départements', to: '/departements' } })
    await expectNoA11yViolations(document.body)
    await user.click(trigger)
    await expectNoA11yViolations(document.body)
  })
})
