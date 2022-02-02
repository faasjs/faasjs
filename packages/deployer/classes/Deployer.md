# Class: Deployer

## Table of contents

### Constructors

- [constructor](Deployer.md#constructor)

### Properties

- [deployData](Deployer.md#deploydata)
- [func](Deployer.md#func)

### Methods

- [deploy](Deployer.md#deploy)

## Constructors

### constructor

• **new Deployer**(`data`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |

#### Defined in

[index.ts:14](https://github.com/faasjs/faasjs/blob/1705fd2/packages/deployer/src/index.ts#L14)

## Properties

### deployData

• **deployData**: `DeployData`

#### Defined in

[index.ts:11](https://github.com/faasjs/faasjs/blob/1705fd2/packages/deployer/src/index.ts#L11)

___

### func

• `Optional` **func**: `Func`<`any`, `any`, `any`\>

#### Defined in

[index.ts:12](https://github.com/faasjs/faasjs/blob/1705fd2/packages/deployer/src/index.ts#L12)

## Methods

### deploy

▸ **deploy**(): `Promise`<{ [key: string]: `any`; `filename`: `string` ; `root`: `string`  }\>

#### Returns

`Promise`<{ [key: string]: `any`; `filename`: `string` ; `root`: `string`  }\>

#### Defined in

[index.ts:48](https://github.com/faasjs/faasjs/blob/1705fd2/packages/deployer/src/index.ts#L48)
