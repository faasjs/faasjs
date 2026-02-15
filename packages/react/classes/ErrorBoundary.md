[@faasjs/react](../README.md) / ErrorBoundary

# Class: ErrorBoundary

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), \{ `error`: `Error` \| `null`; `info`: `ErrorInfo`; \}\>

## Constructors

### Constructor

> **new ErrorBoundary**(`props`): `ErrorBoundary`

#### Parameters

##### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

#### Returns

`ErrorBoundary`

#### Overrides

Component\< ErrorBoundaryProps, \{ error: Error \| null info: ErrorInfo \} \>.constructor

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `info`): `void`

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

##### error

`Error`

##### info

`ErrorInfo`

#### Returns

`void`

#### Overrides

`Component.componentDidCatch`

### render()

> **render**(): `string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null`

#### Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null`

#### Overrides

`Component.render`

## Properties

### displayName

> `static` **displayName**: `string` = `'ErrorBoundary'`
