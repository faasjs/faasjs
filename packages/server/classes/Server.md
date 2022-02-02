# Class: Server

本地服务端

## Table of contents

### Constructors

- [constructor](Server.md#constructor)

### Properties

- [logger](Server.md#logger)
- [opts](Server.md#opts)
- [root](Server.md#root)

### Methods

- [close](Server.md#close)
- [listen](Server.md#listen)
- [processRequest](Server.md#processrequest)

## Constructors

### constructor

• **new Server**(`root`, `opts?`)

创建本地服务器

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `string` | 云函数的根目录 |
| `opts?` | `Object` | 配置项 |
| `opts.cache?` | `boolean` | - |
| `opts.port?` | `number` | - |

## Properties

### logger

• `Readonly` **logger**: `Logger`

___

### opts

• `Readonly` **opts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cache` | `boolean` |
| `port` | `number` |

___

### root

• `Readonly` **root**: `string`

## Methods

### close

▸ **close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### listen

▸ **listen**(): `Server`

#### Returns

`Server`

___

### processRequest

▸ **processRequest**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `IncomingMessage` |
| `res` | `Object` |
| `res.statusCode` | `number` |
| `res.end` | () => `void` |
| `res.setHeader` | (`key`: `string`, `value`: `string`) => `void` |
| `res.write` | (`body`: `string` \| `Buffer`) => `void` |

#### Returns

`Promise`<`void`\>
