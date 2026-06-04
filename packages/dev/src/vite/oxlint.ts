import type { UserConfig } from 'vite-plus'

const ignorePatterns = ['**/dist/**', '**/.faasjs/**', 'node_modules/**']

/**
 * Shared Oxlint configuration used by FaasJS projects.
 *
 * Enables TypeScript, React, Node, Vitest, Unicorn, ESLint, Import, and JSDoc
 * plugins with type-aware checking. The most opinionated rule is
 * {@link https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars.html | no-unused-vars}
 * with `argsIgnorePattern: '^_'`, while
 * {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-imports.html | consistent-type-imports}
 * enforces `type`-only imports.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { OxlintConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   lint: OxlintConfig,
 * })
 * ```
 */
export const OxlintConfig: NonNullable<UserConfig['lint']> = {
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
    'jsdoc/no-defaults': ['off'],
  },
}
