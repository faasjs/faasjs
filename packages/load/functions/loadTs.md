[@faasjs/load](../README.md) / loadTs

# Function: loadTs()

> **loadTs**(`filename`, `options`): `Promise`\<`Object`\>

加载 ts 文件

## Parameters

• **filename**: `string`

\{string\} 完整源文件路径

• **options**= `undefined`

\{object\} 配置项

• **options\.input?**

\{object\} 读取配置

• **options\.modules?**

\{object\} 生成 modules 的配置

• **options\.modules\.additions?**: `string`[]

• **options\.modules\.excludes?**: `string`[]

• **options\.output?**

\{object\} 写入配置

• **options\.tmp?**: `boolean`

\{boolean\} 是否为临时文件，true 则生成的文件会被删除，默认为 false

## Returns

`Promise`\<`Object`\>

> ### dependencies
>
> > **dependencies**: `Object`
>
> #### Index signature
>
> \[`key`: `string`\]: `string`
>
> ### module?
>
> > **`optional`** **module**: `Func`
>
> ### modules?
>
> > **`optional`** **modules**: `Object`
>
> #### Index signature
>
> \[`key`: `string`\]: `string`
>
