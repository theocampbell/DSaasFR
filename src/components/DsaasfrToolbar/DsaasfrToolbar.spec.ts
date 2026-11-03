import { render, screen } from '@testing-library/vue'
import { expectNoA11yViolations } from '@/test-utils/axe'
import DsaasfrToolbar from './DsaasfrToolbar.vue'

const slots = {
  start: '<p>40 dossiers</p><button type="button">Statut : à instruire</button>',
  end: '<button type="button">Filtrer</button><button type="button">Exporter</button>',
}

describe('DsaasfrToolbar', () => {
  it('renders start and end content in reading order', () => {
    render(DsaasfrToolbar, { slots })

    const order = screen.getAllByRole('button').map(b => b.textContent)
    expect(order).toEqual(['Statut : à instruire', 'Filtrer', 'Exporter'])
  })

  it('is plain layout without a label, a labelled group with one', () => {
    const { unmount } = render(DsaasfrToolbar, { slots })
    expect(screen.queryByRole('group')).toBeNull()
    unmount()

    render(DsaasfrToolbar, { slots, props: { label: 'Filtres et actions' } })
    expect(screen.getByRole('group', { name: 'Filtres et actions' })).toBeTruthy()
  })


  it('has no detectable accessibility violations', async () => {
    const { container } = render(DsaasfrToolbar, { slots, props: { label: 'Filtres et actions' } })

    await expectNoA11yViolations(container)
  })
})
