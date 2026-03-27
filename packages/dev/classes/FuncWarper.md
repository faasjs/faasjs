[@faasjs/dev](../README.md) / FuncWarper

# Class: FuncWarper\<TFunc\>

Test wrapper for a function.

## Example

```ts
import { FuncWarper } from '@faasjs/dev'
import { func } from './hello.func'

const wrapped = new FuncWarper(func)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](Func.md)\<`any`, `any`, `any`\> = [`Func`](Func.md)\<`any`, `any`, `any`\>

## Constructors

### Constructor

> **new FuncWarper**\<`TFunc`\>(`initBy`): `FuncWarper`\<`TFunc`\>

Create a test wrapper around a FaasJS function module.

#### Parameters

##### initBy

`TFunc`

FaasJS function module or exported function instance.

```ts
import { FuncWarper } from '@faasjs/dev'

new FuncWarper(__dirname + '/../demo.func.ts')
```

#### Returns

`FuncWarper`\<`TFunc`\>

## Methods

### handler()

> **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

Invoke the wrapped function with raw event and context payloads.

#### Type Parameters

##### TResult

`TResult` = `any`

#### Parameters

##### event?

`any` = `...`

Runtime event to pass to the exported handler.

##### context?

`any` = `...`

Runtime context to pass to the exported handler.

#### Returns

`Promise`\<`TResult`\>

Handler result.

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Invoke an HTTP-enabled function with JSON body helpers and decoded cookies.

#### Type Parameters

##### TData

`TData` = `any`

#### Parameters

##### body?

`JSONhandlerBody`\<`TFunc`\>

Request body object or raw JSON string.

##### options?

Extra headers, request cookies, and session seed values.

###### cookie?

\{\[`key`: `string`\]: `any`; \}

###### headers?

\{\[`key`: `string`\]: `any`; \}

###### session?

\{\[`key`: `string`\]: `any`; \}

#### Returns

`Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Normalized HTTP response payload for assertions.

#### Throws

When the wrapped function does not use the HTTP plugin.

### mount()

> **mount**(`handler?`): `Promise`\<`void`\>

Mount the wrapped function once before running assertions.

#### Parameters

##### handler?

(`func`) => `void` \| `Promise`\<`void`\>

Optional callback invoked after mount.

#### Returns

`Promise`\<`void`\>

## Properties

### config

> `readonly` **config**: [`Config`](../type-aliases/Config.md)

Resolved config attached to the wrapped function.

### file

> `readonly` **file**: `string`

Source file path inferred from the wrapped function.

### func

> `readonly` **func**: `TFunc`

Wrapped function instance.

### logger

> `readonly` **logger**: `Logger`

Logger used by helper methods.

### staging

> `readonly` **staging**: `string`

Active staging name used while loading config.
