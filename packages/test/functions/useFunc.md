[@faasjs/test](../README.md) / useFunc

# Function: useFunc()

> **useFunc**\<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

```ts
// pure function
export default useFunc(() => {
  return () => {
    return 'Hello World'
  }
})

// with http
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  const http = useHttp<{ name: string }>()

  return () => {
    return `Hello ${http.params.name}`
  }
})
```

## Type Parameters

• **TEvent** = `any`

• **TContext** = `any`

• **TResult** = `any`

## Parameters

• **handler**

## Returns

[`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>
