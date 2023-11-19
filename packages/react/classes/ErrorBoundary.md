# Class: ErrorBoundary

## Hierarchy

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), \{ `error?`: `Error` ; `info?`: \{ `componentStack?`: `string`  }  }\>

  ↳ **`ErrorBoundary`**

## Table of contents

### Constructors

- [constructor](ErrorBoundary.md#constructor)

### Methods

- [componentDidCatch](ErrorBoundary.md#componentdidcatch)
- [render](ErrorBoundary.md#render)

## Constructors

### constructor

• **new ErrorBoundary**(`props`): [`ErrorBoundary`](ErrorBoundary.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md) |

#### Returns

[`ErrorBoundary`](ErrorBoundary.md)

#### Overrides

Component\&lt;
  ErrorBoundaryProps,
  \{
    error?: Error
    info?: \{
      componentStack?: string
    }
  }
\&gt;.constructor

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

▸ **render**(): `string` \| `number` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Element`

#### Returns

`string` \| `number` \| `boolean` \| `Iterable`\<`ReactNode`\> \| `Element`

#### Overrides

Component.render
