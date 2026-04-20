[@faasjs/dev](../README.md) / ApiTester

# Class: ApiTester\<TFunc\>

Wrap a FaasJS API with helpers for mounting and assertion-friendly invocations.

The tester resolves config for the current `FaasEnv`, mounts lazily, and
exposes helpers for raw handler calls and HTTP-style JSON assertions.

## See

[test](../functions/test.md)

## Example

```ts
import { ApiTester } from '@faasjs/dev'
import api from './hello.api.ts'

const wrapped = new ApiTester(api)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```

## Extended by

- [`FuncWarper`](FuncWarper.md)

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](Func.md)\<`any`, `any`, `any`\> = [`Func`](Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Constructors

### Constructor

> **new ApiTester**\<`TFunc`\>(`initBy`): `ApiTester`\<`TFunc`\>

Create a tester around a FaasJS API instance for repeated test calls.

If a module object with a `default` export is passed at runtime, the
default export is used. Legacy `{ func }` module objects still work during
migration.

#### Parameters

##### initBy

`TFunc` \| \{ `default?`: `TFunc`; `func?`: `TFunc`; \}

API instance or module object to wrap.

#### Returns

`ApiTester`\<`TFunc`\>

#### Example

```ts
import { ApiTester } from '@faasjs/dev'
import api from './hello.api.ts'

const wrapped = new ApiTester(api)
```

## Methods

### handler()

> **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

Invoke the wrapped API with raw event and context payloads.

#### Type Parameters

##### TResult

`TResult` = `any`

Expected response type returned by the handler.

#### Parameters

##### event?

`Record`\<`string`, `unknown`\> = `...`

Runtime event passed to the exported handler.

##### context?

`Record`\<`string`, `unknown`\> = `...`

Runtime context passed to the exported handler.

#### Returns

`Promise`\<`TResult`\>

Handler result.

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Invoke an HTTP-enabled API with JSON body helpers and decoded cookies.

JSON responses populate `data` and `error`, while `Set-Cookie` headers are
decoded into the returned `cookie` and `session` objects.

#### Type Parameters

##### TData

`TData` = `any`

Expected JSON `data` payload returned by the API.

#### Parameters

##### body?

[`FuncEventType`](../type-aliases/FuncEventType.md)\<`TFunc`\> _extends_ `object` ? `0` _extends_ `1` & `TParams` ? `string` \| `Record`\<`string`, `any`\> \| `null` : `string` \| `TParams` \| `null` : `string` \| `Record`\<`string`, `any`\> \| `null`

Request body object or raw JSON string.

##### options?

Extra headers, request cookies, and session seed values.

###### cookie?

\{\[`key`: `string`\]: `any`; \}

Cookie key-value pairs preloaded into the request.

###### headers?

\{\[`key`: `string`\]: `any`; \}

Extra request headers merged into the JSON test request.

###### path?

`string`

Request path attached to `event.path` during invocation. This path is the URL pathname without the query string. Defaults to the inferred path from the wrapped API filename when available.

###### session?

\{\[`key`: `string`\]: `any`; \}

Session key-value pairs encoded into the request cookie before invocation.

#### Returns

`Promise`\<\{ `body`: `any`; `cookie?`: `Record`\<`string`, `any`\>; `data?`: `TData`; `error?`: \{ `message`: `string`; \}; `headers`: \{\[`key`: `string`\]: `string`; \}; `session?`: `Record`\<`string`, `any`\>; `statusCode`: `number`; \}\>

Normalized HTTP response payload for assertions.

#### Throws

When the wrapped API does not use the HTTP plugin.

#### Example

```ts
import { test } from '@faasjs/dev'
import api from './hello.api.ts'

const wrapped = test(api)
const response = await wrapped.JSONhandler({ name: 'FaasJS' }, { session: { userId: '1' } })

expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```

### mount()

> **mount**(`handler?`): `Promise`\<`void`\>

Mount the wrapped API once before running assertions.

#### Parameters

##### handler?

(`api`) => `void` \| `Promise`\<`void`\>

Optional callback invoked after mount.

#### Returns

`Promise`\<`void`\>

Resolves after the API has been mounted and the callback has finished.

## Properties

### config

> `readonly` **config**: [`Config`](../type-aliases/Config.md)

Resolved config attached to the wrapped API.

### file

> `readonly` **file**: `string`

Source file path inferred from the wrapped API.

### func

> `readonly` **func**: `TFunc`

Wrapped API instance.

### logger

> `readonly` **logger**: `Logger`

Logger used by helper methods.

### staging

> `readonly` **staging**: `string`

Active staging name used while loading config.
