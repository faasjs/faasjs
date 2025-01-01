[@faasjs/logger](../README.md) / resetTransport

# Function: resetTransport()

> **resetTransport**(): `void`

Resets the logging system to its default state.

This function performs the following actions:
- Enables logging by setting the `enabled` flag to `true`.
- Clears all transports by calling `Transports.clear()`.
- Empties the cached messages by splicing the `CachedMessages` array.

## Returns

`void`
