[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type Alias: FaasDataWrapperProps\<PathOrData\>

> **FaasDataWrapperProps**\<`PathOrData`\> = `object`

Props for the [FaasDataWrapper](../variables/FaasDataWrapper.md) render-prop component.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

Action path or response data type used for inference.

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

Callback invoked whenever the resolved data value changes.

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`void`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

Render prop invoked with the resolved request state after the first load completes.

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`Element` \| `Element`[]

## Properties

### action

> **action**: [`FaasAction`](FaasAction.md)\<`PathOrData`\>

Action path to request.

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Base URL override used for this wrapper instance.

### children?

> `optional` **children?**: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>\>\>

Child element cloned with injected request state after the first load completes.

### data?

> `optional` **data?**: [`FaasData`](FaasData.md)\<`PathOrData`\>

Controlled data value used instead of internal state.

### fallback?

> `optional` **fallback?**: `JSX.Element` \| `false`

Element rendered before the first successful load.

### params?

> `optional` **params?**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

Params sent to the action.

### polling?

> `optional` **polling?**: `number` \| `false`

Milliseconds to wait after each completed request before refreshing data in the background.

### ref?

> `optional` **ref?**: `React.Ref`\<[`FaasDataWrapperRef`](FaasDataWrapperRef.md)\<`PathOrData`\>\>

Imperative ref exposing the current injected request state.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Controlled setter used instead of internal state.
