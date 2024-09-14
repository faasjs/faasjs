[@faasjs/react](../README.md) / useFaasOptions

# Type Alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\>: `object`

## Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

## Type declaration

### data?

> `optional` **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

### debounce?

> `optional` **debounce**: `number`

send the last request after milliseconds

### domain?

> `optional` **domain**: `string`

### params?

> `optional` **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### skip?

> `optional` **skip**: `boolean` \| (`params`) => `boolean`

if skip is true, will not send request
