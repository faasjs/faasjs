[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TFunc\>

> **InferFaasAction**\<`TFunc`\>: `object`

Infer the FaasAction type from a Func.

## Type Parameters

• **TFunc** *extends* `Func`

## Type declaration

### Data

> **Data**: `Awaited`\<`ReturnType`\<`ReturnType`\<`TFunc`\[`"export"`\]\>\[`"handler"`\]\>\>

### Params

> **Params**: `Parameters`\<`ReturnType`\<`TFunc`\[`"export"`\]\>\[`"handler"`\]\>\[`0`\]\[`"params"`\]

## Example

```typescript
import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'
import type { InferFaasAction } from '@faasjs/types'

export const func = useFunc<
  {
    params: { // define the params type
      number: number
    }
  },
  unknown, // context type, can be skipped
  number // define the return type
>(() => {
  useHttp()

  return ({ event}) => {
    return event.params.number + 1
  }
})

// declare the action type to FaasActions
declare module '@faasjs/types' {
  interface FaasActions {
    // if 'demo' is the action path
    'demo': InferFaasAction<typeof func>
  }
}
```
