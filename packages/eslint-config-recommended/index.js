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
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
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
