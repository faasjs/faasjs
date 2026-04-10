import { describe, expect, it } from 'vitest'

import { createReactAutoPagesViteConfig, oxfmtConfig, oxlintConfig, viteConfig } from '..'

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

  it('should export the shared vite config', () => {
    expect(viteConfig.server).toEqual({
      host: '0.0.0.0',
      strictPort: false,
      fs: {
        strict: false,
      },
    })
    expect(viteConfig.resolve).toEqual({
      tsconfigPaths: true,
    })
    expect(viteConfig.fmt).toBe(oxfmtConfig)
    expect(viteConfig.lint).toBe(oxlintConfig)
    expect(viteConfig.plugins).toHaveLength(2)
  })

  it('should create the shared React SSR vite config', () => {
    const config = createReactAutoPagesViteConfig()

    expect(config.server).toEqual(viteConfig.server)
    expect(config.resolve).toEqual(viteConfig.resolve)
    expect(config.environments).toEqual({
      ssr: {
        build: {
          ssr: expect.stringContaining('/auto-pages/server-entry.js'),
          outDir: 'dist-server',
        },
      },
    })
    expect(config.builder).toEqual({
      buildApp: expect.any(Function),
    })
  })
})
