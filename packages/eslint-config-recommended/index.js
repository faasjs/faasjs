module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json', './packages/*/tsconfig.json'] },
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-confusing-arrow': ['error', { allowParens: true }],
        'no-mixed-operators': 'error',
        'no-tabs': ['error', {'allowIndentationTabs': true}],
        'no-unexpected-multiline': 'error',
        'max-len': ['warn', {'code': 80, 'ignoreUrls': true}],
        curly: [
          'error',
          'multi'
        ],
        'no-sequences': 'error',
        '@typescript-eslint/no-console': 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single'
        ],
        '@typescript-eslint/keyword-spacing': 'error',
        'space-before-blocks': 'error',
        '@typescript-eslint/space-before-function-paren': 'error',
        '@typescript-eslint/semi': [
          'error',
          'never'
        ],
        'eol-last': [
          'error',
          'always'
        ],
        'quote-props': [
          'error',
          'as-needed'
        ],
        'object-curly-newline': [
          'error',
          { multiline: true }
        ],
        '@typescript-eslint/object-curly-spacing': [
          'error',
          'always'
        ],
        'object-property-newline': [
          'error'
        ],
        '@typescript-eslint/comma-spacing': 'warn',
        'no-multi-spaces': 'warn',
        'key-spacing': 'warn',
        '@typescript-eslint/space-infix-ops': 'warn',
        'padded-blocks': [
          'error',
          'never'
        ],
        '@typescript-eslint/indent': [
          'error',
          2
        ],
        '@typescript-eslint/array-type': [
          'error',
          { default: 'array' }
        ],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-implied-eval': 'warn',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' }
        ]
      }
    }
  ]
}
