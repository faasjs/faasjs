[@faasjs/node-utils](../README.md) / LoadPackageOptions

# Type Alias: LoadPackageOptions

> **LoadPackageOptions** = `object`

## Properties

### root?

> `optional` **root**: `string`

Project root used to scope tsconfig paths resolving.

### tsconfigPath?

> `optional` **tsconfigPath**: `string`

Explicit tsconfig path, defaults to `<root>/tsconfig.json`.

### version?

> `optional` **version**: `string`

Optional version token used to bust ESM module cache.
