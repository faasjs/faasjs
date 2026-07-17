# @faasjs/types

# @faasjs/types

Shared action and job type helpers for FaasJS backends, generated declarations,
React callers, and TypeScript config presets.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/types/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/types.svg)](https://www.npmjs.com/package/@faasjs/types)

## Install

Normally you don't need to install this package manually. It's a dependency of `@faasjs/core` and `@faasjs/react`.

## Usage

### TypeScript config presets

`@faasjs/types` also provides shared TypeScript presets under `tsconfig/`:

- `@faasjs/types/tsconfig/base.json`: strict base options for common TypeScript projects.
- `@faasjs/types/tsconfig/react.json`: base options with `jsx: "react-jsx"` for React projects.
- `@faasjs/types/tsconfig/build.json`: build-oriented options for Vite apps, packages, and workspace modules.

In your tsconfig.json:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json"
}
```

## Type Aliases

- [FaasActionPaths](type-aliases/FaasActionPaths.md)
- [FaasData](type-aliases/FaasData.md)
- [FaasJobParams](type-aliases/FaasJobParams.md)
- [FaasJobPaths](type-aliases/FaasJobPaths.md)
- [FaasParams](type-aliases/FaasParams.md)
- [InferFaasAction](type-aliases/InferFaasAction.md)
- [InferFaasJob](type-aliases/InferFaasJob.md)
