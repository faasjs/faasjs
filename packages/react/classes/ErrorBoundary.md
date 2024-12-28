[@faasjs/react](../README.md) / ErrorBoundary

# Class: ErrorBoundary

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), \{ `error`: `Error`; `info`: \{ `componentStack`: `string`; \}; \}\>

## Constructors

### new ErrorBoundary()

> **new ErrorBoundary**(`props`): [`ErrorBoundary`](ErrorBoundary.md)

#### Parameters

##### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

#### Returns

[`ErrorBoundary`](ErrorBoundary.md)

#### Overrides

`Component<
  ErrorBoundaryProps,
  {
    error?: Error
    info?: {
      componentStack?: string
    }
  }
>.constructor`

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

> **render**(): `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`

#### Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element`

#### Overrides

`Component.render`

## Properties

### displayName

> `static` **displayName**: `string` = `'ErrorBoundary'`

### whyDidYouRender

> `static` **whyDidYouRender**: `boolean` = `true`
