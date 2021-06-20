module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue']
  },
  extends: [
    '@faasjs/recommended',
    'plugin:vue/essential'
  ]
}
