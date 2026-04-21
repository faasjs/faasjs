[@faasjs/dev](../README.md) / ApiTester

# Class: ApiTester\<TFunc\>

Wrap a FaasJS API with helpers for mounting and assertion-friendly invocations.

The tester resolves config for the current `FaasEnv`, mounts lazily, and
exposes helpers for raw handler calls and HTTP-style JSON assertions.

## See

[testApi](../functions/testApi.md)

## Example

```ts
import { ApiTester } from '@faasjs/dev'
import api from './hello.api.ts'

const wrapped = new ApiTester(api)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```

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

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<`JsonHandlerResult`\<`TData`\>\>

Invoke an HTTP-enabled API with JSON body helpers and decoded cookies.

JSON responses populate `data` and `error`, while `Set-Cookie` headers are
decoded into the returned `cookie` and `session` objects.

#### Type Parameters

##### TData

`TData` = `any`

Expected JSON `data` payload returned by the API.

#### Parameters

##### body?

`JsonHandlerBody`\<`TFunc`\>

Request body object or raw JSON string.

##### options?

`JsonHandlerOptions` = `...`

Extra headers, request cookies, and session seed values.

#### Returns

`Promise`\<`JsonHandlerResult`\<`TData`\>\>

Normalized HTTP response payload for assertions.

#### Throws

When the wrapped API does not use the HTTP plugin.

#### Example

```ts
import { testApi } from '@faasjs/dev'
import api from './hello.api.ts'

const handler = testApi(api)
const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })

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
