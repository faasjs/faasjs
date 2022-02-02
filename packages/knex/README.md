# @faasjs/knex

Knex 插件

[![License: MIT](https://img.shields.io/npm/l/@faasjs/knex.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/knex/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/knex/stable.svg)](https://www.npmjs.com/package/@faasjs/knex)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/knex/beta.svg)](https://www.npmjs.com/package/@faasjs/knex)

## Modules

### Classes

- [Knex](classes/Knex.md)

### Type aliases

- [KnexConfig](modules.md#knexconfig)

### Functions

- [query](modules.md#query)
- [raw](modules.md#raw)
- [transaction](modules.md#transaction)
- [useKnex](modules.md#useknex)

## Type aliases

### KnexConfig

Ƭ **KnexConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `K.Config` |
| `name?` | `string` |

## Functions

### query

▸ **query**<`TName`\>(`table`): `QueryBuilder`<`TableType`<`TName`\>, `DeferredKeySelection`<`ResolveTableType`<`TableType`<`TName`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | `TName` |

#### Returns

`QueryBuilder`<`TableType`<`TName`\>, `DeferredKeySelection`<`ResolveTableType`<`TableType`<`TName`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

___

### raw

▸ **raw**<`TResult`\>(`sql`, `bindings?`): `Promise`<`K.Raw`<`TResult`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sql` | `string` | `undefined` |
| `bindings` | `RawBinding`[] \| `ValueDict` | `[]` |

#### Returns

`Promise`<`K.Raw`<`TResult`\>\>

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

___

### useKnex

▸ **useKnex**(`config?`): [`Knex`](classes/Knex.md) & `UseifyPlugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`KnexConfig`](modules.md#knexconfig) |

#### Returns

[`Knex`](classes/Knex.md) & `UseifyPlugin`
