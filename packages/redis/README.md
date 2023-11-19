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
- [lock](#lock)
- [multi](#multi)
- [pipeline](#pipeline)
- [publish](#publish)
- [query](#query)
- [set](#set)
- [setJSON](#setjson)
- [unlock](#unlock)
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

▸ **get**\<`TResult`\>(`key`): `Promise`\<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`TResult`\>

___

### getJSON

▸ **getJSON**\<`TResult`\>(`key`): `Promise`\<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`TResult`\>

___

### lock

▸ **lock**(`key`, `EX?`): `Promise`\<`void`\>

Lock by key

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` |  |
| `EX` | `number` | `10` | expire in seconds, default 10 |

#### Returns

`Promise`\<`void`\>

___

### multi

▸ **multi**(): `ChainableCommander`

#### Returns

`ChainableCommander`

___

### pipeline

▸ **pipeline**(): `ChainableCommander`

#### Returns

`ChainableCommander`

___

### publish

▸ **publish**(`channel`, `message`): `Promise`\<`number`\>

Publish message

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel` | `string` |
| `message` | `any` |

#### Returns

`Promise`\<`number`\>

___

### query

▸ **query**\<`TResult`\>(`command`, `args`): `Promise`\<`TResult`\>

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

`Promise`\<`TResult`\>

___

### set

▸ **set**\<`TResult`\>(`key`, `value`, `options?`): `Promise`\<`TResult`\>

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

`Promise`\<`TResult`\>

___

### setJSON

▸ **setJSON**\<`TResult`\>(`key`, `value`, `options?`): `Promise`\<`TResult`\>

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

`Promise`\<`TResult`\>

___

### unlock

▸ **unlock**(`key`): `Promise`\<`void`\>

Unlock by key

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`void`\>

___

### useRedis

▸ **useRedis**(`config?`): `UseifyPlugin`\<[`Redis`](classes/Redis.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`RedisConfig`](#redisconfig) |

#### Returns

`UseifyPlugin`\<[`Redis`](classes/Redis.md)\>
