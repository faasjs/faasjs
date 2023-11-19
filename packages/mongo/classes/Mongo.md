# Class: Mongo

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](Mongo.md#constructor)

### Properties

- [client](Mongo.md#client)
- [collection](Mongo.md#collection)
- [config](Mongo.md#config)
- [db](Mongo.md#db)
- [name](Mongo.md#name)
- [type](Mongo.md#type)

### Methods

- [onDeploy](Mongo.md#ondeploy)
- [onMount](Mongo.md#onmount)

## Constructors

### constructor

• **new Mongo**(`config?`): [`Mongo`](Mongo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | `Object` |
| `config.config?` | [`MongoConfig`](../interfaces/MongoConfig.md) |
| `config.name?` | `string` |

#### Returns

[`Mongo`](Mongo.md)

## Properties

### client

• **client**: `MongoClient`

___

### collection

• **collection**: \<TSchema\>(`name`: `string`, `options?`: `CollectionOptions`, `callback?`: `Callback`\<`Collection`\<`TSchema`\>\>) => `Collection`\<`TSchema`\>

#### Type declaration

▸ \<`TSchema`\>(`name`, `options?`, `callback?`): `Collection`\<`TSchema`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | `CollectionOptions` |
| `callback?` | `Callback`\<`Collection`\<`TSchema`\>\> |

##### Returns

`Collection`\<`TSchema`\>

___

### config

• **config**: [`MongoConfig`](../interfaces/MongoConfig.md)

___

### db

• **db**: `Db`

___

### name

• **name**: `string`

#### Implementation of

Plugin.name

___

### type

• **type**: `string` = `'mongo'`

#### Implementation of

Plugin.type

## Methods

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
