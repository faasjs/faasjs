[@faasjs/load](../README.md) / loadTs

# Function: ~~loadTs()~~

> **loadTs**(`filename`, `options`): `Promise`\<`object`\>

加载 ts 文件

## Parameters

### filename

`string`

{string} 完整源文件路径

### options

{object} 配置项

#### input

\{\}

{object} 读取配置

#### modules

\{`additions`: `string`[];`excludes`: `string`[]; \}

{object} 生成 modules 的配置

#### modules.additions

`string`[]

#### modules.excludes

`string`[]

{string[]} modules 中需排除的模块

#### output

\{\}

{object} 写入配置

#### tmp

`boolean`

{boolean} 是否为临时文件，true 则生成的文件会被删除，默认为 false

## Returns

`Promise`\<`object`\>

### ~~dependencies~~

> **dependencies**: `object`

#### Index Signature

 \[`key`: `string`\]: `string`

### ~~module?~~

> `optional` **module**: `Func`

### ~~modules?~~

> `optional` **modules**: `object`

#### Index Signature

 \[`key`: `string`\]: `string`

## Deprecated
