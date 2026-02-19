[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TFunc\>

> **InferFaasAction**\<`TFunc`\> = `object`

Infer the FaasAction type from a Func.

## Example

```typescript
import { defineApi, z } from '@faasjs/core'
import type { InferFaasAction } from '@faasjs/types'

const schema = z
  .object({
    number: z.number(),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ params }) {
    if (!params) throw Error('params is required')

    return params.number + 1
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

## Type Parameters

### TFunc

`TFunc` *extends* `Func`

## Properties

### Data

> **Data**: `Awaited`\<`ReturnType`\<`ReturnType`\<`TFunc`\[`"export"`\]\>\[`"handler"`\]\>\>

### Params

> **Params**: `NonNullable`\<`Parameters`\<`ReturnType`\<`TFunc`\[`"export"`\]\>\[`"handler"`\]\>\[`0`\]\>\[`"params"`\]
