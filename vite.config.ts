import { join } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite-plus'
import type { PackUserConfig } from 'vite-plus/pack'
import { viteConfig } from '@faasjs/dev'
import { PgVitestPlugin } from '@faasjs/pg-dev'

const tests = ['packages/**/*.test.ts']

const uiTests = ['packages/**/*.test.tsx', 'packages/**/*.ui.test.ts']

const typeTests = ['packages/**/*.types.test.ts', 'packages/**/*.types.test.tsx']

const pgTests = [
  'packages/jobs/**/*.test.ts',
  'packages/pg/**/*.test.ts',
  'packages/pg-dev/**/*.test.ts',
]

const adminTemplateTests = ['packages/create-faas-app/template/admin/**/*.test.ts']
const adminTemplateRoot = join(process.cwd(), 'packages/create-faas-app/template/admin')
const workspacePackageAliases = Object.fromEntries(
  [
    'ant-design',
    'core',
    'dev',
    'docgen',
    'jobs',
    'node-utils',
    'pg',
    'pg-dev',
    'react',
    'utils',
  ].map((packageName) => [
    `@faasjs/${packageName}`,
    join(process.cwd(), 'packages', packageName, 'src/index.ts'),
  ]),
)

const packEntries: Record<string, Record<string, string>> = {
  dev: {
    index: './src/index.ts',
    'cli/index': './src/cli/index.ts',
  },
  docgen: {
    index: './src/index.ts',
    cli: './src/cli.ts',
  },
  jobs: {
    index: './src/index.ts',
  },
  'node-utils': {
    index: './src/index.ts',
    register_hooks: './src/register_hooks/index.ts',
  },
  pg: {
    index: './src/index.ts',
    'cli/index': './src/cli/index.ts',
  },
  'pg-dev': {
    index: './src/index.ts',
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
  'docgen',
  'jobs',
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
  outExtensions() {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
}))

export default defineConfig({
  plugins: react(),
  staged: viteConfig.staged,
  resolve: viteConfig.resolve,
  fmt: viteConfig.fmt,
  lint: viteConfig.lint,
  pack,
  test: {
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts', 'packages/**/*.tsx'],
      exclude: [
        'packages/**/*.test.ts',
        'packages/**/*.test.tsx',
        'packages/**/*.ui.test.ts',
        'packages/**/*.types.test.ts',
        'packages/**/*.types.test.tsx',
        'packages/**/dist/**',
        'packages/**/fixtures/**',
        'packages/**/template/**',
      ],
      reporter: ['text', 'lcov', 'html'],
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]],
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: tests,
          exclude: uiTests.concat(typeTests, pgTests, adminTemplateTests),
          environment: 'node',
        },
      },
      {
        extends: true as const,
        root: adminTemplateRoot,
        plugins: [PgVitestPlugin()],
        resolve: {
          alias: workspacePackageAliases,
          dedupe: ['@faasjs/pg'],
        },
        test: {
          name: 'template-admin',
          include: ['src/**/*.test.ts'],
          environment: 'node',
          fileParallelism: false,
          testTimeout: 30_000,
        },
      },
      {
        extends: true as const,
        test: {
          name: 'node-pg',
          include: pgTests,
          exclude: typeTests,
          environment: 'node',
          fileParallelism: false,
          setupFiles: ['packages/pg-dev/src/testing-setup.ts'],
          testTimeout: 30_000,
        },
      },
      {
        extends: true as const,
        test: {
          name: 'ui',
          include: uiTests,
          exclude: typeTests,
          environment: 'jsdom',
          setupFiles: ['vitest.ui.setup.ts'],
          testTimeout: 10000,
        },
      },
      {
        extends: true as const,
        test: {
          name: 'types',
          include: typeTests,
          environment: 'node',
          typecheck: {
            enabled: true,
            only: true,
            include: typeTests,
          },
        },
      },
    ],
  },
} satisfies UserConfig)
