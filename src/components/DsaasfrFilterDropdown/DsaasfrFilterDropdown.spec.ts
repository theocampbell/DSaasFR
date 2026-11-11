import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, ref } from 'vue'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrFilterDropdown from './DsaasfrFilterDropdown.vue'

function setup(props: Record<string, unknown> = {}) {
  const onApply = vi.fn()
  const onReset = vi.fn()
  const Host = defineComponent({
    setup() {
      const open = ref(false)
      return () => h(DsaasfrFilterDropdown, {
        label: 'Instruction',
        icon: 'fr-icon-todo-line',
        applyLabel: 'Afficher 12 dossiers',
        open: open.value,
        'onUpdate:open': (v: boolean) => (open.value = v),
        onApply,
        onReset,
        ...props,
      }, () => h('fieldset', [h('legend', 'Statut'), h('input', { id: 'a', type: 'checkbox' }), h('label', { for: 'a' }, 'En cours')]))
    },
  })
  render(Host)
  return { user: userEvent.setup(), onApply, onReset }
}

describe('DsaasfrFilterDropdown', () => {
  it('is a DSFR secondary button showing the group and its active count', () => {
    setup({ count: 2 })
    const button = screen.getByRole('button', { name: 'Instruction (2), 2 filtres actifs' })
    expect(button.textContent?.trim()).toBe('Instruction (2)')
    expect(button.className).toContain('fr-btn--secondary')
    expect(button.className).toContain('fr-icon-todo-line')
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('shows only the label with no active filter', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Instruction' })).toBeTruthy()
  })

  it('opens the panel with the slot content, then applies, closes and returns focus', async () => {
    const { user, onApply } = setup()
    const button = screen.getByRole('button', { name: 'Instruction' })
    await user.click(button)
    expect(screen.getByRole('group', { name: 'Statut' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Afficher 12 dossiers' }))
    expect(onApply).toHaveBeenCalledOnce()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)
  })

  it('emits reset, which can be disabled', async () => {
    const { user, onReset } = setup()
    await user.click(screen.getByRole('button', { name: 'Instruction' }))
    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('closes on Escape without applying', async () => {
    const { user, onApply } = setup()
    const button = screen.getByRole('button', { name: 'Instruction' })
    await user.click(button)
    await user.keyboard('{Escape}')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(onApply).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(button)
  })

  it('has no detectable accessibility violations, open', async () => {
    const { user } = setup({ count: 1 })
    await user.click(screen.getByRole('button', { name: /^Instruction/ }))
    await expectNoA11yViolations(document.body)
  })
})
