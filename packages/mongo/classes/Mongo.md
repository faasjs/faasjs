[@faasjs/mongo](../README.md) / Mongo

# Class: Mongo

## Implements

- `Plugin`

## Constructors

### new Mongo()

> **new Mongo**(`config`?): [`Mongo`](Mongo.md)

#### Parameters

• **config?**

• **config.config?**: [`MongoConfig`](../interfaces/MongoConfig.md)

• **config.name?**: `string`

#### Returns

[`Mongo`](Mongo.md)

## Methods

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`

## Properties

### client

> **client**: `MongoClient`

### collection()

> **collection**: \<`TSchema`\>(`name`, `options`?, `callback`?) => `Collection`\<`TSchema`\>

#### Type Parameters

• **TSchema** = `any`

#### Parameters

• **name**: `string`

• **options?**: `CollectionOptions`

• **callback?**: `Callback`\<`Collection`\<`TSchema`\>\>

#### Returns

`Collection`\<`TSchema`\>

### config

> **config**: [`MongoConfig`](../interfaces/MongoConfig.md)

### db

> **db**: `Db`

### name

> `readonly` **name**: `string` = `'Mongo'`

#### Implementation of

`Plugin.name`

### type

> `readonly` **type**: `"mongo"` = `'mongo'`

#### Implementation of

`Plugin.type`
