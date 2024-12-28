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
      reporter: [
        'text',
        ['lcov'],
      ]
    },
    reporters: [['junit', { outputFile: 'test-report.junit.xml' }]]
  },
})
