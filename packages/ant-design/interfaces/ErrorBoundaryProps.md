[@faasjs/ant-design](../README.md) / ErrorBoundaryProps

# Interface: ErrorBoundaryProps

Props for the [ErrorBoundary](../functions/ErrorBoundary.md) component.

## Properties

### children?

> `optional` **children?**: `ReactNode`

Descendant elements protected by the boundary.

### errorChildren?

> `optional` **errorChildren?**: `ReactElement`\<`ErrorChildrenProps`, `string` \| `JSXElementConstructor`\<`any`\>\>

Custom fallback element cloned with captured error details.

### onError?

> `optional` **onError?**: (`error`, `info`) => `void`

Callback invoked after a descendant throws during rendering or lifecycle work.

#### Parameters

##### error

`Error` \| `null`

##### info

`any`

#### Returns

`void`
