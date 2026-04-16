[@faasjs/react](../README.md) / generateId

# Function: generateId()

> **generateId**(`prefix?`, `length?`): `string`

Generate a random identifier with an optional prefix.

## Parameters

### prefix?

`string` = `''`

Prefix prepended to the generated identifier.

### length?

`number` = `18`

Length of the generated identifier excluding `prefix`. Must be between `8` and `18`.

## Returns

`string`

Generated identifier string.

## Throws

When `length` is outside the supported `8` to `18` range.

## Example

```ts
import { generateId } from '@faasjs/react'

const id = generateId('prefix-')

id.startsWith('prefix-') // true
```
