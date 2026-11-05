import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../docs/storybook/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  staticDirs: [{ from: '../node_modules/@gouvfr/dsfr/dist/favicon', to: '/favicon' }],
}

export default config
