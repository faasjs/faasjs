[@faasjs/react](../README.md) / ErrorBoundary

# Class: ErrorBoundary

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), \{ `error`: `Error`; `info`: \{ `componentStack`: `string`; \}; \}\>

## Constructors

### Constructor

> **new ErrorBoundary**(`props`): `ErrorBoundary`

#### Parameters

##### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

#### Returns

`ErrorBoundary`

#### Overrides

`Component< ErrorBoundaryProps, { error?: Error info?: { componentStack?: string } } >.constructor`

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `info`): `void`

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

##### error

`Error`

##### info

`any`

#### Returns

`void`

#### Overrides

`Component.componentDidCatch`

### render()

> **render**(): `string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\>

#### Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\>

#### Overrides

`Component.render`

## Properties

### displayName

> `static` **displayName**: `string` = `'ErrorBoundary'`

### whyDidYouRender

> `static` **whyDidYouRender**: `boolean` = `true`
