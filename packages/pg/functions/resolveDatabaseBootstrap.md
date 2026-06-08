[@faasjs/pg](../README.md) / resolveDatabaseBootstrap

# Function: resolveDatabaseBootstrap()

> **resolveDatabaseBootstrap**(): `Promise`\<`void`\>

Resolves the registered async database bootstrap.

Ensures the bootstrap only runs once concurrently — if it is already running
the pending promise is returned instead of starting a second invocation.
Failed bootstraps clear the active promise so a later call can retry.

## Returns

`Promise`\<`void`\>

A promise that resolves when the bootstrap has completed.
