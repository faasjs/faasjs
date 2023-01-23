# @faasjs/ant-design

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

UI components based on [FaasJS](https://faasjs.com), [Ant Design](https://ant.design) and [React Router](https://reactrouter.com).

## Install

    npm install @faasjs/ant-design

## Usage

In `@faasjs/ant-design`, we use `FaasItemProps` to provide data structures for components.

```ts
type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean' |
  'date' | 'time' |
  'object' | 'object[]'

type FaasItemProps = {
  type: FaasItemTypes
  id: string
  title?: string
}
```

### Form

Form are based on [Ant Design's Form component](https://ant.design/components/form/#Form).

### FormItem

Form are based on [Ant Design's Form.Item component](https://ant.design/components/form/#Form.Item).

## Modules

### Namespaces

- [Form](modules/Form.md)
- [FormItem](modules/FormItem.md)

### Interfaces

- [BaseItemProps](interfaces/BaseItemProps.md)
- [BlankProps](interfaces/BlankProps.md)
- [ConfigProviderProps](interfaces/ConfigProviderProps.md)
- [DescriptionItemContentProps](interfaces/DescriptionItemContentProps.md)
- [DescriptionItemProps](interfaces/DescriptionItemProps.md)
- [DescriptionProps](interfaces/DescriptionProps.md)
- [DrawerProps](interfaces/DrawerProps.md)
- [ExtendDescriptionTypeProps](interfaces/ExtendDescriptionTypeProps.md)
- [FaasItemProps](interfaces/FaasItemProps.md)
- [FormItemProps](interfaces/FormItemProps.md)
- [FormProps](interfaces/FormProps.md)
- [LinkProps](interfaces/LinkProps.md)
- [ModalProps](interfaces/ModalProps.md)
- [RoutesProps](interfaces/RoutesProps.md)
- [TableItemProps](interfaces/TableItemProps.md)
- [TitleProps](interfaces/TitleProps.md)
- [UnionFaasItemProps](interfaces/UnionFaasItemProps.md)

### Type Aliases

- [BaseOption](#baseoption)
- [ExtendDescriptionItemProps](#extenddescriptionitemprops)
- [ExtendFormItemProps](#extendformitemprops)
- [ExtendFormTypeProps](#extendformtypeprops)
- [ExtendTableItemProps](#extendtableitemprops)
- [ExtendTableTypeProps](#extendtabletypeprops)
- [ExtendTypes](#extendtypes)
- [FaasDataInjection](#faasdatainjection)
- [FaasDataWrapperProps](#faasdatawrapperprops)
- [FaasItemType](#faasitemtype)
- [FaasItemTypeValue](#faasitemtypevalue)
- [FormSubmitProps](#formsubmitprops)
- [LoadingProps](#loadingprops)
- [TableProps](#tableprops)
- [UnionFaasItemElement](#unionfaasitemelement)
- [UnionFaasItemInjection](#unionfaasiteminjection)
- [UnionFaasItemRender](#unionfaasitemrender)
- [UnionScene](#unionscene)
- [setDrawerProps](#setdrawerprops)
- [setModalProps](#setmodalprops)

### Variables

- [ConfigContext](#configcontext)

### Functions

- [Blank](#blank)
- [ConfigProvider](#configprovider)
- [Description](#description)
- [FaasDataWrapper](#faasdatawrapper)
- [Form](#form)
- [FormItem](#formitem)
- [Link](#link)
- [Loading](#loading)
- [PageNotFound](#pagenotfound)
- [Routes](#routes)
- [Table](#table)
- [Title](#title)
- [transferOptions](#transferoptions)
- [transferValue](#transfervalue)
- [useConfigContext](#useconfigcontext)
- [useDrawer](#usedrawer)
- [useModal](#usemodal)

## Type Aliases

### BaseOption

Ƭ **BaseOption**: `string` \| `number` \| { `label`: `string` ; `value?`: `string` \| `number`  }

___

### ExtendDescriptionItemProps

Ƭ **ExtendDescriptionItemProps**: [`BaseItemProps`](interfaces/BaseItemProps.md)

___

### ExtendFormItemProps

Ƭ **ExtendFormItemProps**: [`BaseItemProps`](interfaces/BaseItemProps.md) & `AntdFormItemProps`

___

### ExtendFormTypeProps

Ƭ **ExtendFormTypeProps**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | [`UnionFaasItemElement`](#unionfaasitemelement)<`T`\> |

___

### ExtendTableItemProps

Ƭ **ExtendTableItemProps**<`T`\>: [`BaseItemProps`](interfaces/BaseItemProps.md) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### ExtendTableTypeProps

Ƭ **ExtendTableTypeProps**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` |
| `render?` | [`UnionFaasItemRender`](#unionfaasitemrender)<`T`\> |

___

### ExtendTypes

Ƭ **ExtendTypes**: `Object`

#### Index signature

▪ [type: `string`]: [`ExtendFormTypeProps`](#extendformtypeprops)

___

### FaasDataInjection

Ƭ **FaasDataInjection**<`Data`\>: `Object`

Injects FaasData props.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Data` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `action` | `string` \| `any` |
| `data` | `Data` |
| `error` | `any` |
| `loading` | `boolean` |
| `params` | `Record`<`string`, `any`\> |
| `promise` | `Promise`<`Response`<`Data`\>\> |
| `setData` | `React.Dispatch`<`React.SetStateAction`<`Data`\>\> |
| `setError` | `React.Dispatch`<`React.SetStateAction`<`any`\>\> |
| `setLoading` | `React.Dispatch`<`React.SetStateAction`<`boolean`\>\> |
| `setPromise` | `React.Dispatch`<`React.SetStateAction`<`Promise`<`Response`<`Data`\>\>\>\> |
| `reload` | (`params?`: `Record`<`string`, `any`\>) => `Promise`<`Response`<`Data`\>\> |

___

### FaasDataWrapperProps

Ƭ **FaasDataWrapperProps**<`T`\>: `OriginProps`<`T`\> & { `loading?`: `JSX.Element` ; `loadingProps?`: [`LoadingProps`](#loadingprops)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FaasItemType

Ƭ **FaasItemType**: ``"string"`` \| ``"string[]"`` \| ``"number"`` \| ``"number[]"`` \| ``"boolean"`` \| ``"date"`` \| ``"time"`` \| ``"object"`` \| ``"object[]"``

___

### FaasItemTypeValue

Ƭ **FaasItemTypeValue**: `Object`

FaasItemType's value type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `boolean` | `boolean` |
| `date` | `Dayjs` |
| `number` | `number` |
| `number[]` | `number`[] |
| `object` | `any` |
| `object[]` | `any`[] |
| `string` | `string` |
| `string[]` | `string`[] |
| `time` | `Dayjs` |

___

### FormSubmitProps

Ƭ **FormSubmitProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `text?` | `string` | Default: Submit |
| `to?` | { `action`: `string` ; `catch?`: (`error`: `any`) => `void` ; `finally?`: () => `void` ; `params?`: `Record`<`string`, `any`\> ; `then?`: (`result`: `any`) => `void`  } | Submit to FaasJS server. If use onFinish, you should call submit manually. ```ts { submit: { to: { action: 'action_name' } }, onFinish: (values, submit) => { // do something before submit // submit await submit({ ...values, extraProps: 'some extra props' }) // do something after submit } } ``` |
| `to.action` | `string` | - |
| `to.catch?` | (`error`: `any`) => `void` | - |
| `to.finally?` | () => `void` | - |
| `to.params?` | `Record`<`string`, `any`\> | params will overwrite form values before submit |
| `to.then?` | (`result`: `any`) => `void` | - |

___

### LoadingProps

Ƭ **LoadingProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `React.ReactNode` |
| `loading?` | `boolean` |
| `size?` | ``"small"`` \| ``"default"`` \| ``"large"`` |
| `style?` | `React.CSSProperties` |

___

### TableProps

Ƭ **TableProps**<`T`, `ExtendTypes`\>: { `extendTypes?`: { `[key: string]`: [`ExtendTableTypeProps`](#extendtabletypeprops);  } ; `faasData?`: [`FaasDataWrapperProps`](#faasdatawrapperprops)<`T`\> ; `items`: ([`TableItemProps`](interfaces/TableItemProps.md) \| `ExtendTypes` & [`ExtendTableItemProps`](#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`<`string`, `FilterValue` \| ``null``\>, `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[], `extra`: `TableCurrentDataSource`<`T`\>) => { `extra`: `TableCurrentDataSource`<`T`\> ; `filters`: `Record`<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[]  }  } & `AntdTableProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

___

### UnionFaasItemElement

Ƭ **UnionFaasItemElement**<`Value`, `Values`\>: `ReactElement`<[`UnionFaasItemInjection`](#unionfaasiteminjection)<`Value`, `Values`\>\> \| ``null``

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

___

### UnionFaasItemInjection

Ƭ **UnionFaasItemInjection**<`Value`, `Values`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index?` | `number` |
| `scene?` | [`UnionScene`](#unionscene) |
| `value?` | `Value` |
| `values?` | `Values` |

___

### UnionFaasItemRender

Ƭ **UnionFaasItemRender**<`Value`, `Values`\>: (`value`: `Value`, `values`: `Values`, `index`: `number`, `scene`: [`UnionScene`](#unionscene)) => `JSX.Element` \| ``null``

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

#### Type declaration

▸ (`value`, `values`, `index`, `scene`): `JSX.Element` \| ``null``

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Value` |
| `values` | `Values` |
| `index` | `number` |
| `scene` | [`UnionScene`](#unionscene) |

##### Returns

`JSX.Element` \| ``null``

___

### UnionScene

Ƭ **UnionScene**: ``"form"`` \| ``"description"`` \| ``"table"``

___

### setDrawerProps

Ƭ **setDrawerProps**: (`changes`: `Partial`<[`DrawerProps`](interfaces/DrawerProps.md)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`<[`DrawerProps`](interfaces/DrawerProps.md)\> |

##### Returns

`void`

___

### setModalProps

Ƭ **setModalProps**: (`changes`: `Partial`<[`ModalProps`](interfaces/ModalProps.md)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`<[`ModalProps`](interfaces/ModalProps.md)\> |

##### Returns

`void`

## Variables

### ConfigContext

• `Const` **ConfigContext**: `Context`<[`ConfigProviderProps`](interfaces/ConfigProviderProps.md)\>

## Functions

### Blank

▸ **Blank**(`options?`): `JSX.Element`

Blank component.

If value is undefined or null, return text, otherwise return value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`BlankProps`](interfaces/BlankProps.md) | {object} |

#### Returns

`JSX.Element`

```ts
<Blank value={undefined} text="Empty" />
```

___

### ConfigProvider

▸ **ConfigProvider**(`«destructured»`): `Element`

Config for @faasjs/ant-design components.

```ts
<ConfigProvider config={{
  common: {
    blank: 'Empty',
  },
}}>
  <Blank />
</ConfigProvider>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `children` | `ReactNode` |
| › `config` | [`ConfigProviderProps`](interfaces/ConfigProviderProps.md) |

#### Returns

`Element`

___

### Description

▸ **Description**<`T`\>(`props`): `Element`

Description component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`DescriptionProps`](interfaces/DescriptionProps.md)<`T`, `any`\> |

#### Returns

`Element`

___

### FaasDataWrapper

▸ **FaasDataWrapper**<`T`\>(`props`): `JSX.Element`

FaasDataWrapper component with Loading and ErrorBoundary

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](#faasdatawrapperprops)<`T`\> |

#### Returns

`JSX.Element`

___

### Form

▸ **Form**<`Values`\>(`props`): `Element`

Form component with Ant Design & FaasJS

**`Ref`**

https://ant.design/components/form/

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormProps`](interfaces/FormProps.md)<`Values`, `any`\> |

#### Returns

`Element`

___

### FormItem

▸ **FormItem**<`T`\>(`props`): `Element`

FormItem, can be used without Form.

```ts
// use inline type
<FormItem type='string' id='name' />

// use custom type
<FormItem id='password'>
  <Input.Password />
</>
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormItemProps`](interfaces/FormItemProps.md)<`T`\> |

#### Returns

`Element`

___

### Link

▸ **Link**(`«destructured»`): `Element`

Link component with button.

```ts
// pure link
<Link href="/">Home</Link>

// link with button
<Link href="/" button={{ type:'primary' }}>Home</Link>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`LinkProps`](interfaces/LinkProps.md) |

#### Returns

`Element`

___

### Loading

▸ **Loading**(`props`): `Element`

Loading component based on Spin

```tsx
<Loading /> // display loading

<Loading loading={ !remoteData }>
 <div>{remoteData}</div>
</Loading>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`LoadingProps`](#loadingprops) |

#### Returns

`Element`

___

### PageNotFound

▸ **PageNotFound**(): `Element`

#### Returns

`Element`

___

### Routes

▸ **Routes**(`props`): `Element`

Routes with lazy loading and 404 page.

```tsx
import { lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'

export function App () {
  return <BrowserRouter>
    <Routes routes={[
      {
        path: '/',
        page: lazy(() => import('./pages/home'))
      }
    ]} />
  </BrowserRouter>
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`RoutesProps`](interfaces/RoutesProps.md) |

#### Returns

`Element`

___

### Table

▸ **Table**<`T`, `ExtendTypes`\>(`props`): `Element`

Table component with Ant Design & FaasJS

**`Ref`**

https://ant.design/components/table/

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |
| `ExtendTypes` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TableProps`](#tableprops)<`T`, `ExtendTypes`\> |

#### Returns

`Element`

___

### Title

▸ **Title**(`props`): `JSX.Element`

Title is used to change the title of the page.
Return null by default.

```ts
// return null
<Title title='hi' /> // => change the document.title to 'hi'
<Title title={['a', 'b']} /> // => change the document.title to 'a - b'

// return h1
<Title title='hi' h1 /> // => <h1>hi</h1>
<Title title={['a', 'b']} h1 /> // => <h1>a</h1>

// return children
<Title title='hi'><CustomTitle /></Title> // => <CustomTitle />
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TitleProps`](interfaces/TitleProps.md) |

#### Returns

`JSX.Element`

___

### transferOptions

▸ **transferOptions**(`options`): { `label`: `string` ; `value?`: `string` \| `number`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BaseOption`](#baseoption)[] |

#### Returns

{ `label`: `string` ; `value?`: `string` \| `number`  }[]

___

### transferValue

▸ **transferValue**(`type`, `value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`FaasItemType`](#faasitemtype) |
| `value` | `any` |

#### Returns

`any`

___

### useConfigContext

▸ **useConfigContext**(): [`ConfigProviderProps`](interfaces/ConfigProviderProps.md)

#### Returns

[`ConfigProviderProps`](interfaces/ConfigProviderProps.md)

___

### useDrawer

▸ **useDrawer**(`init?`): `Object`

Hook style drawer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init?` | [`DrawerProps`](interfaces/DrawerProps.md) | initial props ```ts function Example() { const { drawer, setDrawerProps } = useDrawer() return <> <Button onClick={ () => setDrawerProps(prev => ({ open: !prev.open})) }> Toggle </Button> {drawer} </> } ``` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `drawer` | `Element` |
| `drawerProps` | [`DrawerProps`](interfaces/DrawerProps.md) |
| `setDrawerProps` | (`changes`: `Partial`<[`DrawerProps`](interfaces/DrawerProps.md)\>) => `void` |

___

### useModal

▸ **useModal**(`init?`): `Object`

Hook style modal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init?` | [`ModalProps`](interfaces/ModalProps.md) | initial props ```ts function Example() { const { modal, setModalProps } = useModal() return <> <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button> {modal}</> } ``` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `modal` | `Element` |
| `modalProps` | [`ModalProps`](interfaces/ModalProps.md) |
| `setModalProps` | (`changes`: `Partial`<[`ModalProps`](interfaces/ModalProps.md)\>) => `void` |
