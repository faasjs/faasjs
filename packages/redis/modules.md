# @faasjs/redis

## Table of contents

### Classes

- [Redis](classes/Redis.md)

### Type aliases

- [RedisConfig](modules.md#redisconfig)

### Functions

- [get](modules.md#get)
- [getJSON](modules.md#getjson)
- [query](modules.md#query)
- [set](modules.md#set)
- [setJSON](modules.md#setjson)
- [useRedis](modules.md#useredis)

## Type aliases

### RedisConfig

Ƭ **RedisConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `RedisOptions` |
| `name?` | `string` |

#### Defined in

[index.ts:10](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L10)

## Functions

### get

▸ **get**<`TResult`\>(`key`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:195](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L195)

___

### getJSON

▸ **getJSON**<`TResult`\>(`key`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:207](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L207)

___

### query

▸ **query**<`TResult`\>(`command`, `args`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | keyof `Commands` |
| `args` | `any`[] |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:188](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L188)

___

### set

▸ **set**<`TResult`\>(`key`, `value`, `options?`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |
| `options?` | `SET` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:199](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L199)

___

### setJSON

▸ **setJSON**<`TResult`\>(`key`, `value`, `options?`): `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |
| `options?` | `SET` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:211](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L211)

___

### useRedis

▸ **useRedis**(`config?`): [`Redis`](classes/Redis.md) & `UseifyPlugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`RedisConfig`](modules.md#redisconfig) |

#### Returns

[`Redis`](classes/Redis.md) & `UseifyPlugin`

#### Defined in

[index.ts:180](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L180)
