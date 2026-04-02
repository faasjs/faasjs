import type { UserConfig } from 'vite-plus'

const ignorePatterns = ['**/dist/**', 'node_modules/**']

/**
 * Shared Oxfmt configuration used by FaasJS projects.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { oxfmtConfig } from '@faasjs/dev/configs'
 *
 * export default defineConfig({
 *   fmt: oxfmtConfig,
 * })
 * ```
 */
export const oxfmtConfig: NonNullable<UserConfig['fmt']> = {
  ignorePatterns: [...ignorePatterns],
  semi: false,
  singleQuote: true,
  sortImports: {},
}

/**
 * Shared Oxlint configuration used by FaasJS projects.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { oxlintConfig } from '@faasjs/dev/configs'
 *
 * export default defineConfig({
 *   lint: oxlintConfig,
 * })
 * ```
 */
export const oxlintConfig: NonNullable<UserConfig['lint']> = {
  ignorePatterns: [...ignorePatterns],
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
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'typescript/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
    'react-hooks/exhaustive-deps': ['warn'],
  },
}
