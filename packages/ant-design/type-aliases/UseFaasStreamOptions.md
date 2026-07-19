[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / UseFaasStreamOptions

# Type Alias: UseFaasStreamOptions

> **UseFaasStreamOptions** = `object`

Options that customize the [useFaasStream](../functions/useFaasStream.md) request lifecycle.

Stream consumers can control params, skip logic, debounce timing, polling,
and base URL overrides the same way [useFaas](../functions/useFaas.md) does.

## Properties

### baseUrl?

> `optional` **baseUrl?**: `BaseUrl`

Base URL override used for this stream request lifecycle.

### data?

> `optional` **data?**: `string`

Controlled stream text used instead of internal hook state.

### debounce?

> `optional` **debounce?**: `number`

Milliseconds to wait before opening the latest stream request.

### params?

> `optional` **params?**: `Record`\<`string`, `any`>>>>\>

Controlled params override sent with the request without mutating local params state.

### polling?

> `optional` **polling?**: `number` \| `false`

Milliseconds to wait after each completed stream before refreshing in the background.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<`string`>>>>>>>>\>\>

Controlled setter paired with `data`.

### skip?

> `optional` **skip?**: `boolean` \| ((`params`) => `boolean`)

Boolean or predicate that suppresses the automatic stream request.
