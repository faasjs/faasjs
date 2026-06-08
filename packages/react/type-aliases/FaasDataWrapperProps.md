[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type Alias: FaasDataWrapperProps\<Path\>

> **FaasDataWrapperProps**\<`Path`\> = `object`

Props for the [FaasDataWrapper](../variables/FaasDataWrapper.md) render-prop component.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

Callback invoked whenever the resolved data value changes.

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`Path`\>

#### Returns

`void`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

Render prop invoked with the resolved request state after the first load completes.

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`Path`\>

#### Returns

`Element` \| `Element`[]

## Properties

### action

> **action**: `Path`

Action path to request.

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Base URL override used for this wrapper instance.

### children?

> `optional` **children?**: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\<`Path`\>\>\>

Child element cloned with injected request state after the first load completes.

### data?

> `optional` **data?**: `FaasData`\<`Path`\>

Controlled data value used instead of internal state.

### fallback?

> `optional` **fallback?**: `JSX.Element` \| `false`

Element rendered before the first successful load.

### params?

> `optional` **params?**: `FaasParams`\<`Path`\>

Params sent to the action.

### polling?

> `optional` **polling?**: `number` \| `false`

Milliseconds to wait after each completed request before refreshing data in the background.

### ref?

> `optional` **ref?**: `React.Ref`\<[`FaasDataWrapperRef`](FaasDataWrapperRef.md)\<`Path`\>\>

Imperative ref exposing the current injected request state.

### setData?

> `optional` **setData?**: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`Path`\>\>\>

Controlled setter used instead of internal state.
