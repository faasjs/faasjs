import { join } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite-plus'
import type { PackUserConfig } from 'vite-plus/pack'

const browsers = [
  'packages/ant-design/**/*.test.ts',
  'packages/ant-design/**/*.test.tsx',
  'packages/react/**/*.test.ts',
  'packages/react/**/*.test.tsx',
]

const types = ['packages/**/*.types.test.ts']

const pack: PackUserConfig[] = [
  'ant-design',
  'core',
  'create-faas-app',
  'dev',
  'node-utils',
  'react',
].map((p) => ({
  platform: ['react', 'ant-design'].includes(p) ? 'browser' : 'node',
  cwd: join(process.cwd(), 'packages', p),
  format: ['esm', 'cjs'],
  checks: {
    legacyCjs: false,
  },
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
  outExtensions({ format }) {
    if (format === 'es')
      return {
        js: '.mjs',
        dts: '.d.ts',
      }

    return {
      js: '.cjs',
      dts: '.d.ts',
    }
  },
}))

const ignorePatterns = ['**/dist/**', 'node_modules/**']

export default defineConfig({
  plugins: react(),
  staged: {
    '*': 'vp check --fix',
  },
  resolve: {
    tsconfigPaths: true,
  },
  fmt: {
    ignorePatterns,
    semi: false,
    singleQuote: true,
    sortImports: {},
  },
  lint: {
    ignorePatterns,
    plugins: [
      'typescript',
      'react',
      'react-perf',
      'node',
      'vitest',
      'oxc',
      'unicorn',
      'eslint',
      'import',
      'jsdoc',
    ],
    env: {
      builtin: true,
      node: true,
      browser: true,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'typescript/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'react-hooks/exhaustive-deps': ['warn'],
    },
  },
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
      exclude: ['packages/**/__tests/**', 'packages/**/dist/**'],
      reporter: ['text', 'lcov', 'html'],
    },
    reporters: ['default', ['junit', { outputFile: 'test-report.junit.xml' }]],
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: ['packages/**/*.test.ts'],
          exclude: browsers.concat(types),
          environment: 'node',
        },
      },
      {
        extends: true as const,
        test: {
          name: 'browser',
          include: browsers,
          exclude: types,
          environment: 'jsdom',
          setupFiles: ['vitest.jsdom.setup.ts'],
        },
      },
    ],
  },
} as UserConfig)
