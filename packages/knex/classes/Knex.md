[@faasjs/knex](../README.md) / Knex

# Class: Knex

## Implements

- `Plugin`

## Constructors

### new Knex()

> **new Knex**(`config`?): [`Knex`](Knex.md)

#### Parameters

##### config?

[`KnexConfig`](../type-aliases/KnexConfig.md)

#### Returns

[`Knex`](Knex.md)

## Methods

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

##### data

`InvokeData`\<`any`, `any`, `any`\>

##### next

`Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

##### data

`MountData`

##### next

`Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

### quit()

> **quit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### raw()

> **raw**\<`TResult`\>(`sql`, `bindings`): `Promise`\<`Raw`\<`TResult`\>\>

#### Type Parameters

• **TResult** = `any`

#### Parameters

##### sql

`string`

##### bindings

`ValueDict` | `RawBinding`[]

#### Returns

`Promise`\<`Raw`\<`TResult`\>\>

### schema()

> **schema**(): `SchemaBuilder`

#### Returns

`SchemaBuilder`

### transaction()

> **transaction**\<`TResult`\>(`scope`, `config`?, `options`?): `Promise`\<`TResult`\>

Wraps a transaction, returning a promise that resolves to the return value of the callback.

- Support 'commit' and 'rollback' event.

#### Type Parameters

• **TResult** = `any`

#### Parameters

##### scope

(`trx`) => `Promise`\<`TResult`\>

##### config?

`TransactionConfig`

##### options?

###### trx?

`Transaction`

#### Returns

`Promise`\<`TResult`\>

## Properties

### adapter

> **adapter**: `Knex`

### config

> **config**: `Config`

### logger

> **logger**: `Logger`

### name

> `readonly` **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### query

> **query**: `Knex`

### type

> `readonly` **type**: `"knex"` = `'knex'`

#### Implementation of

`Plugin.type`
