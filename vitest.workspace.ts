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
])
