[@faasjs/dev](../README.md) / FuncEventType

# Type Alias: FuncEventType\<T\>

> **FuncEventType**\<`T`\> = `T` *extends* [`Func`](../classes/Func.md)\<infer P, `any`, `any`\> ? `P` : `any`

Get the event type of a func.

## Type Parameters

### T

`T` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

## Example

```ts
import { defineApi } from '@faasjs/core'
import type { FuncEventType } from '@faasjs/core'

const func = defineApi<undefined, { counter: number }>({
  async handler() {
    return null
  },
})

FuncEventType<typeof func> // => { counter: number }
```
