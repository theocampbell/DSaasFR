import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrDropdown from './DsaasfrDropdown.vue'

function setup(props: Record<string, unknown> = {}) {
  const user = userEvent.setup()
  const result = render({
    components: { DsaasfrDropdown },
    setup: () => ({ props }),
    template: `
      <div>
        <DsaasfrDropdown v-bind="props" trigger-class="fr-btn fr-btn--secondary fr-btn--sm">
          <template #trigger>Filtrer</template>
          <template #default="{ close }">
            <ul aria-label="Champs">
              <li><button type="button" @click="close(true)">Statut</button></li>
              <li><button type="button">Commune</button></li>
            </ul>
          </template>
        </DsaasfrDropdown>
        <button type="button">Ailleurs</button>
      </div>`,
  })
  return { ...result, user, trigger: screen.getByRole('button', { name: 'Filtrer' }) }
}

describe('DsaasfrDropdown', () => {
  it('is a disclosure: closed by default, aria-expanded/aria-controls when open', async () => {
    const { user, trigger } = setup()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('button', { name: 'Statut' })).toBeNull()

    await user.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const list = screen.getByRole('list', { name: 'Champs' })
    expect(list.closest(`#${CSS.escape(trigger.getAttribute('aria-controls')!)}`)).toBeTruthy()
  })

  it('keeps focus on the trigger by default, moves it into the panel with autofocus', async () => {
    const { user, trigger, unmount } = setup()
    await user.click(trigger)
    expect(document.activeElement).toBe(trigger)
    unmount()

    const second = setup({ autofocus: true })
    await second.user.click(second.trigger)
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Statut'))
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const { user, trigger } = setup({ autofocus: true })
    await user.click(trigger)

    await user.keyboard('{Escape}')

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when clicking outside or tabbing out', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Ailleurs' }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await user.click(trigger)
    await user.tab()
    await user.tab()
    await user.tab()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('stays open when clicking non-focusable content inside a focusable container', async () => {
    const user = userEvent.setup()
    render({
      components: { DsaasfrDropdown },
      template: `
        <main tabindex="-1">
          <DsaasfrDropdown open>
            <template #trigger>Condition</template>
            <fieldset><legend>Condition</legend>
              <input id="r1" type="radio" name="op"><label for="r1">est</label>
              <input id="r2" type="radio" name="op"><label for="r2">n’est pas</label>
            </fieldset>
          </DsaasfrDropdown>
        </main>`,
    })

    await user.click(screen.getByText('n’est pas'))

    expect(screen.getByRole('button', { name: 'Condition' }).getAttribute('aria-expanded')).toBe('true')
    expect((screen.getByRole('radio', { name: 'n’est pas' }) as HTMLInputElement).checked).toBe(true)
  })

  it('lets the panel close itself and return focus', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)

    await user.click(screen.getByRole('button', { name: 'Statut' }))

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('gives unique panel ids to several dropdowns', () => {
    render({
      components: { DsaasfrDropdown },
      template: '<div><DsaasfrDropdown>A</DsaasfrDropdown><DsaasfrDropdown>B</DsaasfrDropdown></div>',
    })
    const ids = screen.getAllByRole('button').map(b => b.getAttribute('aria-controls'))
    expect(new Set(ids).size).toBe(2)
  })

  it('has no detectable accessibility violations, closed and open', async () => {
    const { container, user, trigger } = setup()
    await expectNoA11yViolations(container)
    await user.click(trigger)
    await expectNoA11yViolations(container)
  })
})
