# @faasjs/eslint-config-vue

FaasJS 对于使用 Vue 项目的 ESLint 默认规则。

[![License: MIT](https://img.shields.io/npm/l/@faasjs/eslint-config-vue.svg)](https://github.com/faasjs/faasjs/blob/master/packages/faasjs/eslint-config-vue/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/eslint-config-vue/stable.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-vue)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/eslint-config-vue/beta.svg)](https://www.npmjs.com/package/@faasjs/eslint-config-vue)

## Installation

    yarn add -D @faasjs/eslint-config-vue

## Usage

1. Put eslintConfig to package.json
```json
"eslintConfig": {
  "extends": [
    "@faasjs/vue"
  ]
}
```
2. Running ESLint from command line
```bash
eslint --ext .ts,.vue --fix src
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
      "language": "vue",
      "autoFix": true
    }
  ]
}
```
