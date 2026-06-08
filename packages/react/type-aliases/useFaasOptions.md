[@faasjs/react](../README.md) / UseFaasOptions

# Type Alias: UseFaasOptions\<Path\>

> **UseFaasOptions**\<`Path`\> = `object`

Options that customize the [useFaas](../functions/useFaas.md) request lifecycle.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

## Properties

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Base URL override used for this request lifecycle.

### data?

> `optional` **data?**: `FaasData`\<`Path`\>

Controlled data value used instead of internal hook state.

### debounce?

> `optional` **debounce?**: `number`

Milliseconds to wait before sending the latest request.

### params?

> `optional` **params?**: `FaasParams`\<`Path`\>

Controlled params override sent with the request without mutating local params state.

### polling?

> `optional` **polling?**: `number` \| `false`

Milliseconds to wait after each completed request before refreshing data in the background.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`Path`\>\>\>

Controlled setter paired with `data`.

### skip?

> `optional` **skip?**: `boolean` \| ((`params`) => `boolean`)

Boolean or predicate that suppresses the automatic request.
