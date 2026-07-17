[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / RegisterNodeModuleHooksOptions

# Type Alias: RegisterNodeModuleHooksOptions

> **RegisterNodeModuleHooksOptions** = `object`

Options for preloading Node module hooks that resolve tsconfig paths and local TypeScript files.

These options are used by [registerNodeModuleHooks](../functions/registerNodeModuleHooks.md). `loadPackage()` can
infer equivalent state for local files before it imports them.

## Properties

### entry?

> `optional` **entry?**: `string`

Application entry file used to infer the project root and tsconfig path.

#### Default

```ts
process.argv[1]
```

### root?

> `optional` **root?**: `string`

Project root used to scope tsconfig path alias resolution.

When omitted, the root is inferred from `entry`, `tsconfigPath`, or the
nearest project marker around a loaded local file.

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

When omitted, `FAASJS_MODULE_VERSION` is used if present.
