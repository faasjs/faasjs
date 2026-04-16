[@faasjs/react](../README.md) / FaasBrowserClientAction

# Type Alias: FaasBrowserClientAction

> **FaasBrowserClientAction** = \<`PathOrData`\>(`action`, `params?`, `options?`) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>

Type definition for the FaasBrowserClient.action method.

Defines the signature of the method used to make requests to FaasJS functions.
Provides type-safe parameter and return value handling.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

The function path or data type for type safety

## Parameters

### action

[`FaasAction`](FaasAction.md)\<`PathOrData`\>

The function path to call.

### params?

[`FaasParams`](FaasParams.md)\<`PathOrData`\>

Optional parameters for the function.

### options?

[`Options`](Options.md)

Optional request overrides.
See [Options](Options.md) for supported request fields such as `headers`, `beforeRequest`,
`request`, `baseUrl`, and `stream`.

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>

Promise resolving to the request response. In streaming mode the runtime returns the native fetch response.

Notes:

- Used internally by FaasBrowserClient.action method
- Provides type-safe action method signature
- Return type includes both typed and untyped Response variants
- Params are optional and can be undefined
- Options override client defaults when provided

## See

- [FaasBrowserClient](../classes/FaasBrowserClient.md) for the class that uses this type.
- [Response](../classes/Response.md) for the return type.
- [Options](Options.md) for the options parameter type.
