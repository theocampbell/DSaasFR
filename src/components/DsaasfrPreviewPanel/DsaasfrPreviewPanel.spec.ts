import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, vi } from 'vitest'
import { expectNoA11yViolations } from '@/test-utils/axe'
import { usePreviewQuery } from '../../composables/usePreviewQuery'
import DsaasfrAppShell from '../DsaasfrAppShell/DsaasfrAppShell.vue'
import DsaasfrPreviewPanel from './DsaasfrPreviewPanel.vue'

function mockViewport(narrow: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: narrow, media: query, addEventListener: () => {}, removeEventListener: () => {},
  }))
}

/** A shell whose preview is opened by a button in the toolbar. */
function renderShell() {
  const Host = defineComponent({
    setup() {
      const open = ref(false)
      return () => h(DsaasfrAppShell, {
        'previewOpen': open.value,
        'onUpdate:previewOpen': (v: boolean) => (open.value = v),
      }, {
        sidebar: () => h('nav', { 'aria-label': 'Navigation principale' }, h('a', { href: '#x' }, 'Dossiers')),
        toolbar: () => h('button', { type: 'button', onClick: () => (open.value = true) }, 'Aperçu du dossier D-2026-2041'),
        default: () => h('h1', 'Dossiers'),
        preview: () => h(DsaasfrPreviewPanel, { title: 'Dossier D-2026-2041', description: 'Permis de construire' }, {
          actions: () => h('a', { href: '#ouvrir' }, 'Ouvrir le dossier'),
          default: () => h('p', 'Demandeur : Alix Petit'),
        }),
      })
    },
  })
  const user = userEvent.setup()
  const result = render(Host)
  return { ...result, user, opener: screen.getByRole('button', { name: 'Aperçu du dossier D-2026-2041' }) }
}

afterEach(() => vi.unstubAllGlobals())

