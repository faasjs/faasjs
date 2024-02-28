[@faasjs/test](../README.md) / FuncWarper

# Class: FuncWarper

Test Wrapper for a func

```ts
import { FuncWarper } from '@faasjs/test'

const func = new FuncWarper(__dirname + '/../demo.func.ts')

expect(await func.handler()).toEqual('Hello, world')
```

## Indexable

 \[`key`: `string`\]: `any`

## Constructors

### new FuncWarper(initBy)

> **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

• **initBy**: [`Func`](Func.md)\<`any`, `any`, `any`\>

#### Returns

[`FuncWarper`](FuncWarper.md)

### new FuncWarper(initBy)

> **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

• **initBy**: `string`

#### Returns

[`FuncWarper`](FuncWarper.md)

## Properties

### config

> **`readonly`** **config**: [`Config`](../type-aliases/Config.md)

### file

> **`readonly`** **file**: `string`

### func

> **`readonly`** **func**: [`Func`](Func.md)\<`any`, `any`, `any`\>

### logger

> **`readonly`** **logger**: `Logger`

### plugins

> **`readonly`** **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

### staging

> **`readonly`** **staging**: `string`

## Methods

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body`?, `options`?): `Promise`\<`Object`\>

#### Type parameters

• **TData** = `any`

#### Parameters

• **body?**

• **options?**= `undefined`

• **options\.cookie?**

• **options\.headers?**

• **options\.session?**

#### Returns

`Promise`\<`Object`\>

> ##### body
>
> > **body**: `any`
>
> ##### cookie?
>
> > **`optional`** **cookie**: `Record`\<`string`, `any`\>
>
> ##### data?
>
> > **`optional`** **data**: `TData`
>
> ##### error?
>
> > **`optional`** **error**: `Object`
>
> ##### error.message
>
> > **message**: `string`
>
> ##### headers
>
> > **headers**: `Object`
>
> ###### Index signature
>
> \[`key`: `string`\]: `string`
>
> ##### session?
>
> > **`optional`** **session**: `Record`\<`string`, `any`\>
>
> ##### statusCode
>
> > **statusCode**: `number`
>

### handler()

> **handler**\<`TResult`\>(`event`, `context`): `Promise`\<`TResult`\>

#### Type parameters

• **TResult** = `any`

#### Parameters

• **event**: `any`= `undefined`

• **context**: `any`= `undefined`

#### Returns

`Promise`\<`TResult`\>

### mount()

> **mount**(`handler`?): `Promise`\<`void`\>

#### Parameters

• **handler?**

#### Returns

`Promise`\<`void`\>
