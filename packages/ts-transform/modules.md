# @faasjs/ts-transform

## Table of contents

### Variables

- [NodeBuiltinModules](modules.md#nodebuiltinmodules)

### Functions

- [bundle](modules.md#bundle)
- [transform](modules.md#transform)

## Variables

### NodeBuiltinModules

• **NodeBuiltinModules**: `string`[]

#### Defined in

[index.ts:8](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ts-transform/src/index.ts#L8)

## Functions

### bundle

▸ **bundle**(`options`): `Promise`<`Output`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.externalModules?` | `string`[] | has excluded node builtin modules |
| `options.filename` | `string` | - |
| `options.jscTarget?` | `JscTarget` | default: `es2019` |
| `options.root?` | `string` | default: process.cwd() |

#### Returns

`Promise`<`Output`\>

#### Defined in

[index.ts:88](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ts-transform/src/index.ts#L88)

___

### transform

▸ **transform**(`code`, `options?`): `Output`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | - |
| `options?` | `Object` | - |
| `options.filename?` | `string` | - |
| `options.jsc?` | `JscConfig` | swc compilation  **`see`** https://swc.rs/docs/configuration/compilation |
| `options.root?` | `string` | default: process.cwd() |
| `options.target?` | `JscTarget` | default: `es2019` |

#### Returns

`Output`

#### Defined in

[index.ts:44](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ts-transform/src/index.ts#L44)
