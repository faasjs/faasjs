import { join } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite-plus'
import type { PackUserConfig } from 'vite-plus/pack'

import { oxfmtConfig } from './packages/dev/src/vite/oxfmt.ts'
import { oxlintConfig } from './packages/dev/src/vite/oxlint.ts'

const tests = ['packages/**/*.test.ts', 'packages/**/*.test.tsx']

const uiTests = ['packages/**/*.ui.test.ts', 'packages/**/*.ui.test.tsx']

const types = ['packages/**/*.types.test.ts', 'packages/**/*.types.test.tsx']

const pgTests = [
  'packages/pg/**/*.test.ts',
  'packages/pg/**/*.test.tsx',
  'packages/pg-dev/**/*.test.ts',
  'packages/pg-dev/**/*.test.tsx',
]

const packEntries: Record<string, Record<string, string>> = {
  dev: {
    index: './src/index.ts',
    'cli/index': './src/cli/index.ts',
  },
  'node-utils': {
    index: './src/index.ts',
    register_hooks: './src/register_hooks.ts',
  },
  pg: {
    index: './src/index.ts',
    'cli/index': './src/cli/index.ts',
  },
  'pg-dev': {
    index: './src/index.ts',
    'typed-pg-vitest-global-setup': './src/typed-pg-vitest-global-setup.ts',
    'typed-pg-vitest-setup': './src/typed-pg-vitest-setup.ts',
  },
  react: {
    index: './src/index.ts',
  },
}

const pack: PackUserConfig[] = [
  'ant-design',
  'core',
  'create-faas-app',
  'dev',
  'pg',
  'pg-dev',
  'utils',
  'node-utils',
  'react',
].map((p) => ({
  platform: ['react', 'ant-design', 'utils'].includes(p) ? 'browser' : 'node',
  cwd: join(process.cwd(), 'packages', p),
  ...(packEntries[p] ? { entry: packEntries[p] } : {}),
  format: ['esm'],
  clean: true,
  dts: {
    sourcemap: false,
    eager: true,
  },
  deps: {
    skipNodeModulesBundle: true,
  },
  sourcemap: false,
  treeshake: true,
  tsconfig: join(process.cwd(), 'tsconfig.build.json'),
  shims: true,
  outExtensions() {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
}))

export default defineConfig({
  plugins: react(),
  staged: {
    '*': 'vp check --fix *',
  },
  resolve: {
    tsconfigPaths: true,
  },
  fmt: oxfmtConfig,
  lint: oxlintConfig,
  pack,
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
      exclude: ['packages/**/__tests/**', 'packages/**/dist/**', 'packages/**/template/**'],
      reporter: ['text', 'lcov', 'html'],
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]],
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: tests,
          exclude: uiTests.concat(types, pgTests),
          environment: 'node',
        },
      },
      {
        extends: true as const,
        test: {
          name: 'pg',
          include: pgTests,
          exclude: types,
          environment: 'node',
          globalSetup: ['packages/pg/src/__tests__/global-setup.ts'],
          setupFiles: ['packages/pg/src/__tests__/setup.ts'],
        },
      },
      {
        extends: true as const,
        test: {
          name: 'ui',
          include: uiTests,
          exclude: types,
          environment: 'jsdom',
          setupFiles: ['vitest.ui.setup.ts'],
          testTimeout: 10000,
        },
      },
    ],
  },
} as UserConfig)
