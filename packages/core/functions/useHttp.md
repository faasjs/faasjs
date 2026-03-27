[@faasjs/core](../README.md) / useHttp

# Function: useHttp()

> **useHttp**\<`TParams`, `TCookie`, `TSession`\>(`config?`): [`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<[`Http`](../classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>

Attach the HTTP plugin to a function.

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

Optional HTTP plugin configuration.

## Returns

[`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<[`Http`](../classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>

HTTP plugin instance wrapped for `usePlugin`.

## Example

```ts
import { useFunc, useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  useHttp()

  return async ({ body }) => ({
    received: body,
  })
})
```
