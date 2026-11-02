import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// The playground consumes the library from source, exactly as an app would
// consume the published package (same import path: "dsaasfr").
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // Sub-path when deployed (e.g. /DSaasFR/playground/ on GitHub Pages).
  base: process.env.PLAYGROUND_BASE ?? '/',
  build: {
    outDir: fileURLToPath(new URL('../dist-playground', import.meta.url)),
    emptyOutDir: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      'dsaasfr/styles': fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      'dsaasfr': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
})
