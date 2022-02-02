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

## Properties

### http

• **http**: `Http`<`any`, `any`, `any`\>

___

### name

• `Readonly` **name**: `string`

#### Implementation of

Plugin.name

___

### type

• `Readonly` **type**: `string` = `'graphQLServer'`

#### Implementation of

Plugin.type

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
