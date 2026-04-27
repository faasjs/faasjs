import { viteConfig } from '@faasjs/dev'
import { TypedPgVitestPlugin } from '@faasjs/pg-dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  ...viteConfig,
  plugins: [...viteConfig.plugins, TypedPgVitestPlugin()],
  resolve: {
    ...viteConfig.resolve,
    dedupe: ['@faasjs/pg'],
  },
})
