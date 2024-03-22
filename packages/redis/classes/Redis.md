[@faasjs/redis](../README.md) / Redis

# Class: Redis

Redis Plugin

## Implements

- `Plugin`

## Constructors

### new Redis(config)

> **new Redis**(`config`?): [`Redis`](Redis.md)

#### Parameters

• **config?**: [`RedisConfig`](../type-aliases/RedisConfig.md)

#### Returns

[`Redis`](Redis.md)

## Properties

### adapter

> **adapter**: `Redis`

### config

> **config**: `RedisOptions`

### logger

> **logger**: `Logger`

### multi()

> **multi**: (`options`?) => `ChainableCommander`

#### Parameters

• **options?**: `Object` \| `any`[][]

#### Returns

`ChainableCommander`

### name

> **`readonly`** **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### pipeline()

> **pipeline**: (`commands`?) => `ChainableCommander`

#### Parameters

• **commands?**: `any`[][]

#### Returns

`ChainableCommander`

### type

> **`readonly`** **type**: `string` = `Name`

#### Implementation of

`Plugin.type`

## Methods

### get()

> **get**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type parameters

• **TData** = `any`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`TData`\>

### getJSON()

> **getJSON**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type parameters

• **TData** = `any`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`TData`\>

### lock()

> **lock**(`key`, `EX`): `Promise`\<`void`\>

Lock by key

#### Parameters

• **key**: `string`

• **EX**: `number`= `10`

expire in seconds, default 10

#### Returns

`Promise`\<`void`\>

### onDeploy()

> **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `DeployData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onDeploy`

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `InvokeData`\<`any`, `any`, `any`\>

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

### publish()

> **publish**(`channel`, `message`): `Promise`\<`number`\>

Publish message

#### Parameters

• **channel**: `string`

• **message**: `any`

#### Returns

`Promise`\<`number`\>

### query()

> **query**\<`TResult`\>(`command`, `args`): `Promise`\<`TResult`\>

#### Type parameters

• **TResult** = `any`

#### Parameters

• **command**: `string`

• **args**: `any`[]

#### Returns

`Promise`\<`TResult`\>

### quit()

> **quit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### set()

> **set**\<`TResult`\>(`key`, `value`, `options`?): `Promise`\<`TResult`\>

#### Type parameters

• **TResult** = `void`

#### Parameters

• **key**: `string`

• **value**: `any`

• **options?**: `SET`

#### Returns

`Promise`\<`TResult`\>

### setJSON()

> **setJSON**\<`TResult`\>(`key`, `value`, `options`?): `Promise`\<`TResult`\>

#### Type parameters

• **TResult** = `void`

#### Parameters

• **key**: `string`

• **value**: `any`

• **options?**: `SET`

#### Returns

`Promise`\<`TResult`\>

### unlock()

> **unlock**(`key`): `Promise`\<`void`\>

Unlock by key

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>
