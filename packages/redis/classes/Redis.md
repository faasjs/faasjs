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
- [multi](Redis.md#multi)
- [name](Redis.md#name)
- [pipeline](Redis.md#pipeline)
- [type](Redis.md#type)

### Methods

- [get](Redis.md#get)
- [getJSON](Redis.md#getjson)
- [onDeploy](Redis.md#ondeploy)
- [onInvoke](Redis.md#oninvoke)
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
| `config?` | [`RedisConfig`](../#redisconfig) | {object} 配置 |

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

• **multi**: (`options?`: { `pipeline`: `boolean`  } \| `any`[][]) => `ChainableCommander`

#### Type declaration

▸ (`options?`): `ChainableCommander`

##### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | { `pipeline`: `boolean`  } \| `any`[][] |

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

### quit

▸ **quit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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
