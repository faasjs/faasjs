[@faasjs/types](../README.md) / InferFaasApi

# Type Alias: InferFaasApi\<TModule\>

> **InferFaasApi**\<`TModule`\> = `TModule` _extends_ `object` ? `TFunc` _extends_ `FaasFuncLike` ? `TFunc` : `never` : `TModule` _extends_ `object` ? `TFunc` _extends_ `FaasFuncLike` ? `TFunc` : `never` : `never`

Infer the API type from a module.

Supports `export default defineApi(...)` first and falls back to the legacy
`func` export shape during migration.

## Type Parameters

### TModule

`TModule`

Module shape that may expose a FaasJS API.
