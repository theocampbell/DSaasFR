import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, nextTick, ref } from 'vue'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrFilterModal from './DsaasfrFilterModal.vue'

function setup(props: Record<string, unknown> = {}) {
  const onApply = vi.fn()
  const onCancel = vi.fn()
  const Host = defineComponent({
    setup() {
      const open = ref(false)
      return () => h('div', { class: 'bars' }, [h(DsaasfrFilterModal, {
        label: 'Communes',
        icon: 'fr-icon-map-pin-2-line',
        applyLabel: 'Afficher 12 dossiers',
        countText: (n: number) => `${n} communes sélectionnées`,
        open: open.value,
        'onUpdate:open': (v: boolean) => (open.value = v),
        onApply,
        onCancel,
        ...props,
      }, () => h('p', 'Contenu du filtre'))])
    },
  })
  const { container } = render(Host)
  return { user: userEvent.setup(), onApply, onCancel, container }
}
const dialog = () => document.querySelector<HTMLElement>('dialog.dsaasfr-filter-modal')!

describe('DsaasfrFilterModal', () => {
  it('is a DSFR secondary button showing the filter and its count, that opens a dialog', () => {
    setup({ count: 3 })
    const button = screen.getByRole('button', { name: 'Communes (3), 3 communes sélectionnées' })
    expect(button.textContent?.trim()).toBe('Communes (3)')
    expect(button.className).toContain('fr-btn--secondary')
    expect(button.getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('renders the modal at page level, outside the bars it is used in', async () => {
    const { user, container } = setup()
    await user.click(screen.getByRole('button', { name: 'Communes' }))
    await nextTick()
    expect(container.querySelector('.bars')!.contains(dialog())).toBe(false)
    expect(document.body.contains(dialog())).toBe(true)
    expect(within(dialog()).getByText('Contenu du filtre')).toBeTruthy()
    expect(dialog().className).toContain('dsaasfr-filter-modal--fixed')
  })

  it('applies, closes and gives focus back to the button', async () => {
    const { user, onApply } = setup()
    const button = screen.getByRole('button', { name: 'Communes' })
    await user.click(button)
    await nextTick()
    await user.click(within(dialog()).getByRole('button', { name: 'Afficher 12 dossiers' }))
    expect(onApply).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(document.activeElement).toBe(button))
  })

  it('cancels without applying', async () => {
    const { user, onApply, onCancel } = setup()
    await user.click(screen.getByRole('button', { name: 'Communes' }))
    await nextTick()
    await user.click(within(dialog()).getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalled()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('has no detectable accessibility violations', async () => {
    setup({ count: 2 })
    await expectNoA11yViolations(document.body)
  })
})
