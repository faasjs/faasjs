import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      globals: true,
      include: ['packages/**/*.test.ts'],
      environment: 'node',
      setupFiles: ['vitest.setup.ts'],
    }
  }
])
