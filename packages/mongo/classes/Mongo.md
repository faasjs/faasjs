[@faasjs/mongo](../README.md) / Mongo

# Class: Mongo

## Implements

- `Plugin`

## Constructors

### new Mongo(config)

> **new Mongo**(`config`?): [`Mongo`](Mongo.md)

#### Parameters

• **config?**

• **config\.config?**: [`MongoConfig`](../interfaces/MongoConfig.md)

• **config\.name?**: `string`

#### Returns

[`Mongo`](Mongo.md)

## Properties

### client

> **client**: `MongoClient`

### collection

> **collection**: \<`TSchema`\>(`name`, `options`?, `callback`?) => `Collection`\<`TSchema`\>

#### Type parameters

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

> **name**: `string`

#### Implementation of

`Plugin.name`

### type

> **type**: `string` = `'mongo'`

#### Implementation of

`Plugin.type`

## Methods

### onDeploy()

> **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `DeployData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onDeploy`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`
