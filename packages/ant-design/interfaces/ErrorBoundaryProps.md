# Interface: ErrorBoundaryProps

## Table of contents

### Properties

- [children](ErrorBoundaryProps.md#children)
- [errorChildren](ErrorBoundaryProps.md#errorchildren)
- [onError](ErrorBoundaryProps.md#onerror)

## Properties

### children

• `Optional` **children**: `ReactNode`

___

### errorChildren

• `Optional` **errorChildren**: `ReactElement`\<`ErrorChildrenProps`, `string` \| (`props`: `any`, `deprecatedLegacyContext?`: `any`) => `ReactNode` \| (`props`: `any`, `deprecatedLegacyContext?`: `any`) => `Component`\<`any`, `any`, `any`\>\>

___

### onError

• `Optional` **onError**: (`error`: `Error`, `info`: `any`) => `void`

#### Type declaration

▸ (`error`, `info`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `info` | `any` |

##### Returns

`void`
