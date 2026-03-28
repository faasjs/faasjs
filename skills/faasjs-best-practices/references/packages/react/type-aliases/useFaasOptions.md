[@faasjs/react](../README.md) / useFaasOptions

# Type Alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\> = `object`

Options that customize the [useFaas](../functions/useFaas.md) request lifecycle.

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

Delay the latest automatic request by the given number of milliseconds.

### params?

> `optional` **params?**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

Override the current request params without changing the hook's stored params state.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Controlled setter that is called instead of the hook's internal `setData`.

### skip?

> `optional` **skip?**: `boolean` \| ((`params`) => `boolean`)

If skip is true, the request will not be sent.

However, you can still use reload to send the request.
