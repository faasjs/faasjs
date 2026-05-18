import { describe, expect, it } from 'vitest'

import { OxfmtConfig, OxlintConfig, ViteConfig } from '../..'

describe('configs exports', () => {
  it('should export the shared oxfmt config', () => {
    expect(OxfmtConfig).toEqual({
      ignorePatterns: ['**/dist/**', 'node_modules/**'],
      semi: false,
      singleQuote: true,
      sortImports: {},
    })
  })

  it('should export the shared oxlint config', () => {
    expect(OxlintConfig).toEqual({
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

  it('should export the shared vite config', () => {
    expect(ViteConfig.staged).toEqual({
      '*': 'vp check --fix',
    })
    expect(ViteConfig.server).toEqual({
      host: '0.0.0.0',
      strictPort: false,
      fs: {
        strict: false,
      },
    })
    expect(ViteConfig.resolve).toEqual({
      tsconfigPaths: true,
    })
    expect(ViteConfig.fmt).toBe(OxfmtConfig)
    expect(ViteConfig.lint).toBe(OxlintConfig)
    expect(ViteConfig.plugins).toHaveLength(2)
  })
})
