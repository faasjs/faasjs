import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
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
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      include: ['packages/**/*.test.ts'],
      exclude: [...browsers, 'packages/vue-plugin/**'],
      environment: 'node',
      restoreMocks: true,
    },
  },
  {
    plugins: [tsconfigPaths(), react()],
    test: {
      globals: true,
      include: browsers,
      environment: 'happy-dom',
      restoreMocks: true,
    },
  }
])
