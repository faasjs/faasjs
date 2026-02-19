[@faasjs/func](../README.md) / FuncReturnType

# Type Alias: FuncReturnType\<T\>

> **FuncReturnType**\<`T`\> = `T` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, infer R\> ? `R` : `any`

Get the return type of a func

## Type Parameters

### T

`T` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

## Example

```ts
import { defineApi } from '@faasjs/core'
import type { FuncReturnType } from '@faasjs/func'

const func = defineApi<undefined, any, any, number>({
  async handler() {
    return 1
  },
})

FuncReturnType<typeof func> // => number
```
