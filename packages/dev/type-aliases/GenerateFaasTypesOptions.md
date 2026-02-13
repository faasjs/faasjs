[@faasjs/dev](../README.md) / GenerateFaasTypesOptions

# Type Alias: GenerateFaasTypesOptions

> **GenerateFaasTypesOptions** = `object`

## Properties

### logger?

> `optional` **logger**: `Logger`

optional logger instance

### output?

> `optional` **output**: `string`

output declaration file path, default is <src>/.faasjs/types.d.ts

### root?

> `optional` **root**: `string`

faas project root path, default is process.cwd()

### src?

> `optional` **src**: `string`

faas source directory, default is <root>/src

### staging?

> `optional` **staging**: `string`

staging for faas.yaml config resolution, default is development
