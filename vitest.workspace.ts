import react from '@vitejs/plugin-react'
import { defineWorkspace } from 'vitest/config'

const browsers = [
  'packages/ant-design/**/*.test.ts',
  'packages/ant-design/**/*.test.tsx',
  'packages/browser/**/*.test.ts',
  'packages/browser/**/*.test.tsx',
  'packages/react/**/*.test.ts',
  'packages/react/**/*.test.tsx',
]

export default defineWorkspace([
  {
    test: {
      globals: true,
      include: ['packages/**/*.test.ts'],
      exclude: [...browsers, 'packages/vue-plugin/**'],
      environment: 'node',
      setupFiles: ['vitest.setup.ts'],
    },
  },
  {
    plugins: [react()],
    test: {
      globals: true,
      include: browsers,
      environment: 'happy-dom',
      setupFiles: ['vitest.setup.ts'],
    },
  }
])
