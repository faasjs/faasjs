module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json' },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    curly: [
      'error',
      'multi'
    ],
    'no-console': 'off',
    quotes: [
      'error',
      'single'
    ],
    'keyword-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': 'error',
    semi: [
      'error',
      'always'
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
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'object-property-newline': [
      'error'
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
    '@typescript-eslint/class-name-casing': [
      'warn',
      {
        allowUnderscorePrefix: true
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-implied-eval': 'warn',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrowParameter: false
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_'
      }
    ]
  }
};
