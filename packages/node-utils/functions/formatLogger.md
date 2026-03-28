[@faasjs/node-utils](../README.md) / formatLogger

# Function: formatLogger()

> **formatLogger**(`fmt`, ...`args`): `string`

Format logger arguments into a printable string.

Values marked with `__hidden__: true` are skipped so callers can attach transport-only metadata.
When formatting fails, the formatter returns a fallback error message instead of throwing.

## Parameters

### fmt

`any`

Format string or first value to log.

### args

...`any`[]

Additional values passed to the formatter.

## Returns

`string`

Formatted log message.

## Example

```ts
import { formatLogger } from '@faasjs/node-utils'

formatLogger('Hello %s', 'FaasJS') // 'Hello FaasJS'
```
