import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, createRouter } from 'vue-router'
import { vi } from 'vitest'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrUserMenu from './DsaasfrUserMenu.vue'
import type { DsaasfrUserMenuItem } from './DsaasfrUserMenu.types'

async function setup(extraItems: DsaasfrUserMenuItem[] = []) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
  })
  await router.push('/')
  await router.isReady()
  const logout = vi.fn()
  const items: DsaasfrUserMenuItem[] = [
    { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
    { text: 'Aide', href: 'https://example.org/aide' },
    ...extraItems,
    { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', action: logout, separated: true },
  ]
  const user = userEvent.setup()
  const result = render({
    components: { DsaasfrUserMenu },
    setup: () => ({ items }),
    template: `
      <div>
        <DsaasfrUserMenu name="Camille Martin" description="Instructrice · DDT 33" :items="items" />
        <button type="button">Ailleurs</button>
      </div>`,
  }, { global: { plugins: [router] } })
  const trigger = screen.getByRole('button', { name: /Camille Martin/ })
  return { ...result, user, logout, trigger, router }
}

describe('DsaasfrUserMenu', () => {
  it('is a disclosure button named after the person, closed by default', async () => {
    const { trigger } = await setup()

    expect(trigger.textContent).toContain('Instructrice · DDT 33')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('link', { name: 'Mon profil' })).toBeNull()
  })

  it('opens the account actions and wires aria-controls', async () => {
    const { trigger, user } = await setup()

    await user.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const list = screen.getByRole('list', { name: 'Mon compte' })
    expect(list.closest(`#${trigger.getAttribute('aria-controls')}`)).toBeTruthy()
    expect(within(list).getByRole('link', { name: 'Mon profil' })).toBeTruthy()
    expect(within(list).getByRole('button', { name: 'Se déconnecter' })).toBeTruthy()
  })

  it('runs an action item and closes', async () => {
    const { trigger, user, logout } = await setup()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

    expect(logout).toHaveBeenCalledOnce()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('navigates with a route item', async () => {
    const { trigger, user, router } = await setup()

    await user.click(trigger)
    await user.click(screen.getByRole('link', { name: 'Mon profil' }))

    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/profil'))
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const { trigger, user } = await setup()

    await user.click(trigger)
    await user.tab()
    expect(document.activeElement?.textContent).toContain('Mon profil')

    await user.keyboard('{Escape}')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when focus or a click leaves it', async () => {
    const { trigger, user } = await setup()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Ailleurs' }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await user.click(trigger)
    trigger.focus()
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('has no detectable accessibility violations, closed and open', async () => {
    const { container, trigger, user } = await setup()
    await expectNoA11yViolations(container)

    await user.click(trigger)
    await expectNoA11yViolations(container)
  })
})
