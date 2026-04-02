[@faasjs/dev](../README.md) / FuncWarper

# Class: FuncWarper\<TFunc\>

Wrap a FaasJS function with helpers for mounting and assertion-friendly invocations.

The wrapper resolves config for the current `FaasEnv`, mounts lazily, and
exposes helpers for raw handler calls and HTTP-style JSON assertions.

## See

[test](../functions/test.md)

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

Wrapped FaasJS function type.

## Constructors

### Constructor

> **new FuncWarper**\<`TFunc`\>(`initBy`): `FuncWarper`\<`TFunc`\>

Create a wrapper around a FaasJS function instance for repeated test calls.

If a module object with a `default` export is passed at runtime, the
default export is used.

#### Parameters

##### initBy

`TFunc`

Function instance to wrap.

#### Returns

`FuncWarper`\<`TFunc`\>

#### Example

```ts
import { FuncWarper } from '@faasjs/dev'
import { func } from './hello.func'

const wrapped = new FuncWarper(func)
```

## Methods

### handler()

> **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

Invoke the wrapped function with raw event and context payloads.

#### Type Parameters

##### TResult

`TResult` = `any`

Expected response type returned by the handler.

#### Parameters

##### event?

`Record`\<`string`, `unknown`\> = `...`

##### context?

`Record`\<`string`, `unknown`\> = `...`

#### Returns

`Promise`\<`TResult`\>

Handler result.

---

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Invoke an HTTP-enabled function with JSON body helpers and decoded cookies.

JSON responses populate `data` and `error`, while `Set-Cookie` headers are
decoded into the returned `cookie` and `session` objects.

#### Type Parameters

##### TData

`TData` = `any`

Expected JSON `data` payload returned by the function.

#### Parameters

##### body?

`JSONhandlerBody`\<`TFunc`\>

Request body object or raw JSON string.

##### options?

Extra headers, request cookies, and session seed values.

###### cookie?

\{\[`key`: `string`\]: `any`; \}

Cookie key-value pairs preloaded into the request.

###### headers?

\{\[`key`: `string`\]: `any`; \}

Extra request headers merged into the JSON test request.

###### session?

\{\[`key`: `string`\]: `any`; \}

Session key-value pairs encoded into the request cookie before invocation.

#### Returns

`Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Normalized HTTP response payload for assertions.

#### Throws

When the wrapped function does not use the HTTP plugin.

#### Example

```ts
import { test } from '@faasjs/dev'
import { func } from './hello.func'

const wrapped = test(func)
const response = await wrapped.JSONhandler({ name: 'FaasJS' }, { session: { userId: '1' } })

expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```

---

### mount()

> **mount**(`handler?`): `Promise`\<`void`\>

Mount the wrapped function once before running assertions.

#### Parameters

##### handler?

(`func`) => `void` \| `Promise`\<`void`\>

Optional callback invoked after mount.

#### Returns

`Promise`\<`void`\>

Resolves after the function has been mounted and the callback has finished.

## Properties

### config

> `readonly` **config**: [`Config`](../type-aliases/Config.md)

Resolved config attached to the wrapped function.

---

### file

> `readonly` **file**: `string`

Source file path inferred from the wrapped function.

---

### func

> `readonly` **func**: `TFunc`

Wrapped function instance.

---

### logger

> `readonly` **logger**: `Logger`

Logger used by helper methods.

---

### staging

> `readonly` **staging**: `string`

Active staging name used while loading config.
