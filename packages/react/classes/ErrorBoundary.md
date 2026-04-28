[@faasjs/react](../README.md) / ErrorBoundary

# Class: ErrorBoundary

React error boundary with an optional custom fallback element.

The boundary renders its children until a descendant throws. After that it
either clones `errorChildren` with injected error details or renders a simple
built-in fallback.

## Example

```tsx
import { ErrorBoundary } from '@faasjs/react'

function Fallback({ errorMessage }: { errorMessage?: string }) {
  return <div>{errorMessage}</div>
}

;<ErrorBoundary errorChildren={<Fallback />}>
  <DangerousWidget />
</ErrorBoundary>
```

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), \{ `error`: `Error` \| `null`; `info`: `ErrorInfo`; \}\>

## Constructors

### Constructor

> **new ErrorBoundary**(`props`): `ErrorBoundary`

Create an error boundary with empty error state.

#### Parameters

##### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

Boundary props.

#### Returns

`ErrorBoundary`

#### Overrides

Component\< ErrorBoundaryProps, \{ error: Error \| null info: ErrorInfo \} \>.constructor

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `info`): `void`

Capture rendering errors from descendant components.

#### Parameters

##### error

`Error`

Caught render error.

##### info

`ErrorInfo`

React component stack metadata.

#### Returns

`void`

#### Overrides

`Component.componentDidCatch`

### render()

> **render**(): `string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null`

Render children or the configured fallback for the captured error.

#### Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null`

#### Overrides

`Component.render`

## Properties

### displayName

> `static` **displayName**: `string` = `'ErrorBoundary'`

Stable display name used by React DevTools.
