[@faasjs/pg](../README.md) / TransactionOptions

# Type Alias: TransactionOptions

> **TransactionOptions** = `object`

Options for [Client.transaction](../classes/Client.md#transaction).

## Properties

### isolation?

> `optional` **isolation?**: [`TransactionIsolationLevel`](TransactionIsolationLevel.md)

Isolation level for the transaction.

### readOnly?

> `optional` **readOnly?**: `boolean`

Whether the transaction is explicitly read-only or read-write.
