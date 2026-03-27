[@faasjs/core](../README.md) / useFunc

# Function: useFunc()

> **useFunc**\<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

Create a [Func](../classes/Func.md) from plugins registered through [usePlugin](usePlugin.md).

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Parameters

### handler

() => [`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

Factory that returns the final business handler.

## Returns

[`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

Function instance ready to export or test.

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
