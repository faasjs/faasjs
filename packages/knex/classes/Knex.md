# Class: Knex

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Knex.md#constructor)

### Properties

- [adapter](Knex.md#adapter)
- [config](Knex.md#config)
- [logger](Knex.md#logger)
- [name](Knex.md#name)
- [query](Knex.md#query)
- [type](Knex.md#type)

### Methods

- [onDeploy](Knex.md#ondeploy)
- [onInvoke](Knex.md#oninvoke)
- [onMount](Knex.md#onmount)
- [quit](Knex.md#quit)
- [raw](Knex.md#raw)
- [schema](Knex.md#schema)
- [transaction](Knex.md#transaction)

## Constructors

### constructor

• **new Knex**(`config?`): [`Knex`](Knex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`KnexConfig`](../#knexconfig) |

#### Returns

[`Knex`](Knex.md)

## Properties

### adapter

• **adapter**: `Knex`\<`any`, `any`[]\>

___

### config

• **config**: `Config`\<`any`\>

___

### logger

• **logger**: `Logger`

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

___

### query

• **query**: `Knex`\<`any`, `any`[]\>

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

## Methods

### onDeploy

▸ **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onDeploy

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData`\<`any`, `any`, `any`\> |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onInvoke

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onMount

___

### quit

▸ **quit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

___

### raw

▸ **raw**\<`TResult`\>(`sql`, `bindings?`): `Promise`\<`Raw`\<`TResult`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sql` | `string` | `undefined` |
| `bindings` | `ValueDict` \| `RawBinding`[] | `[]` |

#### Returns

`Promise`\<`Raw`\<`TResult`\>\>

___

### schema

▸ **schema**(): `SchemaBuilder`

#### Returns

`SchemaBuilder`

___

### transaction

▸ **transaction**\<`TResult`\>(`scope`, `config?`, `options?`): `Promise`\<`void` \| `TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | (`trx`: `Transaction`\<`any`, `any`\>) => `void` \| `Promise`\<`TResult`\> |
| `config?` | `TransactionConfig` |
| `options?` | `Object` |
| `options.trx?` | `Transaction`\<`any`, `any`[]\> |

#### Returns

`Promise`\<`void` \| `TResult`\>
