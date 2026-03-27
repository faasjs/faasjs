[@faasjs/dev](../README.md) / Http

# Class: Http\<TParams, TCookie, TSession\>

HTTP lifecycle plugin that enriches invoke data with cookies, sessions, and response helpers.

## Type Parameters

### TParams

`TParams` _extends_ `Record`\<`string`, `any`\> = `any`

### TCookie

`TCookie` _extends_ `Record`\<`string`, `string`\> = `any`

### TSession

`TSession` _extends_ `Record`\<`string`, `string`\> = `any`

## Implements

- [`Plugin`](../type-aliases/Plugin.md)

## Constructors

### Constructor

> **new Http**\<`TParams`, `TCookie`, `TSession`\>(`config?`): `Http`\<`TParams`, `TCookie`, `TSession`\>

Create an HTTP plugin instance.

#### Parameters

##### config?

[`HttpConfig`](../type-aliases/HttpConfig.md)

Optional plugin name and HTTP configuration overrides.

#### Returns

`Http`\<`TParams`, `TCookie`, `TSession`\>

## Methods

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

Attach HTTP helpers, cookies, sessions, and response handling to invoke data.

#### Parameters

##### data

[`InvokeData`](../type-aliases/InvokeData.md)

Invocation data for the current request.

##### next

[`Next`](../type-aliases/Next.md)

Continuation for the remaining invoke chain.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

Merge environment and function config into the plugin before first invoke.

#### Parameters

##### data

[`MountData`](../type-aliases/MountData.md)

Mount data supplied by the parent function.

##### next

[`Next`](../type-aliases/Next.md)

Continuation for the remaining mount chain.

#### Returns

`Promise`\<`void`\>

#### Throws

When function config is unavailable.

#### Implementation of

`Plugin.onMount`

## Properties

### config

> **config**: [`HttpConfig`](../type-aliases/HttpConfig.md)

Active HTTP plugin configuration after mount-time merging.

### name

> `readonly` **name**: `string` = `Name`

Plugin instance name used in config lookup and logs.

#### Implementation of

`Plugin.name`

### type

> `readonly` **type**: `"http"` = `'http'`

Stable plugin type identifier.

#### Implementation of

`Plugin.type`
