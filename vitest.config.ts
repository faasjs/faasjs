import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const browsers = [
  'packages/ant-design/**/*.test.ts',
  'packages/ant-design/**/*.test.tsx',
  'packages/react/**/*.test.ts',
  'packages/react/**/*.test.tsx',
]

const types = ['packages/**/*.types.test.ts']

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    restoreMocks: true,
    clearMocks: true,
    typecheck: {
      enabled: true,
      include: types,
    },
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts', 'packages/**/*.tsx'],
      exclude: ['packages/**/__tests/**', 'packages/**/dist/**'],
      reporter: ['text', 'lcov', 'html'],
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]],
    projects: [
      {
        extends: true,
        test: {
          include: ['packages/**/*.test.ts'],
          exclude: browsers.concat(types),
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          include: browsers,
          exclude: types,
          environment: 'jsdom',
          setupFiles: ['vitest.jsdom.setup.ts'],
        },
      },
    ],
  },
})
