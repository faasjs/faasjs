[@faasjs/utils](../README.md) / toErrorMessage

# Function: toErrorMessage()

> **toErrorMessage**(`error`, `fallback?`): `string`

Convert a value to an error message string.

Extracts a message from `Error` instances and error-like objects, or
returns the `fallback` when the value cannot be coerced to a useful message.

## Parameters

### error

`unknown`

Value to convert (Error, string, or object with `message`).

### fallback?

`string` = `'Unknown error'`

Text returned when no message can be extracted.

## Returns

`string`

Extracted or fallback error message.

## Example

```ts
import { toErrorMessage } from '@faasjs/utils'

toErrorMessage(Error('something wrong')) // 'something wrong'
toErrorMessage('  ') // 'Unknown error'
toErrorMessage(null) // 'Unknown error'
```
