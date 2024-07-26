[@faasjs/func](../README.md) / FuncEventType

# Type Alias: FuncEventType\<T\>

> **FuncEventType**\<`T`\>: `T` *extends* [`Func`](../classes/Func.md)\<infer P, `any`, `any`\> ? `P` : `any`

Get the event type of a func

## Type Parameters

• **T** *extends* [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

## Example

```ts
import { useFunc, type FuncEventType } from '@faasjs/func'

const func = useFunc<{ counter: number }>(() => async () => {})

FuncEventType<typeof func> // => { counter: number }
```
