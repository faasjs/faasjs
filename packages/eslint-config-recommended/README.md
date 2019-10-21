# @faasjs/eslint-config-recommended

FaasJS 的 ESLint 默认规则。

[![License: MIT](https://img.shields.io/npm/l/@faasjs/eslint-config-recommended.svg)](https://github.com/faasjs/faasjs/blob/master/packages/faasjs/eslint-config-recommended/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/eslint-config-recommended/stable.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-recommended)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/eslint-config-recommended/beta.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-recommended)

## Installation

    yarn add -D @faasjs/eslint-config-recommended

## Usage

1. Put eslintConfig to package.json

```json
"eslintConfig": {
  "extends": [
    "@faasjs/recommended"
  ]
}
```

2. Running ESLint from command line

```bash
eslint --ext .ts --fix src
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
    }
  ]
}
```
