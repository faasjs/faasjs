[@faasjs/react](../README.md) / UseFaasStreamResult

# Type Alias: UseFaasStreamResult

> **UseFaasStreamResult** = `object`

Result returned by [useFaasStream](../functions/useFaasStream.md).

## Properties

### action

> **action**: `string`

Action path currently associated with the stream request.

### data

> **data**: `string`

Accumulated text decoded from the stream response.

### error

> **error**: `any`

Last error raised while opening or consuming the stream.

### loading

> **loading**: `boolean`

Whether the hook is currently waiting for stream data.

### params

> **params**: `Record`\<`string`, `any`\>

Params used for the most recent request attempt.

### reload

> **reload**: (`params?`) => `Promise`\<`string`\>

Trigger a new streaming request with optional params.

#### Parameters

##### params?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`string`\>

### reloadTimes

> **reloadTimes**: `number`

Number of times `reload()` has triggered a new request.

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<`string`\>\>

Controlled or internal setter for the accumulated text.

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`\>\>

Setter for the last stream error.

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`\>\>

Setter for the loading flag.
