[@faasjs/react](../README.md) / FaasBrowserClientAction

# Type Alias: FaasBrowserClientAction

> **FaasBrowserClientAction** = \<`Path`\>(`action`, `params?`, `options?`) => `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`\>\> \| [`Response`](../classes/Response.md)\>

Type signature for the [FaasBrowserClient.action](../classes/FaasBrowserClient.md#action) method.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Action path used to infer the request params and response data types.

## Parameters

### action

`Path`

Action path to invoke.

### params?

`FaasParams`\<`Path`\>

Params sent to the action.

### options?

[`Options`](Options.md)

Per-request overrides on top of client defaults.

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`\>\> \| [`Response`](../classes/Response.md)\>

FaasJS response or native fetch response when streaming.
