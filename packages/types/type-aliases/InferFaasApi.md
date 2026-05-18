[@faasjs/types](../README.md) / InferFaasApi

# Type Alias: InferFaasApi\<TModule\>

> **InferFaasApi**\<`TModule`\> = `TModule` *extends* `object` ? `TApi` *extends* `object` ? `TApi` : `never` : `never`

Infer the API type from a module.

## Type Parameters

### TModule

`TModule`

Module shape that may expose a FaasJS API.
