# @faasjs/load

[![License: MIT](https://img.shields.io/npm/l/@faasjs/load.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/load/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/load/stable.svg)](https://www.npmjs.com/package/@faasjs/load)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/load/beta.svg)](https://www.npmjs.com/package/@faasjs/load)

FaasJS's load module.

## Install

    npm install @faasjs/load
## Modules

### Functions

- [loadConfig](#loadconfig)
- [loadTs](#loadts)

## Functions

### loadConfig

▸ **loadConfig**(`root`, `filename`): `Config`

加载配置

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `string` | 根目录 |
| `filename` | `string` | 目标文件，用于读取目录层级 |

#### Returns

`Config`

___

### loadTs

▸ **loadTs**(`filename`, `options?`): `Promise`<{ `dependencies`: { [key: string]: `string`;  } ; `module?`: `Func` ; `modules?`: { [key: string]: `string`;  }  }\>

加载 ts 文件

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | 完整源文件路径 |
| `options` | `Object` | 配置项 |
| `options.input?` | `Object` | 读取配置 |
| `options.modules?` | `Object` | 生成 modules 的配置 |
| `options.modules.additions?` | `string`[] | - |
| `options.modules.excludes?` | `string`[] | - |
| `options.output?` | `Object` | 写入配置 |
| `options.tmp?` | `boolean` | 是否为临时文件，true 则生成的文件会被删除，默认为 false |

#### Returns

`Promise`<{ `dependencies`: { [key: string]: `string`;  } ; `module?`: `Func` ; `modules?`: { [key: string]: `string`;  }  }\>
