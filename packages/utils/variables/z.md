[**@faasjs/utils**](../README.md)

[@faasjs/utils](../README.md) / z

# Variable: z

> `const` **z**: [`Z`](../type-aliases/Z.md)

Extended Zod instance with custom helpers.

Currently includes:

- `positiveint()`: returns `z.int().gt(0)`.
- `nonemptystring()`: returns `z.string().min(1)`.

## Example

```ts
import { z } from '@faasjs/utils'

const schema = z.positiveint().min(1).max(100)

console.log(schema.parse(50)) // 50
console.log(schema.parse(-1)) // throws ZodError
console.log(schema.parse(101)) // throws ZodError
```
