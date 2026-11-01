import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe-core against a rendered container and fails with a readable report.
 * jsdom cannot compute colours or layout, so colour-contrast is checked in
 * Storybook (addon-a11y) and by the a11y-auditor agent instead.
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      // Components are rendered in isolation, not as a full page.
      region: { enabled: false },
    },
  })
  const report = results.violations
    .map(v => `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes.map(n => n.target.join(' ')).join('\n  ')}`)
    .join('\n')
  expect(results.violations, report).toHaveLength(0)
}
