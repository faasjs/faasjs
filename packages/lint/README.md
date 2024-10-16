# @faasjs/lint

Lint tool for FaasJS, based on [Biome](https://biomejs.dev).

[![License: MIT](https://img.shields.io/npm/l/@faasjs/lint.svg)](https://github.com/faasjs/faasjs/blob/main/packages/lint/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/lint.svg)](https://www.npmjs.com/package/@faasjs/lint)

## Install

1. Install `@faasjs/lint`:
```bash
npm install @faasjs/lint
```
2. Create `biome.json` with content:
```json
{
  "extends": ["@faasjs/lint/biome"]
}
```
3. Add the following script to `package.json`:
```json
  "scripts": {
    "lint": "biome lint"
  }
```

## Tips for VSCode

1. Install [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).
2. Update your `.vscode/settings.json` with the following content:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "quickfix.biome": "explicit"
  },
  "editor.formatOnSave": true
}
```

## References

- [Biome CLI](https://biomejs.dev/reference/cli/).

## Troubleshooting

- If you encounter any issues, please refer to the [FaasJS documentation](https://faasjs.com) or open an issue on [GitHub](https://github.com/faasjs/faasjs/issues).
