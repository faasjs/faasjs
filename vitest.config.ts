import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    restoreMocks: true,
    typecheck: {
      enabled: true,
    },
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts', 'packages/**/*.tsx'],
      exclude: ['packages/**/__tests/**', 'packages/**/dist/**'],
      reporter: [
        'text',
        'lcov',
        'html',
      ]
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]]
  },
})
