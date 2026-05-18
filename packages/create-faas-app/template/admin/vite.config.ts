import { ViteConfig } from '@faasjs/dev'
import { PgVitestPlugin } from '@faasjs/pg-dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  ...ViteConfig,
  plugins: [...ViteConfig.plugins, PgVitestPlugin()],
  test: {
    fileParallelism: false,
    testTimeout: 30_000,
  },
})
