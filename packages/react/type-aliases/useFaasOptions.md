[@faasjs/react](../README.md) / useFaasOptions

# Type Alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\> = `object`

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

## Properties

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

### data?

> `optional` **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

### debounce?

> `optional` **debounce**: `number`

Send the last request after milliseconds

### params?

> `optional` **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### skip?

> `optional` **skip**: `boolean` \| (`params`) => `boolean`

If skip is true, the request will not be sent.

However, you can still use reload to send the request.
