[@faasjs/utils](../README.md) / z

# Variable: z

> `const` **z**: [`Z`](../type-aliases/Z.md)

Extended Zod instance with custom helpers.

Currently includes:

- `positiveint()`: A helper that returns a Zod schema for positive integers.
- `nonemptystring()`: A helper that returns a Zod schema for non-empty strings.

## Example

```ts
import { z } from '@faasjs/utils'

const schema = z.positiveint().min(1).max(100)

console.log(schema.parse(50)) // 50
console.log(schema.parse(-1)) // throws ZodError
console.log(schema.parse(101)) // throws ZodError
```
