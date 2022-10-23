# Class: Knex

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Knex.md#constructor)

### Properties

- [adapter](Knex.md#adapter)
- [config](Knex.md#config)
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

• **new Knex**(`config?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`KnexConfig`](../#knexconfig) |

## Properties

### adapter

• **adapter**: `Knex`<`any`, `any`[]\>

___

### config

• **config**: `Config`<`any`\>

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

___

### query

• **query**: `Knex`<`any`, `any`[]\>

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

## Methods

### onDeploy

▸ **onDeploy**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onDeploy

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData`<`any`, `any`, `any`\> |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onInvoke

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onMount

___

### quit

▸ **quit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### raw

▸ **raw**<`TResult`\>(`sql`, `bindings?`): `Promise`<`Raw`<`TResult`\>\>

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

`Promise`<`Raw`<`TResult`\>\>

___

### schema

▸ **schema**(): `SchemaBuilder`

#### Returns

`SchemaBuilder`

___

### transaction

▸ **transaction**<`TResult`\>(`scope`, `config?`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | (`trx`: `Transaction`<`any`, `any`\>) => `void` \| `Promise`<`TResult`\> |
| `config?` | `any` |

#### Returns

`Promise`<`TResult`\>
