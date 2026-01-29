[@faasjs/browser](../README.md) / FaasBrowserClientAction

# Type Alias: FaasBrowserClientAction()

> **FaasBrowserClientAction** = \<`PathOrData`\>(`action`, `params?`, `options?`) => `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>

Type definition for the FaasBrowserClient.action method.

Defines the signature of the method used to make requests to FaasJS functions.
Provides type-safe parameter and return value handling.

## Type Parameters

### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

The function path or data type for type safety

## Parameters

### action

`FaasAction`\<`PathOrData`\>

The function path to call

### params?

`FaasParams`\<`PathOrData`\>

Optional parameters for the function

### options?

[`Options`](Options.md)

Optional request options

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>

- A Promise resolving to a Response object

## Remarks

- Used internally by FaasBrowserClient.action method
- Provides type-safe action method signature
- Return type includes both typed and untyped Response variants
- Params are optional and can be undefined
- Options override client defaults when provided

## See

 - FaasBrowserClient for the class that uses this type
 - Response for the return type
 - Options for the options parameter type
