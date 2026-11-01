import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// The playground consumes the library from source, exactly as an app would
// consume the published package (same import path: "dsaasfr").
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue()],
  resolve: {
    alias: {
      'dsaasfr/styles': fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      'dsaasfr': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
})
