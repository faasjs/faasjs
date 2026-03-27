[@faasjs/react](../README.md) / ErrorBoundaryProps

# Interface: ErrorBoundaryProps

Props for the [ErrorBoundary](../classes/ErrorBoundary.md) component.

## Properties

### children?

> `optional` **children?**: `ReactNode`

### errorChildren?

> `optional` **errorChildren?**: `ReactElement`\<[`ErrorChildrenProps`](../type-aliases/ErrorChildrenProps.md), `string` \| `JSXElementConstructor`\<`any`\>\>

### onError?

> `optional` **onError?**: (`error`, `info`) => `void`

#### Parameters

##### error

`Error` \| `null`

##### info

`any`

#### Returns

`void`
