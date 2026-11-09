import { render, screen } from '@testing-library/vue'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrAppShell from './DsaasfrAppShell.vue'
import type { DsaasfrAppShellPreviewScope } from './DsaasfrAppShell.types'

const slots = {
  header: '<header><p>Header</p></header>',
  sidebar: '<nav aria-label="Navigation principale"><ul><li><a href="/dossiers" aria-current="page">Dossiers</a></li></ul></nav>',
  breadcrumb: '<nav aria-label="vous êtes ici :"><span>Accueil</span></nav>',
  toolbar: '<button type="button">Nouveau dossier</button>',
  default: '<h1>Dossiers</h1>',
}

describe('DsaasfrAppShell', () => {
  it('exposes the expected landmarks', () => {
    render(DsaasfrAppShell, { slots })

    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Accès rapide' })).toBeTruthy()
  })

  it('renders skip links that target main and the sidebar', () => {
    render(DsaasfrAppShell, { slots, props: { mainId: 'contenu' } })

    expect(screen.getByRole('link', { name: 'Contenu' }).getAttribute('href')).toBe('#contenu')
    expect(screen.getByRole('link', { name: 'Menu' }).getAttribute('href')).toBe('#contenu-sidebar')
  })

  it('does not render the preview panel unless it is open', () => {
    render(DsaasfrAppShell, {
      slots: { ...slots, preview: '<p>Aperçu du document</p>' },
    })

    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('lets the preview close itself through the slot scope', async () => {
    const user = userEvent.setup()
    const Host = defineComponent({
      setup() {
        const open = ref(true)
        return () =>
          h(
            DsaasfrAppShell,
            { previewOpen: open.value, 'onUpdate:previewOpen': (v: boolean) => (open.value = v) },
            {
              default: () => h('h1', 'Dossiers'),
              preview: ({ closePreview }: DsaasfrAppShellPreviewScope) =>
                h('button', { type: 'button', onClick: closePreview }, 'Fermer l’aperçu'),
            },
          )
      },
    })

    render(Host)
    expect(screen.getByRole('complementary', { name: 'Aperçu' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Fermer l’aperçu' }))
    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('wires the preview toggle and returns focus to it when the preview closes', async () => {
    const user = userEvent.setup()
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () =>
          h(
            DsaasfrAppShell,
            { previewOpen: open.value, 'onUpdate:previewOpen': (v: boolean) => (open.value = v) },
            {
              toolbar: ({ togglePreview, previewToggleAttrs }: DsaasfrAppShellPreviewScope) =>
                h('button', { type: 'button', ...previewToggleAttrs, onClick: togglePreview }, 'Aperçu'),
              default: () => h('h1', 'Dossiers'),
              preview: ({ closePreview }: DsaasfrAppShellPreviewScope) =>
                h('button', { type: 'button', onClick: closePreview }, 'Fermer l’aperçu'),
            },
          )
      },
    })

    render(Host)
    const toggle = screen.getByRole('button', { name: 'Aperçu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    await user.click(toggle)
    const panel = screen.getByRole('complementary', { name: 'Aperçu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.getAttribute('aria-controls')).toBe(panel.id)

    await user.click(screen.getByRole('button', { name: 'Fermer l’aperçu' }))
    expect(screen.queryByRole('complementary')).toBeNull()
    expect(document.activeElement).toBe(toggle)
  })

  it('closes the floating preview on a click outside it, not inside', async () => {
    const user = userEvent.setup()
    const Host = defineComponent({
      setup() {
        const open = ref(true)
        return () =>
          h(
            DsaasfrAppShell,
            {
              previewMode: 'overlay',
              previewOpen: open.value,
              'onUpdate:previewOpen': (v: boolean) => (open.value = v),
            },
            {
              default: () => h('h1', 'Dossiers'),
              preview: () => h('p', 'Dossier 42'),
            },
          )
      },
    })

    render(Host)
    expect(screen.getByRole('dialog', { name: 'Aperçu' })).toBeTruthy()

    await user.click(screen.getByText('Dossier 42'))
    expect(screen.getByRole('dialog', { name: 'Aperçu' })).toBeTruthy()

    await user.click(screen.getByText('Dossiers'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('scrolls the page back to the top when the page changes', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
    })
    await router.push('/dossiers')
    await router.isReady()
    render(DsaasfrAppShell, { slots, global: { plugins: [router] } })

    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    await router.push('/dossiers?tri=date')
    expect(scrollTo).not.toHaveBeenCalled()

    await router.push('/usagers')
    await vi.waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0 }))
    scrollTo.mockRestore()
  })

  it('sets the sidebar width from sidebarSize (DSFR-scale tokens)', () => {
    const { container, rerender } = render(DsaasfrAppShell, { slots, props: { sidebarSize: 'lg' } })
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue('--dsaasfr-shell-sidebar-width')).toBe('var(--dsaasfr-shell-sidebar-width-lg)')

    return rerender({ sidebarSize: undefined }).then(() => {
      expect(root.style.getPropertyValue('--dsaasfr-shell-sidebar-width')).toBe('')
    })
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(DsaasfrAppShell, {
      slots: { ...slots, preview: '<p>Aperçu</p>' },
      props: { previewOpen: true },
    })

    await expectNoA11yViolations(container)
  })
})
