[@faasjs/pg](../README.md) / ForUpdateOptions

# Type Alias: ForUpdateOptions

> **ForUpdateOptions** = `object`

Options for a `SELECT ... FOR UPDATE` locking clause.

## Properties

### noWait?

> `optional` **noWait?**: `boolean`

Fail immediately instead of waiting for a conflicting row lock.

### of?

> `optional` **of?**: `string` \| readonly `string`[]

Tables or aliases whose selected rows should be locked.

### skipLocked?

> `optional` **skipLocked?**: `boolean`

Skip rows that cannot be locked immediately.
