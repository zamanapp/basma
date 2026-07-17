import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'Basma',
      fileName: format => (format === 'es' ? 'basma.js' : 'basma.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' }, exports: 'named' },
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
