[@faasjs/node-utils](../README.md) / RegisterNodeModuleHooksOptions

# Type Alias: RegisterNodeModuleHooksOptions

> **RegisterNodeModuleHooksOptions** = `object`

Options for preloading Node module hooks that resolve tsconfig paths and local TypeScript files.

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
