[@faasjs/types](../README.md) / InferFaasFunc

# Type Alias: InferFaasFunc\<TModule\>

> **InferFaasFunc**\<`TModule`\> = `TModule` _extends_ `object` ? `TFunc` _extends_ `FaasFuncLike` ? `TFunc` : `never` : `TModule` _extends_ `object` ? `TFunc` _extends_ `FaasFuncLike` ? `TFunc` : `never` : `never`

Infer the Func type from a module.

Supports both `export const func = defineApi(...)` and `export default defineApi(...)`.

## Type Parameters

### TModule

`TModule`

Module shape that may expose a FaasJS function.
