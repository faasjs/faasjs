[@faasjs/logger](../README.md) / startTransport

# Function: startTransport()

> **startTransport**(`options`?): `void`

Starts the logging transport with the specified options.

This function sets a timeout to periodically flush cached messages.
If there are any cached messages, it will flush them and then restart the process.

## Parameters

### options?

[`TransportOptions`](../type-aliases/TransportOptions.md) = `{}`

The options to configure the logging transport.

## Returns

`void`

## Example

```typescript
import { startTransport } from '@faasjs/logger'

start()
```
