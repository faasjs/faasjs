# Class: GraphQLServer

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](GraphQLServer.md#constructor)

### Properties

- [http](GraphQLServer.md#http)
- [name](GraphQLServer.md#name)
- [type](GraphQLServer.md#type)

### Methods

- [onDeploy](GraphQLServer.md#ondeploy)
- [onInvoke](GraphQLServer.md#oninvoke)
- [onMount](GraphQLServer.md#onmount)

## Constructors

### constructor

• **new GraphQLServer**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`GraphQLServerConfig`](../modules.md#graphqlserverconfig) |

#### Defined in

[index.ts:79](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L79)

## Properties

### http

• **http**: `Http`<`any`, `any`, `any`\>

#### Defined in

[index.ts:75](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L75)

___

### name

• `Readonly` **name**: `string`

#### Implementation of

Plugin.name

#### Defined in

[index.ts:74](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L74)

___

### type

• `Readonly` **type**: `string` = `'graphQLServer'`

#### Implementation of

Plugin.type

#### Defined in

[index.ts:73](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L73)

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

[index.ts:148](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L148)

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData`<`any`, `any`, `any`\> |
| `next` | `Next` |

#### Returns

`Promise`<`any`\>

#### Implementation of

Plugin.onInvoke

#### Defined in

[index.ts:127](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L127)

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`<`any`\>

#### Implementation of

Plugin.onMount

#### Defined in

[index.ts:85](https://github.com/faasjs/faasjs/blob/1705fd2/packages/graphql-server/src/index.ts#L85)
