# Class: Redis

Redis Plugin

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Redis.md#constructor)

### Properties

- [adapter](Redis.md#adapter)
- [config](Redis.md#config)
- [logger](Redis.md#logger)
- [multi](Redis.md#multi)
- [name](Redis.md#name)
- [pipeline](Redis.md#pipeline)
- [type](Redis.md#type)

### Methods

- [get](Redis.md#get)
- [getJSON](Redis.md#getjson)
- [lock](Redis.md#lock)
- [onDeploy](Redis.md#ondeploy)
- [onInvoke](Redis.md#oninvoke)
- [onMount](Redis.md#onmount)
- [publish](Redis.md#publish)
- [query](Redis.md#query)
- [quit](Redis.md#quit)
- [set](Redis.md#set)
- [setJSON](Redis.md#setjson)
- [unlock](Redis.md#unlock)

## Constructors

### constructor

• **new Redis**(`config?`): [`Redis`](Redis.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`RedisConfig`](../#redisconfig) |

#### Returns

[`Redis`](Redis.md)

## Properties

### adapter

• **adapter**: `Redis`

___

### config

• **config**: `RedisOptions`

___

### logger

• **logger**: `Logger`

___

### multi

• **multi**: (`options?`: \{ `pipeline`: `boolean`  } \| `any`[][]) => `ChainableCommander`

#### Type declaration

▸ (`options?`): `ChainableCommander`

##### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | \{ `pipeline`: `boolean`  } \| `any`[][] |

##### Returns

`ChainableCommander`

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

___

### pipeline

• **pipeline**: (`commands?`: `any`[][]) => `ChainableCommander`

#### Type declaration

▸ (`commands?`): `ChainableCommander`

##### Parameters

| Name | Type |
| :------ | :------ |
| `commands?` | `any`[][] |

##### Returns

`ChainableCommander`

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

## Methods

### get

▸ **get**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`TData`\>

___

### getJSON

▸ **getJSON**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`TData`\>

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

### quit

▸ **quit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

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
