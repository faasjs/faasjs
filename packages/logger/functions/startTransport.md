[@faasjs/logger](../README.md) / startTransport

# Function: startTransport()

> **startTransport**(`options`?): `void`

Starts the logging transport with the specified options.

This function sets a timeout to periodically flush cached messages.
If there are any cached messages, it will flush them and then restart the process.

## Parameters

### options?

[`StartOptions`](../type-aliases/StartOptions.md) = `{}`

The options to configure the logging transport.

## Returns

`void`

## Example

```typescript
import { start } from '@faasjs/logger/transport'

start()
```
