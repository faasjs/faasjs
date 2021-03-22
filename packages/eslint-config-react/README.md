# @faasjs/eslint-config-react

FaasJS 对于使用 React 项目的 ESLint 默认规则。

[![License: MIT](https://img.shields.io/npm/l/@faasjs/eslint-config-react.svg)](https://github.com/faasjs/faasjs/blob/master/packages/faasjs/eslint-config-react/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/eslint-config-react/stable.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-react)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/eslint-config-react/beta.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-react)

## Installation

    yarn add -D @faasjs/eslint-config-react

## Usage

1. Put eslintConfig to package.json

```json
"eslintConfig": {
  "extends": [
    "@faasjs/react"
  ]
}
```

2. Running ESLint from command line

```bash
eslint --ext .ts,.tsx --fix src
```

## VSCode integration

Example `.vscode/settings.json`:

```json
{
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "react",
      "autoFix": true
    }
  ]
}
```
