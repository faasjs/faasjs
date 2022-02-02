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
- [logger](Mongo.md#logger)
- [name](Mongo.md#name)
- [type](Mongo.md#type)

### Methods

- [onDeploy](Mongo.md#ondeploy)
- [onMount](Mongo.md#onmount)

## Constructors

### constructor

• **new Mongo**(`config?`)

创建插件实例

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | 配置 |
| `config.config?` | [`MongoConfig`](../interfaces/MongoConfig.md) | 数据库配置 |
| `config.name?` | `string` | 配置名 |

#### Defined in

[index.ts:42](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L42)

## Properties

### client

• **client**: `MongoClient`

#### Defined in

[index.ts:28](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L28)

___

### collection

• **collection**: <TSchema\>(`name`: `string`, `options?`: `CollectionOptions`, `callback?`: `Callback`<`Collection`<`TSchema`\>\>) => `Collection`<`TSchema`\>

#### Type declaration

▸ <`TSchema`\>(`name`, `options?`, `callback?`): `Collection`<`TSchema`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | `CollectionOptions` |
| `callback?` | `Callback`<`Collection`<`TSchema`\>\> |

##### Returns

`Collection`<`TSchema`\>

#### Defined in

[index.ts:30](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L30)

___

### config

• **config**: [`MongoConfig`](../interfaces/MongoConfig.md)

#### Defined in

[index.ts:26](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L26)

___

### db

• **db**: `Db`

#### Defined in

[index.ts:29](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L29)

___

### logger

• **logger**: `Logger`

#### Defined in

[index.ts:27](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L27)

___

### name

• **name**: `string`

#### Implementation of

Plugin.name

#### Defined in

[index.ts:25](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L25)

___

### type

• **type**: `string` = `'mongo'`

#### Implementation of

Plugin.type

#### Defined in

[index.ts:24](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L24)

## Methods

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

[index.ts:56](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L56)

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

[index.ts:62](https://github.com/faasjs/faasjs/blob/1705fd2/packages/mongo/src/index.ts#L62)
