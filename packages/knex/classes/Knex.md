[@faasjs/knex](../README.md) / Knex

# Class: Knex

## Implements

- `Plugin`

## Constructors

### new Knex(config)

> **new Knex**(`config`?): [`Knex`](Knex.md)

#### Parameters

• **config?**: [`KnexConfig`](../type-aliases/KnexConfig.md)

#### Returns

[`Knex`](Knex.md)

## Properties

### adapter

> **adapter**: `Knex`\<`any`, `any`[]\>

### config

> **config**: `Config`\<`any`\>

### logger

> **logger**: `Logger`

### name

> **`readonly`** **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### query

> **query**: `Knex`\<`any`, `any`[]\>

### type

> **`readonly`** **type**: `string` = `Name`

#### Implementation of

`Plugin.type`

## Methods

### onDeploy()

> **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `DeployData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onDeploy`

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `InvokeData`\<`any`, `any`, `any`\>

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

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

#### Type parameters

• **TResult** = `any`

#### Parameters

• **sql**: `string`

• **bindings**: `ValueDict` \| `RawBinding`[]= `[]`

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

#### Type parameters

• **TResult** = `any`

#### Parameters

• **scope**: (`trx`) => `Promise`\<`TResult`\>

• **config?**: `TransactionConfig`

• **options?**: `Object`

• **options\.trx?**: `Transaction`\<`any`, `any`[]\>

#### Returns

`Promise`\<`TResult`\>
