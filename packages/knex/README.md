# @faasjs/knex

[![License: MIT](https://img.shields.io/npm/l/@faasjs/knex.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/knex/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/knex/stable.svg)](https://www.npmjs.com/package/@faasjs/knex)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/knex/beta.svg)](https://www.npmjs.com/package/@faasjs/knex)

FaasJS's sql plugin, base on [Knex](https://knexjs.org/).

## Install

    npm install @faasjs/knex
## Modules

### Classes

- [Knex](classes/Knex.md)

### Type Aliases

- [KnexConfig](#knexconfig)

### Functions

- [query](#query)
- [raw](#raw)
- [transaction](#transaction)
- [useKnex](#useknex)

## Type Aliases

### KnexConfig

Ƭ **KnexConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `K.Config` |
| `name?` | `string` |

## Functions

### query

▸ **query**<`TName`\>(`table`): `K.QueryBuilder`<`K.TableType`<`TName`\>, { `_aliases`: {} ; `_base`: `K.ResolveTableType`<`K.TableType`<`TName`\>, ``"base"``\> ; `_hasSelection`: ``false`` ; `_intersectProps`: {} ; `_keys`: `never` ; `_single`: ``false`` ; `_unionProps`: `never`  }[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends ``"test"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | `TName` |

#### Returns

`K.QueryBuilder`<`K.TableType`<`TName`\>, { `_aliases`: {} ; `_base`: `K.ResolveTableType`<`K.TableType`<`TName`\>, ``"base"``\> ; `_hasSelection`: ``false`` ; `_intersectProps`: {} ; `_keys`: `never` ; `_single`: ``false`` ; `_unionProps`: `never`  }[]\>

▸ **query**<`TName`, `TResult`\>(`table`): `K.QueryBuilder`<`TName`, `TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `Object` = `any` |
| `TResult` | `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | `string` |

#### Returns

`K.QueryBuilder`<`TName`, `TResult`\>

___

### raw

▸ **raw**<`TResult`\>(`sql`, `bindings?`): `Promise`<`TResult`\>

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

`Promise`<`TResult`\>

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
| `config?` | [`KnexConfig`](#knexconfig) |

#### Returns

[`Knex`](classes/Knex.md) & `UseifyPlugin`
