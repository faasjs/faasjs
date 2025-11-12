import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const browsers = [
  'packages/ant-design/**/*.test.ts',
  'packages/ant-design/**/*.test.tsx',
  'packages/browser/**/*.test.ts',
  'packages/browser/**/*.test.tsx',
  'packages/react/**/*.test.ts',
  'packages/react/**/*.test.tsx',
]

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    restoreMocks: true,
    clearMocks: true,
    typecheck: {
      enabled: true,
    },
    setupFiles: ['vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts', 'packages/**/*.tsx'],
      exclude: ['packages/**/__tests/**', 'packages/**/dist/**'],
      reporter: ['text', 'lcov', 'html'],
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]],
    projects: [
      {
        extends: './vitest.config.ts',
        test: {
          include: ['packages/**/*.test.ts'],
          exclude: browsers,
          environment: 'node',
        },
      },
      {
        extends: './vitest.config.ts',
        test: {
          include: browsers,
          environment: 'happy-dom',
        },
      },
    ],
  },
})
