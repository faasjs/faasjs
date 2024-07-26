[@faasjs/react](../README.md) / useFaasOptions

# Type Alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\>: `object`

## Type Parameters

• **PathOrData** *extends* `FaasAction`

## Type declaration

### data?

> `optional` **data**: `FaasData`\<`PathOrData`\>

### debounce?

> `optional` **debounce**: `number`

send the last request after milliseconds

### params?

> `optional` **params**: `FaasParams`\<`PathOrData`\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`PathOrData`\>\>\>

### skip?

> `optional` **skip**: `boolean` \| (`params`) => `boolean`

if skip is true, will not send request
