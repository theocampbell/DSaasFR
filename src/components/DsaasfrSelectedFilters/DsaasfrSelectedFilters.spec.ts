import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, ref } from 'vue'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrSelectedFilters from './DsaasfrSelectedFilters.vue'
import type { DsaasfrSelectedFilter } from './DsaasfrSelectedFilters.types'

const initial: DsaasfrSelectedFilter[] = [
  { key: 'commune', label: 'Commune', values: ['Pessac', 'Talence'] },
  { key: 'statut', label: 'Statut', values: ['En cours'] },
  { key: 'type', label: 'Type', values: ['Certificat d’urbanisme', 'Déclaration préalable', 'Permis de construire'] },
]

function setup(start = initial) {
  const onEmpty = vi.fn()
  const Host = defineComponent({
    setup() {
      const items = ref([...start])
      return () => h(DsaasfrSelectedFilters, {
        items: items.value,
        onRemove: (key: string) => (items.value = items.value.filter(i => i.key !== key)),
        onClear: () => (items.value = []),
        onEmpty,
      }, { default: () => h('p', { role: 'status' }, `${items.value.length} filtres`) })
    },
  })
  render(Host)
  return { user: userEvent.setup(), onEmpty }
}

describe('DsaasfrSelectedFilters', () => {
  it('shows one DSFR dismissible tag per filter, in a named group, after the slot', () => {
    setup()
    const group = screen.getByRole('group', { name: 'Filtres sélectionnés' })
    const list = within(group).getByRole('list')
    const tags = within(list).getAllByRole('button')
    expect(tags).toHaveLength(3)
    expect(tags[0]!.className).toContain('fr-tag--dismiss')
    expect(tags[0]!.textContent?.trim()).toBe('Commune : Pessac et 1 autre')
    expect(screen.getByRole('status').compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('names each tag with its visible text, and describes the summarised values', () => {
    setup()
    // Voice control: the name contains the visible text (RGAA 7.1.3, WCAG 2.5.3).
    const tag = screen.getByRole('button', { name: 'Retirer le filtre Type : Certificat d’urbanisme et 2 autres' })
    expect(tag.textContent?.trim()).toBe('Type : Certificat d’urbanisme et 2 autres')
    const description = document.getElementById(tag.getAttribute('aria-describedby')!)!
    expect(description.textContent).toBe('Certificat d’urbanisme, Déclaration préalable, Permis de construire')
    // A single value: nothing hidden, no description.
    expect(screen.getByRole('button', { name: 'Retirer le filtre Statut : En cours' }).hasAttribute('aria-describedby')).toBe(false)
  })

  it('shows one value then a count for many values (50 communes), describes at most 10', () => {
    setup([{ key: 'commune', label: 'Commune', values: Array.from({ length: 50 }, (_, i) => `C${i + 1}`) }])
    const tag = screen.getByRole('button', { name: 'Retirer le filtre Commune : C1 et 49 autres' })
    expect(tag.textContent?.trim()).toBe('Commune : C1 et 49 autres')
    expect(document.getElementById(tag.getAttribute('aria-describedby')!)!.textContent).toBe('C1, C2, C3, C4, C5, C6, C7, C8, C9, C10 et 40 autres')
  })

  it('removes a filter and moves focus to the next tag, then the previous one', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: /^Retirer le filtre Statut/ }))
    expect(screen.queryByRole('button', { name: /^Retirer le filtre Statut/ })).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Retirer le filtre Type/ }))

    await user.click(screen.getByRole('button', { name: /^Retirer le filtre Type/ }))
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Retirer le filtre Commune/ }))
  })

  it('tells the app when the last filter is removed, so it can move focus', async () => {
    const { user, onEmpty } = setup([initial[1]!])
    expect(screen.queryByRole('button', { name: 'Tout effacer' })).toBeNull() // from two filters on
    await user.click(screen.getByRole('button', { name: /^Retirer le filtre Statut/ }))
    expect(screen.queryByRole('group')).toBeNull()
    expect(onEmpty).toHaveBeenCalledOnce()
  })

  it('clears every filter', async () => {
    const { user, onEmpty } = setup()
    await user.click(screen.getByRole('button', { name: 'Tout effacer' }))
    expect(screen.queryByRole('group')).toBeNull()
    expect(onEmpty).toHaveBeenCalledOnce()
  })

  it('can be right-aligned under the filter buttons', () => {
    render(DsaasfrSelectedFilters, { props: { items: initial, align: 'end' } })
    expect(screen.getByRole('group', { name: 'Filtres sélectionnés' }).className).toContain('dsaasfr-selected-filters--end')
  })

  it('has no detectable accessibility violations', async () => {
    setup()
    await expectNoA11yViolations(document.body)
  })
})
