[@faasjs/test](../README.md) / FuncReturnType

# Type alias: FuncReturnType\<T\>

> **FuncReturnType**\<`T`\>: `T` extends [`Func`](../classes/Func.md)\<`any`, `any`, infer R\> ? `R` : `any`

Get the return type of a func

## Example

```ts
import { useFunc, type FuncReturnType } from '@faasjs/func'

const func = useFunc(() => async () => 1)

FuncReturnType<typeof func> // => number
```

## Type parameters

• **T** extends [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>
