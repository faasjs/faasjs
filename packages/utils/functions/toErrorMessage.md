[@faasjs/utils](../README.md) / toErrorMessage

# Function: toErrorMessage()

> **toErrorMessage**(`error`, `fallback?`): `string`

Convert a value to error message.

## Parameters

### error

`unknown`

### fallback?

`string` = `'Unknown error'`

## Returns

`string`

## Example

```ts
import { toErrorMessage } from '@faasjs/utils'

toErrorMessage(Error('message')) //=> 'message'
```
