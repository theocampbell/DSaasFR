import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { h, nextTick, ref } from 'vue'
import { vi } from 'vitest'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrSearchableCheckboxSet from './DsaasfrSearchableCheckboxSet.vue'
import type { DsaasfrSearchableCheckboxOption } from './DsaasfrSearchableCheckboxSet.types'

const short: DsaasfrSearchableCheckboxOption[] = [
  { value: '33063', label: 'Bordeaux' },
  { value: '33281', label: 'Mérignac' },
  { value: '33449', label: 'Saint-Médard-en-Jalles' },
]
/** 120 options: more than maxResults (50). */
const long: DsaasfrSearchableCheckboxOption[] = Array.from({ length: 120 }, (_, i) => ({
  value: `c${i}`,
  label: `Commune ${String(i).padStart(3, '0')}`,
}))

function setup(options: DsaasfrSearchableCheckboxOption[], initial: string[] = [], extra = {}) {
  const selected = ref<string[]>(initial)
  const query = ref('')
  render(() => h(DsaasfrSearchableCheckboxSet, {
    options,
    label: 'Commune',
    modelValue: selected.value,
    'onUpdate:modelValue': (v: string[]) => (selected.value = v),
    query: query.value,
    'onUpdate:query': (v: string) => (query.value = v),
    ...extra,
  }))
  return { selected, query, search: screen.getByRole('searchbox', { name: /^Rechercher : Commune/ }) }
}
const results = () => screen.getByRole('group', { name: 'Commune : résultats' })

describe('DsaasfrSearchableCheckboxSet', () => {
  it('shows a short list in full and narrows it while typing', async () => {
    const user = userEvent.setup()
    const { search } = setup(short)
    expect(within(results()).getAllByRole('checkbox')).toHaveLength(3)

    await user.type(search, 'meri')
    expect(within(results()).getAllByRole('checkbox').map(c => c.getAttribute('value'))).toEqual(['33281'])
  })

  it('ignores accents, case, hyphens and apostrophes', async () => {
    const user = userEvent.setup()
    const { search } = setup(short)
    await user.type(search, 'SAINT MEDARD')
    expect(within(results()).getByRole('checkbox', { name: 'Saint-Médard-en-Jalles' })).toBeTruthy()
  })

  it('waits for a few characters on a long list, then caps the results', async () => {
    const user = userEvent.setup()
    const { search } = setup(long)
    expect(screen.queryByRole('group', { name: 'Commune : résultats' })).toBeNull()
    // DSFR hint, inside the label: part of the field's name.
    expect(search).toHaveProperty('labels.0.textContent', expect.stringContaining('120 choix'))

    await user.type(search, 'commune')
    expect(within(results()).getAllByRole('checkbox')).toHaveLength(50)
    expect(screen.getByText('Et 70 autres résultats : précisez la recherche.')).toBeTruthy()
  })

  it('says when nothing matches', async () => {
    const user = userEvent.setup()
    const { search } = setup(short)
    await user.type(search, 'xyz')
    expect(screen.getByText(/^Aucun résultat/)).toBeTruthy()
  })

  it('keeps a ticked result in place (and focused) until the search changes', async () => {
    const user = userEvent.setup()
    const { search, selected } = setup(short)
    const box = within(results()).getByRole('checkbox', { name: 'Mérignac' })

    await user.click(box)
    expect(selected.value).toEqual(['33281'])
    expect(document.activeElement).toBe(box)
    expect(within(results()).getByRole('checkbox', { name: 'Mérignac' })).toBe(box)

    await user.type(search, 'b')
    const chosen = screen.getByRole('group', { name: 'Commune : sélection (1)' })
    expect(within(chosen).getByRole('checkbox', { name: 'Mérignac' })).toHaveProperty('checked', true)
  })

  it('shows the selection, also values the options do not know, and clears it', async () => {
    const user = userEvent.setup()
    const { search, selected } = setup(long, ['c5', 'ancienne-commune'])
    const chosen = screen.getByRole('group', { name: 'Commune : sélection (2)' })
    expect(within(chosen).getAllByRole('checkbox').map(c => c.getAttribute('value'))).toEqual(['c5', 'ancienne-commune'])

    await user.click(screen.getByRole('button', { name: 'Tout désélectionner' }))
    expect(selected.value).toEqual([])
    expect(screen.queryByRole('group', { name: /sélection/ })).toBeNull()
    expect(document.activeElement).toBe(search)
  })

  it('cannot tick an unavailable option, but can untick it once selected', async () => {
    setup([...short, { value: '33000', label: 'Ville sans dossier (0)', disabled: true }], ['33449'])
    expect(within(results()).getByRole('checkbox', { name: 'Ville sans dossier (0)' })).toHaveProperty('disabled', true)
    const chosen = screen.getByRole('group', { name: 'Commune : sélection (1)' })
    expect(within(chosen).getByRole('checkbox', { name: 'Saint-Médard-en-Jalles' })).toHaveProperty('disabled', false)
  })

  it('lets the app search on its side (localFilter: false)', async () => {
    const user = userEvent.setup()
    const { search, query } = setup(short, [], { localFilter: false })
    await user.type(search, 'zz')
    expect(query.value).toBe('zz')
    // The options are shown as given: the app filters them.
    expect(within(results()).getAllByRole('checkbox')).toHaveLength(3)
  })

  it('announces the result count once typing pauses', async () => {
    vi.useFakeTimers()
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const { search } = setup(long)
      await user.type(search, 'commune 01')
      expect(screen.getByRole('status').textContent?.trim()).toBe('')
      vi.advanceTimersByTime(500)
      await nextTick()
      expect(screen.getByRole('status').textContent?.trim()).toBe('10 résultats')
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('has no detectable accessibility violations', async () => {
    const user = userEvent.setup()
    const { search } = setup(long, ['c1'])
    await user.type(search, 'commune 00')
    await expectNoA11yViolations(document.body)
  })
})
