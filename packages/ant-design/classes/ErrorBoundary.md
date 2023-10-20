# Class: ErrorBoundary

## Hierarchy

- `Component`<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), { `error?`: `Error` \| ``null`` ; `info?`: { `componentStack?`: `string`  }  }\>

  ↳ **`ErrorBoundary`**

## Table of contents

### Constructors

- [constructor](ErrorBoundary.md#constructor)

### Methods

- [componentDidCatch](ErrorBoundary.md#componentdidcatch)
- [render](ErrorBoundary.md#render)

## Constructors

### constructor

• **new ErrorBoundary**(`props`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md) |

#### Overrides

Component&lt;ErrorBoundaryProps, {
  error?: Error \| null
  info?: {
    componentStack?: string
  }
}\&gt;.constructor

## Methods

### componentDidCatch

▸ **componentDidCatch**(`error`, `info`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `info` | `any` |

#### Returns

`void`

#### Overrides

Component.componentDidCatch

___

### render

▸ **render**(): `string` \| `number` \| `boolean` \| `Iterable`<`ReactNode`\> \| `Element`

#### Returns

`string` \| `number` \| `boolean` \| `Iterable`<`ReactNode`\> \| `Element`

#### Overrides

Component.render
