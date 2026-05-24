[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TApi\>

> **InferFaasAction**\<`TApi`\> = `TApi` _extends_ `object` ? `object` : `TApi` _extends_ `object` ? `TDefault` _extends_ `object` ? `object` : `never` : `never`

Infer `{ Params, Data }` from a Func, a Func-like object, or a
module whose default export is a Func.

## Type Parameters

### TApi

`TApi`

A Func, Func-like object, or module shape.