describe('DsaasfrPreviewPanel in DsaasfrAppShell', () => {
  it('names the preview region after its title and moves focus to the title on open', async () => {
    const { user, opener } = renderShell()

    await user.click(opener)

    const region = await screen.findByRole('complementary', { name: 'Dossier D-2026-2041' })
    const title = screen.getByRole('heading', { name: 'Dossier D-2026-2041', level: 2 })
    expect(region.contains(title)).toBe(true)
    await vi.waitFor(() => expect(document.activeElement).toBe(title))
  })

  it('closes with the DSFR close button and returns focus to the opener', async () => {
    const { user, opener } = renderShell()
    await user.click(opener)

    await user.click(await screen.findByRole('button', { name: 'Fermer l’aperçu' }))

    expect(screen.queryByRole('complementary')).toBeNull()
    await vi.waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('closes on Escape from inside the panel', async () => {
    const { user, opener } = renderShell()
    await user.click(opener)
    await screen.findByRole('complementary')

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('complementary')).toBeNull()
    await vi.waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('does not steal focus when the preview is open from the start (shared link)', async () => {
    render(DsaasfrAppShell, {
      props: { previewOpen: true },
      slots: { default: '<h1>Dossiers</h1>', preview: '<p>Aperçu</p>' },
    })
    await nextTick()

    expect(document.activeElement).toBe(document.body)
  })

  it('makes the rest of the page inert on narrow screens (full-screen preview, a modal dialog)', async () => {
    mockViewport(true)
    const { user, opener } = renderShell()
    await user.click(opener)
    const dialog = await screen.findByRole('dialog', { name: 'Dossier D-2026-2041' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    await nextTick()

    expect(screen.getByRole('main').closest('[inert]')).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Navigation principale' }).closest('[inert]')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Contenu' }).closest('[inert]')).toBeTruthy()
    expect(dialog.closest('[inert]')).toBeNull()
  })

  it('keeps the page interactive and the preview a side region in push mode', async () => {
    mockViewport(false)
    const { user, opener } = renderShell()
    await user.click(opener)
    await screen.findByRole('complementary')

    expect(screen.getByRole('main').closest('[inert]')).toBeNull()
  })

  it('has no detectable accessibility violations when open', async () => {
    const { container, user, opener } = renderShell()
    await user.click(opener)
    await screen.findByRole('complementary')

    await expectNoA11yViolations(container)
  })
})

describe('DsaasfrPreviewPanel on its own', () => {
  it('emits close', async () => {
    const user = userEvent.setup()
    const { emitted } = render(DsaasfrPreviewPanel, { props: { title: 'Pièce 2' } })

    await user.click(screen.getByRole('button', { name: 'Fermer l’aperçu' }))

    expect(emitted('close')).toHaveLength(1)
  })
})

describe('DsaasfrPreviewPanel previous / next', () => {
  it('shows the navigation only when asked, and disables unavailable directions', async () => {
    const { rerender } = render(DsaasfrPreviewPanel, { props: { title: 'Dossier 1' } })
    expect(screen.queryByRole('button', { name: 'Élément suivant' })).toBeNull()

    await rerender({ title: 'Dossier 1', hasPrevious: false, hasNext: true })
    expect((screen.getByRole('button', { name: 'Élément précédent' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Élément suivant' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('emits next, keeps focus on the button and announces the new item', async () => {
    const user = userEvent.setup()
    const Host = defineComponent({
      setup() {
        const n = ref(1)
        return () => h(DsaasfrPreviewPanel, {
          title: `Dossier ${n.value}`, hasPrevious: n.value > 1, hasNext: true,
          nextLabel: 'Dossier suivant', onNext: () => n.value++,
        })
      },
    })
    render(Host)
    const next = screen.getByRole('button', { name: 'Dossier suivant' })

    await user.click(next)

    expect(screen.getByRole('heading', { name: 'Dossier 2' })).toBeTruthy()
    expect(document.activeElement).toBe(next)
    expect(screen.getByRole('status').textContent?.trim()).toBe('Dossier 2')
  })
})

describe('DsaasfrAppShell previewMode="overlay"', () => {
  function renderOverlay() {
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () => h(DsaasfrAppShell, {
          'previewMode': 'overlay',
          'previewSize': 'lg',
          'previewOpen': open.value,
          'onUpdate:previewOpen': (v: boolean) => (open.value = v),
        }, {
          toolbar: () => h('button', { type: 'button', onClick: () => (open.value = true) }, 'Aperçu'),
          default: () => h('h1', 'Dossiers'),
          preview: () => h(DsaasfrPreviewPanel, { title: 'Dossier 1' }),
        })
      },
    })
    const user = userEvent.setup()
    const result = render(Host)
    return { ...result, user, opener: screen.getByRole('button', { name: 'Aperçu' }) }
  }

  it('is a modal dialog over the paused page on wide screens', async () => {
    mockViewport(false)
    const { user, opener } = renderOverlay()
    await user.click(opener)
    const dialog = await screen.findByRole('dialog', { name: 'Dossier 1' })

    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByRole('main').closest('[inert]')).toBeTruthy()
    expect(dialog.closest('[inert]')).toBeNull()
    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('closes when the veil is clicked and returns focus to the opener', async () => {
    mockViewport(false)
    const { user, opener, container } = renderOverlay()
    await user.click(opener)
    await screen.findByRole('dialog')

    await user.click(container.querySelector('[aria-hidden="true"]') as HTMLElement)

    expect(screen.queryByRole('dialog')).toBeNull()
    await vi.waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('sets the preview width from previewSize', () => {
    const { container } = render(DsaasfrAppShell, { props: { previewSize: 'lg' }, slots: { default: '<h1>X</h1>' } })
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--dsaasfr-shell-preview-width'))
      .toBe('var(--dsaasfr-shell-preview-width-lg)')
  })
})

describe('usePreviewQuery', () => {
  async function setup() {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:p(.*)*', component: { render: () => null } }] })
    await router.push('/dossiers')
    await router.isReady()
    let api!: ReturnType<typeof usePreviewQuery>
    render(defineComponent({ setup() { api = usePreviewQuery(); return () => null } }), { global: { plugins: [router] } })
    return { router, api }
  }

  it('opens into the URL, Back closes it', async () => {
    const { router, api } = await setup()

    api.open('D-2026-2041')
    await vi.waitFor(() => expect(router.currentRoute.value.query.apercu).toBe('D-2026-2041'))
    expect(api.isOpen.value).toBe(true)
    expect(api.item.value).toBe('D-2026-2041')

    router.back()
    await vi.waitFor(() => expect(api.isOpen.value).toBe(false))
    expect(router.currentRoute.value.path).toBe('/dossiers')
  })

  it('closes by replacing the history entry', async () => {
    const { router, api } = await setup()
    api.open('D-2026-2041')
    await vi.waitFor(() => expect(api.isOpen.value).toBe(true))

    api.isOpen.value = false

    await vi.waitFor(() => expect(router.currentRoute.value.query.apercu).toBeUndefined())
  })
})
