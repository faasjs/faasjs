[@faasjs/core](../README.md) / ServerHandlerOptions

# Type Alias: ServerHandlerOptions

> **ServerHandlerOptions** = `object`

Extra options for a single [Server.handle](../classes/Server.md#handle) call.

## Properties

### filepath?

> `optional` **filepath?**: `string`

Force a specific API file path instead of route lookup.

### requestedAt?

> `optional` **requestedAt?**: `number`

Explicit request start timestamp used for response timing headers.
