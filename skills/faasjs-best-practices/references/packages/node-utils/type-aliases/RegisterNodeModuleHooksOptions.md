[@faasjs/node-utils](../README.md) / RegisterNodeModuleHooksOptions

# Type Alias: RegisterNodeModuleHooksOptions

> **RegisterNodeModuleHooksOptions** = [`LoadPackageOptions`](LoadPackageOptions.md) & `object`

Options for preloading Node module hooks that resolve tsconfig paths and local TypeScript files.

## Type Declaration

### entry?

> `optional` **entry?**: `string`

Application entry file used to infer the project root and tsconfig path.

#### Default

```ts
process.argv[1]
```
