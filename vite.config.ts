import { join } from 'node:path'

import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  resolve: {
    tsconfigPaths: true,
  },
  run: {
    tasks: {
      doc: {
        command: 'node build-docs.ts',
      },
      ci: {
        command: 'vp test run --silent --coverage',
      },
    },
  },
  pack: ['ant-design', 'core', 'create-faas-app', 'dev', 'node-utils', 'react'].map((p) => ({
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
  })),
  lint: {
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
    },
  },
  fmt: {
    semi: false,
    singleQuote: true,
    sortImports: {},
  },
})
