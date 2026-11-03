import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrFilterChip from './DsaasfrFilterChip.vue'

const panels = {
  field: '<button type="button">Statut</button>',
  operator: '<button type="button">n’est pas</button>',
  values: '<label><input type="checkbox"> Personne C</label>',
}

function setup(props: Record<string, unknown> = {}, slots: Record<string, string> = panels) {
  const user = userEvent.setup()
  const result = render(DsaasfrFilterChip, {
    props: { field: 'Assigné à', operator: 'est', values: ['Personne A', 'Personne B'], ...props },
    slots,
  })
  return { ...result, user }
}

describe('DsaasfrFilterChip', () => {
  it('is a group named after the whole filter', () => {
    setup()

    expect(screen.getByRole('group', { name: 'Filtre : Assigné à est Personne A, Personne B' })).toBeTruthy()
  })

  it('makes each part with a slot an editable button whose name contains its visible text', () => {
    setup()

    expect(screen.getByRole('button', { name: 'Modifier le champ : Assigné à' }).textContent?.trim()).toBe('Assigné à')
    expect(screen.getByRole('button', { name: 'Modifier la condition : est' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Modifier les valeurs : Personne A, Personne B' })).toBeTruthy()
  })

  it('opens the panel of the part that was clicked', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: /Modifier la condition/ }))

    expect(screen.getByRole('button', { name: 'n’est pas' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Statut' })).toBeNull()
  })

  it('renders parts without a slot as plain text', () => {
    setup({}, { values: panels.values })

    const group = screen.getByRole('group')
    expect(within(group).queryByRole('button', { name: /Modifier le champ/ })).toBeNull()
    expect(within(group).getByText('Assigné à')).toBeTruthy()
  })

  it('summarises many values but keeps them all in the accessible name', () => {
    setup({ values: ['A', 'B', 'C', 'D'] })

    const button = screen.getByRole('button', { name: 'Modifier les valeurs : A, B et 2 autres (A, B, C, D)' })
    expect(button.textContent?.trim()).toBe('A, B et 2 autres')
  })

  it('shows a placeholder when no value is selected yet', () => {
    setup({ values: [] })

    expect(screen.getByRole('button', { name: 'Modifier les valeurs : Choisir…' })).toBeTruthy()
  })

  it('emits remove from the × button', async () => {
    const { user, emitted } = setup()

    await user.click(screen.getByRole('button', { name: 'Retirer le filtre Assigné à' }))

    expect(emitted('remove')).toHaveLength(1)
  })

  it('can open a part from the outside (v-model:open-part)', () => {
    setup({ openPart: 'values' })

    expect(screen.getByRole('checkbox')).toBeTruthy()
  })

  it('has no detectable accessibility violations, closed and open', async () => {
    const { container, user } = setup()
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: /Modifier les valeurs/ }))
    await expectNoA11yViolations(container)
  })
})
