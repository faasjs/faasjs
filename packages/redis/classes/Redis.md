# Class: Redis

Redis 插件

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Redis.md#constructor)

### Properties

- [adapter](Redis.md#adapter)
- [config](Redis.md#config)
- [logger](Redis.md#logger)
- [name](Redis.md#name)
- [type](Redis.md#type)

### Methods

- [get](Redis.md#get)
- [getJSON](Redis.md#getjson)
- [onDeploy](Redis.md#ondeploy)
- [onMount](Redis.md#onmount)
- [query](Redis.md#query)
- [quit](Redis.md#quit)
- [set](Redis.md#set)
- [setJSON](Redis.md#setjson)

## Constructors

### constructor

• **new Redis**(`config?`)

创建插件实例

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`RedisConfig`](../modules.md#redisconfig) | 配置 |

#### Defined in

[index.ts:60](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L60)

## Properties

### adapter

• **adapter**: `Redis`

#### Defined in

[index.ts:51](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L51)

___

### config

• **config**: `RedisOptions`

#### Defined in

[index.ts:50](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L50)

___

### logger

• **logger**: `Logger`

#### Defined in

[index.ts:52](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L52)

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

#### Defined in

[index.ts:49](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L49)

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

#### Defined in

[index.ts:48](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L48)

## Methods

### get

▸ **get**<`TData`\>(`key`): `Promise`<`TData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`TData`\>

#### Defined in

[index.ts:133](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L133)

___

### getJSON

▸ **getJSON**<`TData`\>(`key`): `Promise`<`TData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`TData`\>

#### Defined in

[index.ts:137](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L137)

___

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

#### Defined in

[index.ts:68](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L68)

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

#### Defined in

[index.ts:74](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L74)

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

[index.ts:102](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L102)

___

### quit

▸ **quit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:122](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L122)

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

[index.ts:145](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L145)

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

[index.ts:175](https://github.com/faasjs/faasjs/blob/1705fd2/packages/redis/src/index.ts#L175)
