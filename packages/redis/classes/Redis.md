[@faasjs/redis](../README.md) / Redis

# Class: Redis

Redis Plugin

## Implements

- `Plugin`

## Constructors

### new Redis()

> **new Redis**(`config`?): [`Redis`](Redis.md)

#### Parameters

• **config?**: [`RedisConfig`](../type-aliases/RedisConfig.md)

#### Returns

[`Redis`](Redis.md)

## Methods

### get()

> **get**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type Parameters

• **TData** = `any`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`TData`\>

### getJSON()

> **getJSON**\<`TData`\>(`key`): `Promise`\<`TData`\>

#### Type Parameters

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

• **EX**: `number` = `10`

expire in seconds, default 10

#### Returns

`Promise`\<`void`\>

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

#### Type Parameters

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

#### Type Parameters

• **TResult** = `void`

#### Parameters

• **key**: `string`

• **value**: `any`

• **options?**: `SET`

#### Returns

`Promise`\<`TResult`\>

### setJSON()

> **setJSON**\<`TResult`\>(`key`, `value`, `options`?): `Promise`\<`TResult`\>

#### Type Parameters

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

• **options?**: `object` \| `any`[][]

#### Returns

`ChainableCommander`

### name

> `readonly` **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### pipeline()

> **pipeline**: (`commands`?) => `ChainableCommander`

#### Parameters

• **commands?**: `any`[][]

#### Returns

`ChainableCommander`

### type

> `readonly` **type**: `string` = `Name`

#### Implementation of

`Plugin.type`
