import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'dist-playground/**', '_site/**', 'types/**', 'storybook-static/**', 'coverage/**', 'docs/.vitepress/cache/**', 'docs/.vitepress/dist/**'] },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      // Components are always prefixed (Dsaasfr*), single-word names never happen.
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      // Accessibility is checked by axe in tests and by the a11y-auditor agent,
      // but obvious mistakes should fail fast.
      'vue/no-v-html': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.stories.ts'],
    rules: { 'vue/one-component-per-file': 'off' },
  },
)
