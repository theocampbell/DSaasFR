import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, ref } from 'vue'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsfsAppShell from './DsfsAppShell.vue'

const slots = {
  header: '<header><p>Header</p></header>',
  sidebar: '<ul><li><a href="/dossiers" aria-current="page">Dossiers</a></li></ul>',
  breadcrumb: '<nav aria-label="vous êtes ici :"><span>Accueil</span></nav>',
  toolbar: '<button type="button">Nouveau dossier</button>',
  default: '<h1>Dossiers</h1>',
}

describe('DsfsAppShell', () => {
  it('exposes the expected landmarks', () => {
    render(DsfsAppShell, { slots })

    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Accès rapide' })).toBeTruthy()
  })

  it('renders skip links that target main and the sidebar', () => {
    render(DsfsAppShell, { slots, props: { mainId: 'contenu' } })

    expect(screen.getByRole('link', { name: 'Contenu' }).getAttribute('href')).toBe('#contenu')
    expect(screen.getByRole('link', { name: 'Menu' }).getAttribute('href')).toBe('#contenu-sidebar')
  })

  it('does not render the preview panel unless it is open', () => {
    render(DsfsAppShell, {
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
            DsfsAppShell,
            { previewOpen: open.value, 'onUpdate:previewOpen': (v: boolean) => (open.value = v) },
            {
              default: () => h('h1', 'Dossiers'),
              preview: ({ close }: { close: () => void }) =>
                h('button', { type: 'button', onClick: close }, 'Fermer l’aperçu'),
            },
          )
      },
    })

    render(Host)
    expect(screen.getByRole('complementary', { name: 'Aperçu' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Fermer l’aperçu' }))
    expect(screen.queryByRole('complementary')).toBeNull()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(DsfsAppShell, {
      slots: { ...slots, preview: '<p>Aperçu</p>' },
      props: { previewOpen: true },
    })

    await expectNoA11yViolations(container)
  })
})
