[@faasjs/react](../README.md) / FaasDataInjection

# Type Alias: FaasDataInjection\<PathOrData\>

> **FaasDataInjection**\<`PathOrData`\> = `object`

Request state injected by [useFaas](../functions/useFaas.md), [FaasDataWrapper](../variables/FaasDataWrapper.md), and [withFaasData](../functions/withFaasData.md).

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md) = `any`

Action path or response data type used for inference.

## Methods

### reload()

> **reload**(`params?`, `options?`): `Promise`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>

Reloads data with new or existing parameters.

When the source hook is currently skipped, calling `reload` clears the skip
flag before starting the next request.

#### Parameters

##### params?

`Record`\<`string`, `any`\>

##### options?

###### silent?

`boolean`

#### Returns

`Promise`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>

## Properties

### action

> **action**: [`FaasAction`](FaasAction.md)\<`PathOrData`\>

Action path associated with the current request state.

### data

> **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

Current resolved data value.

### error

> **error**: `any`

Last request error, if one occurred.

### loading

> **loading**: `boolean`

Whether the request is currently in flight and should block the main UI.

### params

> **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

Params used for the most recent request attempt.

### promise

> **promise**: `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Promise representing the latest request.

### refreshing

> **refreshing**: `boolean`

Whether a background refresh request is currently in flight.

### reloadTimes

> **reloadTimes**: `number`

Number of times `reload()` or polling has triggered a new request.

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Controlled or internal setter for the resolved data value.

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`\>\>

Setter for the last request error.

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`\>\>

Setter for the loading flag.

### setPromise

> **setPromise**: `React.Dispatch`\<`React.SetStateAction`\<`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>\>\>

Setter for the latest request promise.
