[@faasjs/react](../README.md) / UseFaasStreamOptions

# Type Alias: UseFaasStreamOptions

> **UseFaasStreamOptions** = `object`

## Properties

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

### data?

> `optional` **data**: `string`

### debounce?

> `optional` **debounce**: `number`

Send the last request after milliseconds

### params?

> `optional` **params**: `Record`\<`string`, `any`\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<`string`\>\>

### skip?

> `optional` **skip**: `boolean` \| (`params`) => `boolean`

If skip is true, the request will not be sent.

However, you can still use reload to send the request.
