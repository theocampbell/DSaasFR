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
      await nextTick()
      expect(screen.getByRole('status').textContent?.trim()).toBe('10 résultats')

      // Capped results: says how many are shown.
      await user.clear(search)
      await user.type(search, 'commune')
      vi.advanceTimersByTime(500)
      await nextTick()
      await nextTick()
      expect(screen.getByRole('status').textContent?.trim()).toBe('120 résultats, 50 affichés : précisez la recherche')
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('announces the same count again after a new search', async () => {
    vi.useFakeTimers()
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const { search } = setup(long)
      const status = screen.getByRole('status')
      await user.type(search, 'commune 01')
      vi.advanceTimersByTime(500)
      await nextTick()
      await nextTick()
      const seen: string[] = []
      new MutationObserver(() => seen.push(status.textContent?.trim() ?? '')).observe(status, { childList: true, characterData: true, subtree: true })
      await user.type(search, ' ')
      vi.advanceTimersByTime(500)
      await nextTick()
      await nextTick()
      await Promise.resolve()
      expect(seen).toContain('')
      expect(status.textContent?.trim()).toBe('10 résultats')
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('does not move a box ticked with a pointer that gives no focus (Safari, Firefox on macOS)', async () => {
    const { selected } = setup(short)
    const box = within(results()).getByRole('checkbox', { name: 'Mérignac' })
    ;(document.activeElement as HTMLElement | null)?.blur()

    box.click() // no focus, as a click on a checkbox in Safari
    await nextTick()
    await nextTick()
    expect(selected.value).toEqual(['33281'])
    expect(within(results()).getByRole('checkbox', { name: 'Mérignac' })).toBe(box)
  })

  it('keeps a selected value that returns nothing enabled and focused when unticked', async () => {
    const user = userEvent.setup()
    const options = [...short, { value: '33000', label: 'Ville sans dossier (0)', disabled: true }]
    setup(options, ['33000'])
    const chosen = screen.getByRole('group', { name: 'Commune : sélection (1)' })
    const box = within(chosen).getByRole('checkbox', { name: 'Ville sans dossier (0)' })

    await user.click(box)
    expect(box).toHaveProperty('checked', false)
    expect(box).toHaveProperty('disabled', false)
    expect(document.activeElement).toBe(box)
  })

  it('puts the selection before the search field, so results follow the field', () => {
    setup(short, ['33063'])
    const order = [
      screen.getByRole('group', { name: 'Commune : sélection (1)' }),
      screen.getByRole('searchbox', { name: /^Rechercher : Commune/ }),
      results(),
    ]
    expect(order[0]!.compareDocumentPosition(order[1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(order[1]!.compareDocumentPosition(order[2]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('empties the search on Escape instead of letting it close the panel', async () => {
    const user = userEvent.setup()
    const onParentKeydown = vi.fn()
    const { search, query } = setup(short)
    search.closest('div')!.parentElement!.parentElement!.addEventListener('keydown', onParentKeydown)

    await user.type(search, 'bor')
    await user.keyboard('{Escape}')
    expect(query.value).toBe('')
    expect(onParentKeydown).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }))

    await user.keyboard('{Escape}') // empty field: Escape goes on (the panel closes)
    expect(onParentKeydown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }))
  })

  it('lists available values first, then names starting with the text', async () => {
    const user = userEvent.setup()
    const { search } = setup([
      { value: 'a', label: 'Saint-Lacanau' },
      { value: 'b', label: 'Lacanau-de-Guyenne (0)', disabled: true },
      { value: 'c', label: 'Lacanau' },
    ])
    await user.type(search, 'lacanau')
    expect(within(results()).getAllByRole('checkbox').map(c => c.getAttribute('value'))).toEqual(['c', 'a', 'b'])
  })

  it('searches searchText when given (not the counts in the label)', async () => {
    const user = userEvent.setup()
    const { search } = setup([
      { value: 'a', label: 'Bordeaux (12)', searchText: 'Bordeaux' },
      { value: 'b', label: 'Cenon (3)', searchText: 'Cenon' },
    ])
    await user.type(search, '12')
    expect(screen.getByText(/^Aucun résultat/)).toBeTruthy()
  })

  it('explains an empty result when the value searched is already selected', async () => {
    const user = userEvent.setup()
    const { search } = setup(short, ['33063'])
    await user.type(search, 'borde')
    expect(screen.getByText('Aucun autre résultat : ce que vous cherchez est déjà dans la sélection.')).toBeTruthy()
  })

  it('marks the search field for the panel to focus it on opening (autofocus)', () => {
    const { search } = setup(short, [], { autofocus: true })
    expect(search.hasAttribute('data-autofocus')).toBe(true)
  })

  it('has no detectable accessibility violations', async () => {
    const user = userEvent.setup()
    const { search } = setup(long, ['c1'])
    await user.type(search, 'commune 00')
    await expectNoA11yViolations(document.body)
  })
})
