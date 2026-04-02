import { describe, expect, it } from 'vitest'

import { oxfmtConfig, oxlintConfig } from '..'

describe('configs exports', () => {
  it('should export the shared oxfmt config', () => {
    expect(oxfmtConfig).toEqual({
      ignorePatterns: ['**/dist/**', 'node_modules/**'],
      semi: false,
      singleQuote: true,
      sortImports: {},
    })
  })

  it('should export the shared oxlint config', () => {
    expect(oxlintConfig).toEqual({
      ignorePatterns: ['**/dist/**', 'node_modules/**'],
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
    })
  })
})
