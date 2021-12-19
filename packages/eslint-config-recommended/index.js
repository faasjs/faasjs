module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: [
        '**/*.js',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx'
      ],
      rules: {
        'array-element-newline': [
          'error',
          {
            minItems: 3,
            multiline: true
          }
        ],
        'array-bracket-newline': [
          'error',
          {
            multiline: true,
            minItems: 3,
          }
        ],
        'object-curly-spacing': ['error', 'always'],
        'keyword-spacing': 'error',
        indent: [
          'error',
          2,
          { SwitchCase: 1 }
        ],
        'no-confusing-arrow': ['error', { allowParens: true }],
        'no-mixed-operators': 'error',
        'no-tabs': 'error',
        'no-unexpected-multiline': 'error',
        'max-len': [
          'warn',
          {
            code: 120,
            ignoreUrls: true,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true
          }
        ],
        'no-sequences': 'error',
        'space-before-blocks': 'error',
        'eol-last': ['error', 'always'],
        'quote-props': ['error', 'as-needed'],
        'object-curly-newline': [
          'error',
          {
            minProperties: 3,
            multiline: true
          }
        ],
        'object-property-newline': 'error',
        'no-multi-spaces': 'error',
        'key-spacing': 'error',
        'padded-blocks': ['error', 'never'],
      }
    },
    {
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['./tsconfig.json', './packages/*/tsconfig.json'] },
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-console': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/keyword-spacing': 'error',
        '@typescript-eslint/space-before-function-paren': 'error',
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],
        '@typescript-eslint/comma-spacing': 'warn',
        '@typescript-eslint/space-infix-ops': 'warn',
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/array-type': ['error', { default: 'array' }],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-implied-eval': 'warn',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
      }
    }
  ]
}
