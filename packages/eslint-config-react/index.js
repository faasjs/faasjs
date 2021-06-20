module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    '@faasjs/recommended',
    'plugin:react/recommended'
  ],
  plugins: [
    'react'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-restricted-globals': 'off',
    'react/display-name': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-curly-newline': 'error',
    'react/jsx-curly-spacing': [
      2,
      'always'
    ],
    'react/jsx-indent': [
      2,
      2
    ],
    'react/jsx-indent-props': [
      2,
      2
    ],
    'react/jsx-first-prop-new-line': 'error',
    'react/jsx-max-props-per-line': [
      2
    ]
  }
};
