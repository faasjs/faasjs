[@faasjs/node-utils](../README.md) / LoadPackageOptions

# Type Alias: LoadPackageOptions

> **LoadPackageOptions** = `object`

Options for loading modules with tsconfig path aliases and runtime-aware cache control.

## Properties

### root?

> `optional` **root?**: `string`

Project root used to scope tsconfig path alias resolution.

### tsconfigPath?

> `optional` **tsconfigPath?**: `string`

Explicit tsconfig file path used to load path alias rules.

#### Default

```ts
'<root>/tsconfig.json'
```

### version?

> `optional` **version?**: `string`

Version token appended to ESM file URLs to bypass Node's module cache.
