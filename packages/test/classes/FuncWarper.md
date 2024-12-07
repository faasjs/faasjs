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

### new FuncWarper()

> **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

##### initBy

[`Func`](Func.md)\<`any`, `any`, `any`\>

#### Returns

[`FuncWarper`](FuncWarper.md)

### new FuncWarper()

> **new FuncWarper**(`initBy`): [`FuncWarper`](FuncWarper.md)

#### Parameters

##### initBy

`string`

#### Returns

[`FuncWarper`](FuncWarper.md)

## Methods

### handler()

> **handler**\<`TResult`\>(`event`, `context`): `Promise`\<`TResult`\>

#### Type Parameters

• **TResult** = `any`

#### Parameters

##### event

`any` = `...`

##### context

`any` = `...`

#### Returns

`Promise`\<`TResult`\>

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body`?, `options`?): `Promise`\<`object`\>

#### Type Parameters

• **TData** = `any`

#### Parameters

##### body?

##### options?

###### cookie

\{\}

###### headers

\{\}

###### session

\{\}

#### Returns

`Promise`\<`object`\>

##### body

> **body**: `any`

##### cookie?

> `optional` **cookie**: `Record`\<`string`, `any`\>

##### data?

> `optional` **data**: `TData`

##### error?

> `optional` **error**: `object`

###### error.message

> **message**: `string`

##### headers

> **headers**: `object`

###### Index Signature

 \[`key`: `string`\]: `string`

##### session?

> `optional` **session**: `Record`\<`string`, `any`\>

##### statusCode

> **statusCode**: `number`

### mount()

> **mount**(`handler`?): `Promise`\<`void`\>

#### Parameters

##### handler?

(`func`) => `void` \| `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

## Properties

### config

> `readonly` **config**: [`Config`](../type-aliases/Config.md)

### file

> `readonly` **file**: `string`

### func

> `readonly` **func**: [`Func`](Func.md)\<`any`, `any`, `any`\>

### logger

> `readonly` **logger**: `Logger`

### plugins

> `readonly` **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

### staging

> `readonly` **staging**: `string`
