[@faasjs/dev](../README.md) / FuncWarper

# Class: FuncWarper\<TFunc\>

Test wrapper for a function.

```ts
import { FuncWarper } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = new FuncWarper(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Type Parameters

### TFunc

`TFunc` *extends* [`Func`](Func.md)\<`any`, `any`, `any`\> = [`Func`](Func.md)\<`any`, `any`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new FuncWarper**\<`TFunc`\>(`initBy`): `FuncWarper`\<`TFunc`\>

#### Parameters

##### initBy

`TFunc`

{Func} A FaasJS function
```ts
import { FuncWarper } from '@faasjs/dev'

new FuncWarper(__dirname + '/../demo.func.ts')
```

#### Returns

`FuncWarper`\<`TFunc`\>

## Methods

### handler()

> **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

#### Type Parameters

##### TResult

`TResult` = `any`

#### Parameters

##### event?

`any` = `...`

##### context?

`any` = `...`

#### Returns

`Promise`\<`TResult`\>

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

#### Type Parameters

##### TData

`TData` = `any`

#### Parameters

##### body?

`JSONhandlerBody`\<`TFunc`\>

##### options?

###### cookie?

\{\[`key`: `string`\]: `any`; \}

###### headers?

\{\[`key`: `string`\]: `any`; \}

###### session?

\{\[`key`: `string`\]: `any`; \}

#### Returns

`Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

### mount()

> **mount**(`handler?`): `Promise`\<`void`\>

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

> `readonly` **func**: `TFunc`

### logger

> `readonly` **logger**: `Logger`

### plugins

> `readonly` **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

### staging

> `readonly` **staging**: `string`
