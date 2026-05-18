[@faasjs/react](../README.md) / FaasBrowserClientAction

# Type Alias: FaasBrowserClientAction

> **FaasBrowserClientAction** = \<`PathOrData`\>(`action`, `params?`, `options?`) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>

Type definition for the FaasBrowserClient.action method.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

## Parameters

### action

[`FaasAction`](FaasAction.md)\<`PathOrData`\>

### params?

[`FaasParams`](FaasParams.md)\<`PathOrData`\>

### options?

[`Options`](Options.md)

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\> \| [`Response`](../classes/Response.md)\>
