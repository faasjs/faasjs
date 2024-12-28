import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts', 'packages/**/*.tsx'],
      exclude: ['packages/**/*.test.ts', 'packages/**/*.test.tsx', 'packages/vue-plugin/**', 'packages/**/dist/**'],
      reporter: [
        'text',
        ['lcov'],
      ]
    },
    reporters: [['junit', { outputFile: 'test-report.junit.xml' }]]
  },
})
