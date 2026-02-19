[@faasjs/dev](../README.md) / FuncWarper

# Class: FuncWarper

Test wrapper for a function.

```ts
import { FuncWarper } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = new FuncWarper(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new FuncWarper**(`initBy`): `FuncWarper`

#### Parameters

##### initBy

[`Func`](Func.md)

{Func} A FaasJS function

```ts
import { FuncWarper } from '@faasjs/dev'

new FuncWarper(__dirname + '/../demo.func.ts')
```

#### Returns

`FuncWarper`

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

`string` | `Record`\<`string`, `any`\> | `null`

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

> `readonly` **func**: [`Func`](Func.md)

### logger

> `readonly` **logger**: `Logger`

### plugins

> `readonly` **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

### staging

> `readonly` **staging**: `string`
