/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'dsaasfr',
      cssFileName: 'dsaasfr',
    },
    rollupOptions: {
      // Peer dependencies stay external: the consuming app provides them.
      external: ['vue', 'vue-router', '@gouvminint/vue-dsfr', /^@gouvfr\/dsfr/],
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.spec.ts', 'src/test-utils/**', 'src/**/*.types.ts', 'src/index.ts', 'src/**/index.ts'],
      reporter: ['text-summary', 'text'],
    },
  },
})
