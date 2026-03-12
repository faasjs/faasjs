[@faasjs/core](../README.md) / useHttp

# Function: useHttp()

> **useHttp**\<`TParams`, `TCookie`, `TSession`\>(`config?`): [`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<[`Http`](../classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>

## Type Parameters

### TParams

`TParams` _extends_ `Record`\<`string`, `any`\> = `any`

### TCookie

`TCookie` _extends_ `Record`\<`string`, `string`\> = `any`

### TSession

`TSession` _extends_ `Record`\<`string`, `string`\> = `any`

## Parameters

### config?

[`HttpConfig`](../type-aliases/HttpConfig.md)

## Returns

[`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<[`Http`](../classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>
