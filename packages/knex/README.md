# @faasjs/knex

[![License: MIT](https://img.shields.io/npm/l/@faasjs/knex.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/knex/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/knex/stable.svg)](https://www.npmjs.com/package/@faasjs/knex)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/knex/beta.svg)](https://www.npmjs.com/package/@faasjs/knex)

FaasJS's sql plugin, base on [Knex](https://knexjs.org/).

## Install

    npm install @faasjs/knex
## Modules

### Namespaces

- [originKnex](modules/originKnex.md)

### Classes

- [Knex](classes/Knex.md)

### Type Aliases

- [KnexConfig](#knexconfig)

### Functions

- [originKnex](#originknex)
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
| `config?` | `OriginKnex.Config` |
| `name?` | `string` |

## Functions

### originKnex

▸ **originKnex**\<`TRecord`, `TResult`\>(`config`): `Knex`\<`TRecord`, `TResult`\>

Origin [knex](https://knexjs.org/) instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRecord` | extends `Object` = `any` |
| `TResult` | `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `string` \| `Config`\<`any`\> |

#### Returns

`Knex`\<`TRecord`, `TResult`\>

___

### query

▸ **query**\<`TName`\>(`table`): `OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, \{ `_aliases`: {} ; `_base`: `OriginKnex.ResolveTableType`\<`OriginKnex.TableType`\<`TName`\>, ``"base"``\> ; `_hasSelection`: ``false`` ; `_intersectProps`: {} ; `_keys`: `never` ; `_single`: ``false`` ; `_unionProps`: `never`  }[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends ``"test"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | `TName` |

#### Returns

`OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, \{ `_aliases`: {} ; `_base`: `OriginKnex.ResolveTableType`\<`OriginKnex.TableType`\<`TName`\>, ``"base"``\> ; `_hasSelection`: ``false`` ; `_intersectProps`: {} ; `_keys`: `never` ; `_single`: ``false`` ; `_unionProps`: `never`  }[]\>

▸ **query**\<`TName`, `TResult`\>(`table`): `OriginKnex.QueryBuilder`\<`TName`, `TResult`\>

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

`OriginKnex.QueryBuilder`\<`TName`, `TResult`\>

___

### raw

▸ **raw**\<`TResult`\>(`sql`, `bindings?`): `Promise`\<`TResult`\>

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

`Promise`\<`TResult`\>

___

### transaction

▸ **transaction**\<`TResult`\>(`scope`, `config?`, `options?`): `Promise`\<`TResult` \| `void`\>

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

`Promise`\<`TResult` \| `void`\>

___

### useKnex

▸ **useKnex**(`config?`): `UseifyPlugin`\<[`Knex`](classes/Knex.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`KnexConfig`](#knexconfig) |

#### Returns

`UseifyPlugin`\<[`Knex`](classes/Knex.md)\>
