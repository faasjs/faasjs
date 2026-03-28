[@faasjs/react](../README.md) / UseFaasStreamOptions

# Type Alias: UseFaasStreamOptions

> **UseFaasStreamOptions** = `object`

Options that customize the [useFaasStream](../functions/useFaasStream.md) request lifecycle.

## Properties

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Override the default base URL for this hook instance.

### data?

> `optional` **data?**: `string`

Controlled stream text used instead of the hook's internal state.

### debounce?

> `optional` **debounce?**: `number`

Delay the latest automatic request by the given number of milliseconds.

### params?

> `optional` **params?**: `Record`\<`string`, `any`\>

Override the current request params without changing the hook's stored params state.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<`string`\>\>

Controlled setter that is called instead of the hook's internal `setData`.

### skip?

> `optional` **skip?**: `boolean` \| ((`params`) => `boolean`)

If skip is true, the request will not be sent.

However, you can still use reload to send the request.
