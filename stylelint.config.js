/**
 * DSFR strictness rules.
 *
 * - Colours: only DSFR CSS variables (var(--background-*), var(--text-*), var(--border-*)).
 *   No hex, no named colours, no rgb()/hsl().
 * - Spacing: only the DSFR spacing scale, exposed as --dsaasfr-space-* in src/styles/tokens.css.
 *   No raw px/rem/em on margin, padding, gap or inset properties.
 *
 * src/styles/tokens.css is the single place allowed to declare raw values.
 */
const spacingProps = '/^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)/'

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch'],
    'declaration-property-unit-disallowed-list': {
      [spacingProps]: ['px', 'rem', 'em'],
      'font-size': ['px', 'rem', 'em'],
      'line-height': ['px', 'rem', 'em'],
    },
    'font-family-no-missing-generic-family-keyword': null,
    'selector-class-pattern': [
      '^(dsaasfr|fr)-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Use BEM with the dsaasfr- prefix (e.g. dsaasfr-app-shell__sidebar--collapsed)' },
    ],
  },
  overrides: [
    {
      files: ['src/styles/tokens.css'],
      rules: {
        'declaration-property-unit-disallowed-list': null,
        // Only for --dsaasfr-backdrop, copied from the DSFR modal (no DSFR token exists).
        'function-disallowed-list': null,
      },
    },
  ],
}
