[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / UseFaasStreamResult

# Type Alias: UseFaasStreamResult\<Path\>

> **UseFaasStreamResult**\<`Path`> > > > > > \> = `object`

Result returned by [useFaasStream](../functions/useFaasStream.md).

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used for params inference.

## Properties

### action

> **action**: `Path`

Action path currently associated with the stream request.

### data

> **data**: `string`

Accumulated text decoded from the stream response.

### error

> **error**: `any`

Last error raised while opening or consuming the stream.

### loading

> **loading**: `boolean`

Whether the hook is currently waiting for stream data and should block the main UI.

### params

> **params**: `FaasParams`\<`Path`>>>>>>\>

Params used for the most recent request attempt.

### refreshing

> **refreshing**: `boolean`

Whether a background stream refresh is currently in flight.

### reload

> **reload**: (`params?`, `options?`) => `Promise`\<`string`>>>>>>\>

Trigger a new streaming request with optional params.

#### Parameters

##### params?

`FaasParams`\<`Path`\>

##### options?

###### silent?

`boolean`

#### Returns

`Promise`\<`string`\>

### reloadTimes

> **reloadTimes**: `number`

Number of times `reload()` or polling has triggered a new request.

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<`string`>>>>>>>>>>>>\>\>

Controlled or internal setter for the accumulated text.

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`>>>>>>>>>>>>\>\>

Setter for the last stream error.

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`>>>>>>>>>>>>\>\>

Setter for the loading flag.
