[@faasjs/react](../README.md) / useFaasOptions

# Type Alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\> = `object`

Options for [useFaas](../functions/useFaas.md).

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

Action path or response data type used for inference.

## Properties

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Override the default base URL for this hook instance.

### data?

> `optional` **data?**: [`FaasData`](FaasData.md)\<`PathOrData`\>

Controlled data value used instead of the hook's internal state.

### debounce?

> `optional` **debounce?**: `number`

Send the last request after milliseconds

### params?

> `optional` **params?**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

Override the request params without changing the hook's stored params state.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Controlled setter that is called instead of the hook's internal `setData`.

### skip?

> `optional` **skip?**: `boolean` \| ((`params`) => `boolean`)

If skip is true, the request will not be sent.

However, you can still use reload to send the request.
