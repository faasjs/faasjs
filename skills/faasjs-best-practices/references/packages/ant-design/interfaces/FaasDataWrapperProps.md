[@faasjs/ant-design](../README.md) / FaasDataWrapperProps

# Interface: FaasDataWrapperProps\<T\>

Ant Design wrapper props for the underlying `@faasjs/react` data wrapper.

## Extends

- `FaasDataWrapperProps`\<`T`\>

## Type Parameters

### T

`T` _extends_ `FaasActionUnionType` = `any`

Action path or response data type used for inference.

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

Callback invoked whenever the resolved data value changes.

#### Parameters

##### args

`FaasDataInjection`\<`T`\>

#### Returns

`void`

#### Inherited from

`OriginProps.onDataChange`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

Render prop invoked with the resolved request state after the first load completes.

#### Parameters

##### args

`FaasDataInjection`\<`T`\>

#### Returns

`Element` \| `Element`[]

#### Inherited from

`OriginProps.render`

## Properties

### action

> **action**: `FaasAction`\<`T`\>

Action path to request.

#### Inherited from

`OriginProps.action`

### baseUrl?

> `optional` **baseUrl?**: `` `${string}/` ``

Base URL override used for this wrapper instance.

#### Inherited from

`OriginProps.baseUrl`

### children?

> `optional` **children?**: `ReactElement`\<`Partial`\<`FaasDataInjection`\<`T`\>\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Child element cloned with injected request state after the first load completes.

#### Inherited from

`OriginProps.children`

### data?

> `optional` **data?**: `FaasData`\<`T`\>

Controlled data value used instead of internal state.

#### Inherited from

`OriginProps.data`

### fallback?

> `optional` **fallback?**: `false` \| `Element`

Element rendered before the first successful load.

#### Inherited from

`OriginProps.fallback`

### loading?

> `optional` **loading?**: `Element`

Explicit loading element that overrides the built-in [Loading](../functions/Loading.md) fallback.

### loadingProps?

> `optional` **loadingProps?**: [`LoadingProps`](../type-aliases/LoadingProps.md)

Props forwarded to the built-in [Loading](../functions/Loading.md) fallback.

### params?

> `optional` **params?**: `FaasParams`\<`T`\>

Params sent to the action.

#### Inherited from

`OriginProps.params`

### ref?

> `optional` **ref?**: `Ref`\<[`FaasDataWrapperRef`](../type-aliases/FaasDataWrapperRef.md)\<`T`\>\>

Imperative ref exposing the current injected request state.

#### Inherited from

`OriginProps.ref`

### setData?

> `optional` **setData?**: `Dispatch`\<`SetStateAction`\<`FaasData`\<`T`\>\>\>

Controlled setter used instead of internal state.

#### Inherited from

`OriginProps.setData`
