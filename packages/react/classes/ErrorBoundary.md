[@faasjs/react](../README.md) / ErrorBoundary

# Class: ErrorBoundary

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), `Object`\>

## Constructors

### new ErrorBoundary(props)

> **new ErrorBoundary**(`props`): [`ErrorBoundary`](ErrorBoundary.md)

#### Parameters

• **props**: [`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

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

## Properties

### whyDidYouRender

> **`static`** **whyDidYouRender**: `boolean` = `true`

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `info`): `void`

#### Parameters

• **error**: `Error`

• **info**: `any`

#### Returns

`void`

#### Overrides

`Component.componentDidCatch`

### render()

> **render**(): `string` \| `number` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Element`

#### Returns

`string` \| `number` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Element`

#### Overrides

`Component.render`
