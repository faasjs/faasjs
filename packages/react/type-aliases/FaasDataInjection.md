[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / FaasDataInjection

# Type Alias: FaasDataInjection\<Path\>

> **FaasDataInjection**\<`Path`> > > > \> = `object`

Request state injected by [useFaas](../functions/useFaas.md), [FaasDataWrapper](../variables/FaasDataWrapper.md), and [withFaasData](../functions/withFaasData.md).

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

## Methods

### reload()

> **reload**(`this`, `params?`, `options?`): `Promise`\<`FaasData`\<`Path`>>>>>>>>\>\>

Reloads data with new or existing parameters.

When the source hook is currently skipped, calling `reload` clears the skip
flag before starting the next request.

#### Parameters

##### this

`void`

##### params?

`FaasParams`\<`Path`\>

##### options?

###### silent?

`boolean`

#### Returns

`Promise`\<`FaasData`\<`Path`\>\>

## Properties

### action

> **action**: `Path`

Action path associated with the current request state.

### data

> **data**: `FaasData`\<`Path`>>>>\>

Current resolved data value.

### error

> **error**: `any`

Last request error, if one occurred.

### loading

> **loading**: `boolean`

Whether the request is currently in flight and should block the main UI.

### params

> **params**: `FaasParams`\<`Path`>>>>\>

Params used for the most recent request attempt.

### promise

> **promise**: `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`>>>>>>>>>>>>\>\>\>

Promise representing the latest request.

### refreshing

> **refreshing**: `boolean`

Whether a background refresh request is currently in flight.

### reloadTimes

> **reloadTimes**: `number`

Number of times `reload()` or polling has triggered a new request.

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`Path`>>>>>>>>>>>>\>\>\>

Controlled or internal setter for the resolved data value.

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`>>>>>>>>\>\>

Setter for the last request error.

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`>>>>>>>>\>\>

Setter for the loading flag.

### setPromise

> **setPromise**: `React.Dispatch`\<`React.SetStateAction`\<`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`>>>>>>>>>>>>>>>>>>>>\>\>\>\>\>

Setter for the latest request promise.
