module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
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
    'object-property-newline': [
      'error'
    ],
    '@typescript-eslint/indent': [
      'error',
      2
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array'
      }
    ],
    '@typescript-eslint/camelcase': [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
        ignoreImports: true
      }
    ],
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-implied-eval': 'warn',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrayDestructuring: true,
        objectDestructuring: true,
        variableDeclaration: true
      }
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
