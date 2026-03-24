[@faasjs/node-utils](../README.md) / RegisterNodeModuleHooksOptions

# Type Alias: RegisterNodeModuleHooksOptions

> **RegisterNodeModuleHooksOptions** = [`LoadPackageOptions`](LoadPackageOptions.md) & `object`

## Type Declaration

### entry?

> `optional` **entry?**: `string`

Optional entry file used to infer project root and tsconfig.

Defaults to `process.argv[1]` when omitted.
