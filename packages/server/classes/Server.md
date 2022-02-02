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

#### Defined in

[index.ts:72](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L72)

## Properties

### logger

• `Readonly` **logger**: `Logger`

#### Defined in

[index.ts:51](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L51)

___

### opts

• `Readonly` **opts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cache` | `boolean` |
| `port` | `number` |

#### Defined in

[index.ts:52](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L52)

___

### root

• `Readonly` **root**: `string`

#### Defined in

[index.ts:50](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L50)

## Methods

### close

▸ **close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:236](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L236)

___

### listen

▸ **listen**(): `Server`

#### Returns

`Server`

#### Defined in

[index.ts:199](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L199)

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

#### Defined in

[index.ts:94](https://github.com/faasjs/faasjs/blob/1705fd2/packages/server/src/index.ts#L94)
