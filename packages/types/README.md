# @faasjs/types

Action Type definitions for FaasJS and cross backend and frontend.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/types/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/types.svg)](https://www.npmjs.com/package/@faasjs/types)

## Install

Normally you don't need to install this package manually. It's a dependency of `@faasjs/core` and `@faasjs/react`.

## Usage

### TypeScript config presets

`@faasjs/types` also provides shared TypeScript presets under `tsconfig/`:

- `@faasjs/types/tsconfig/base`: strict base options for common TypeScript projects.
- `@faasjs/types/tsconfig/react`: base options with `jsx: "react-jsx"` for React projects.
- `@faasjs/types/tsconfig/build`: build-oriented options for package development.

In your tsconfig.json:

```json
{
  "extends": "@faasjs/types/tsconfig/build"
}
```

## Type Aliases

- [FaasAction](type-aliases/FaasAction.md)
- [FaasActionPaths](type-aliases/FaasActionPaths.md)
- [FaasActionUnionType](type-aliases/FaasActionUnionType.md)
- [FaasData](type-aliases/FaasData.md)
- [FaasEvent](type-aliases/FaasEvent.md)
- [FaasEventPaths](type-aliases/FaasEventPaths.md)
- [FaasParams](type-aliases/FaasParams.md)
- [InferFaasAction](type-aliases/InferFaasAction.md)
- [InferFaasFunc](type-aliases/InferFaasFunc.md)
