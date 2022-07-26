# @faasjs/redis

[![License: MIT](https://img.shields.io/npm/l/@faasjs/redis.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/redis/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/redis/stable.svg)](https://www.npmjs.com/package/@faasjs/redis)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/redis/beta.svg)](https://www.npmjs.com/package/@faasjs/redis)

FaasJS's Redis plugin.

## Install

    npm install @faasjs/redis

## Modules

### Classes

- [Redis](classes/Redis.md)

### Type Aliases

- [RedisConfig](#redisconfig)

### Functions

- [get](#get)
- [getJSON](#getjson)
- [query](#query)
- [set](#set)
- [setJSON](#setjson)
- [useRedis](#useredis)

## Type Aliases

### RedisConfig

Ƭ **RedisConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `RedisOptions` |
| `name?` | `string` |

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
| `command` | `string` |
| `args` | `any`[] |

#### Returns

`Promise`<`TResult`\>

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

___

### useRedis

▸ **useRedis**(`config?`): [`Redis`](classes/Redis.md) & `UseifyPlugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`RedisConfig`](#redisconfig) |

#### Returns

[`Redis`](classes/Redis.md) & `UseifyPlugin`
