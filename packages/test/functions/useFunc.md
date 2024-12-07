[@faasjs/test](../README.md) / useFunc

# Function: useFunc()

> **useFunc**\<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function.

## Type Parameters

• **TEvent** = `any`

• **TContext** = `any`

• **TResult** = `any`

## Parameters

### handler

() => [`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

## Returns

[`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

## Example

```ts
// pure function
export default useFunc(() => {
  return () => {
    return 'Hello World'
  }
})

// with http
import { useHttp } from '@faasjs/http'

export default useFunc<{
  params: { name: string }
}>(() => {
  useHttp()

  return ({ event }) => {
    return `Hello ${event.params.name}`
  }
})
```
