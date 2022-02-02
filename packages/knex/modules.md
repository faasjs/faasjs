# @faasjs/knex

## Table of contents

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

#### Defined in

[index.ts:8](https://github.com/faasjs/faasjs/blob/1705fd2/packages/knex/src/index.ts#L8)

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

#### Defined in

[index.ts:182](https://github.com/faasjs/faasjs/blob/1705fd2/packages/knex/src/index.ts#L182)

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

#### Defined in

[index.ts:193](https://github.com/faasjs/faasjs/blob/1705fd2/packages/knex/src/index.ts#L193)

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

#### Defined in

[index.ts:186](https://github.com/faasjs/faasjs/blob/1705fd2/packages/knex/src/index.ts#L186)

___

### useKnex

▸ **useKnex**(`config?`): [`Knex`](classes/Knex.md) & `UseifyPlugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`KnexConfig`](modules.md#knexconfig) |

#### Returns

[`Knex`](classes/Knex.md) & `UseifyPlugin`

#### Defined in

[index.ts:174](https://github.com/faasjs/faasjs/blob/1705fd2/packages/knex/src/index.ts#L174)
