# @faasjs/ant-design

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

UI components based on [FaasJS](https://faasjs.com), [Ant Design](https://ant.design) and [React Router](https://reactrouter.com).

## Install

```sh
npm install @faasjs/ant-design
```

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

### Interfaces

- [AppProps](interfaces/AppProps.md)
- [BaseItemProps](interfaces/BaseItemProps.md)
- [BlankProps](interfaces/BlankProps.md)
- [ConfigProviderProps](interfaces/ConfigProviderProps.md)
- [DescriptionItemContentProps](interfaces/DescriptionItemContentProps.md)
- [DescriptionItemProps](interfaces/DescriptionItemProps.md)
- [DescriptionProps](interfaces/DescriptionProps.md)
- [DrawerProps](interfaces/DrawerProps.md)
- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)
- [ExtendDescriptionTypeProps](interfaces/ExtendDescriptionTypeProps.md)
- [FaasDataWrapperProps](interfaces/FaasDataWrapperProps.md)
- [FaasItemProps](interfaces/FaasItemProps.md)
- [FormItemProps](interfaces/FormItemProps.md)
- [FormProps](interfaces/FormProps.md)
- [LinkProps](interfaces/LinkProps.md)
- [ModalProps](interfaces/ModalProps.md)
- [RoutesProps](interfaces/RoutesProps.md)
- [TabProps](interfaces/TabProps.md)
- [TableItemProps](interfaces/TableItemProps.md)
- [TabsProps](interfaces/TabsProps.md)
- [TitleProps](interfaces/TitleProps.md)
- [UnionFaasItemProps](interfaces/UnionFaasItemProps.md)
- [useAppProps](interfaces/useAppProps.md)

### Type Aliases

- [BaseOption](#baseoption)
- [ExtendDescriptionItemProps](#extenddescriptionitemprops)
- [ExtendFormItemProps](#extendformitemprops)
- [ExtendFormTypeProps](#extendformtypeprops)
- [ExtendTableItemProps](#extendtableitemprops)
- [ExtendTableTypeProps](#extendtabletypeprops)
- [ExtendTypes](#extendtypes)
- [FaasDataInjection](#faasdatainjection)
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

- [App](#app)
- [Blank](#blank)
- [ConfigProvider](#configprovider)
- [Description](#description)
- [ErrorBoundary](#errorboundary)
- [FaasDataWrapper](#faasdatawrapper)
- [Form](#form)
- [FormItem](#formitem)
- [Link](#link)
- [Loading](#loading)
- [PageNotFound](#pagenotfound)
- [Routes](#routes)
- [Table](#table)
- [Tabs](#tabs)
- [Title](#title)
- [faas](#faas)
- [transferOptions](#transferoptions)
- [transferValue](#transfervalue)
- [useApp](#useapp)
- [useConfigContext](#useconfigcontext)
- [useDrawer](#usedrawer)
- [useFaas](#usefaas)
- [useModal](#usemodal)

## Type Aliases

### BaseOption

Ƭ **BaseOption**: `string` \| `number` \| \{ `label`: `string` ; `value?`: `any`  }

___

### ExtendDescriptionItemProps

Ƭ **ExtendDescriptionItemProps**: [`BaseItemProps`](interfaces/BaseItemProps.md)

___

### ExtendFormItemProps

Ƭ **ExtendFormItemProps**: [`BaseItemProps`](interfaces/BaseItemProps.md) & `AntdFormItemProps`

___

### ExtendFormTypeProps

Ƭ **ExtendFormTypeProps**\<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | [`UnionFaasItemElement`](#unionfaasitemelement)\<`T`\> |

___

### ExtendTableItemProps

Ƭ **ExtendTableItemProps**\<`T`\>: [`BaseItemProps`](interfaces/BaseItemProps.md) & `Omit`\<`AntdTableColumnProps`\<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### ExtendTableTypeProps

Ƭ **ExtendTableTypeProps**\<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` |
| `render?` | [`UnionFaasItemRender`](#unionfaasitemrender)\<`T`\> |

___

### ExtendTypes

Ƭ **ExtendTypes**: `Object`

#### Index signature

▪ [type: `string`]: [`ExtendFormTypeProps`](#extendformtypeprops)

___

### FaasDataInjection

Ƭ **FaasDataInjection**\<`T`\>: `Partial`\<`OriginFaasDataInjection`\<`T`\>\>

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
| `to?` | \{ `action`: `string` ; `catch?`: (`error`: `any`) => `void` ; `finally?`: () => `void` ; `params?`: `Record`\<`string`, `any`\> ; `then?`: (`result`: `any`) => `void`  } | Submit to FaasJS server. If use onFinish, you should call submit manually. ```ts { submit: { to: { action: 'action_name' } }, onFinish: (values, submit) => { // do something before submit // submit await submit({ ...values, extraProps: 'some extra props' }) // do something after submit } } ``` |
| `to.action` | `string` | - |
| `to.catch?` | (`error`: `any`) => `void` | - |
| `to.finally?` | () => `void` | - |
| `to.params?` | `Record`\<`string`, `any`\> | params will overwrite form values before submit |
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

Ƭ **TableProps**\<`T`, `ExtendTypes`\>: \{ `extendTypes?`: \{ `[key: string]`: [`ExtendTableTypeProps`](#extendtabletypeprops);  } ; `faasData?`: [`FaasDataWrapperProps`](interfaces/FaasDataWrapperProps.md)\<`T`\> ; `items`: ([`TableItemProps`](interfaces/TableItemProps.md) \| `ExtendTypes` & [`ExtendTableItemProps`](#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`\<`string`, `FilterValue` \| ``null``\>, `sorter`: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[], `extra`: `TableCurrentDataSource`\<`T`\>) => \{ `extra`: `TableCurrentDataSource`\<`T`\> ; `filters`: `Record`\<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]  }  } & `AntdTableProps`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

___

### UnionFaasItemElement

Ƭ **UnionFaasItemElement**\<`Value`, `Values`\>: `ReactElement`\<[`UnionFaasItemInjection`](#unionfaasiteminjection)\<`Value`, `Values`\>\> \| ``null``

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

___

### UnionFaasItemInjection

Ƭ **UnionFaasItemInjection**\<`Value`, `Values`\>: `Object`

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

Ƭ **UnionFaasItemRender**\<`Value`, `Values`\>: (`value`: `Value`, `values`: `Values`, `index`: `number`, `scene`: [`UnionScene`](#unionscene)) => `React.ReactNode`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

#### Type declaration

▸ (`value`, `values`, `index`, `scene`): `React.ReactNode`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Value` |
| `values` | `Values` |
| `index` | `number` |
| `scene` | [`UnionScene`](#unionscene) |

##### Returns

`React.ReactNode`

___

### UnionScene

Ƭ **UnionScene**: ``"form"`` \| ``"description"`` \| ``"table"``

___

### setDrawerProps

Ƭ **setDrawerProps**: (`changes`: `Partial`\<[`DrawerProps`](interfaces/DrawerProps.md)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`\<[`DrawerProps`](interfaces/DrawerProps.md)\> |

##### Returns

`void`

___

### setModalProps

Ƭ **setModalProps**: (`changes`: `Partial`\<[`ModalProps`](interfaces/ModalProps.md)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`\<[`ModalProps`](interfaces/ModalProps.md)\> |

##### Returns

`void`

## Variables

### ConfigContext

• `Const` **ConfigContext**: `Context`\<`Partial`\<[`ConfigProviderProps`](interfaces/ConfigProviderProps.md)\>\>

## Functions

### App

▸ **App**(`props`): `Element`

App component with Ant Design & FaasJS

- Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/) and [StyleProvider](https://ant.design/components/style-provider/).
- Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
- Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
- Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
- Integrated React Router's [BrowserRouter](https://reactrouter.com/en/router-components/browser-router).

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`AppProps`](interfaces/AppProps.md) |

#### Returns

`Element`

**`Example`**

```tsx
import { App } from '@faasjs/ant-design'

export default function () {
  return (
    <App
     styleProviderProps={{}} // https://ant.design/docs/react/compatible-style#styleprovider
     configProviderProps={{}} // https://ant.design/components/config-provider/#API
     browserRouterProps={{}} // https://reactrouter.com/en/router-components/browser-router
     errorBoundaryProps={{}} // https://faasjs.com/doc/ant-design/#errorboundary
     faasConfigProviderProps={{}} // https://faasjs.com/doc/ant-design/#configprovider
    >
      <div>content</div>
    </App>
  )
```

___

### Blank

▸ **Blank**(`options?`): `JSX.Element`

Blank component.

If value is undefined or null, return text, otherwise return value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BlankProps`](interfaces/BlankProps.md) |

#### Returns

`JSX.Element`

**`Example`**

```tsx
import { Blank } from '@faasjs/ant-design'

<Blank value={undefined} text="Empty" />
```

___

### ConfigProvider

▸ **ConfigProvider**(`props`): `Element`

Config for `@faasjs/ant-design` components.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ConfigProviderProps`](interfaces/ConfigProviderProps.md) |

#### Returns

`Element`

**`Example`**

```tsx
import { ConfigProvider } from '@faasjs/ant-design'

<ConfigProvider theme={{ common: { blank: 'Empty' } }}>
  <Blank />
</ConfigProvider>
```

___

### Description

▸ **Description**\<`T`\>(`props`): `Element`

Description component

- Based on [Ant Design Descriptions](https://ant.design/components/descriptions/).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`DescriptionProps`](interfaces/DescriptionProps.md)\<`T`, `any`\> |

#### Returns

`Element`

**`Example`**

```tsx
import { Description } from '@faasjs/ant-design'

<Description
  title="Title"
  items={[
    {
      id: 'id',
      title: 'Title',
      type: 'string',
    },
  ]}
  dataSource={{ id: 'value' }}
/>
```

___

### ErrorBoundary

▸ **ErrorBoundary**(`props`): `Element`

Styled error boundary.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ErrorBoundaryProps`](interfaces/ErrorBoundaryProps.md) |

#### Returns

`Element`

___

### FaasDataWrapper

▸ **FaasDataWrapper**\<`T`\>(`props`): `JSX.Element`

FaasDataWrapper component with Loading

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](interfaces/FaasDataWrapperProps.md)\<`T`\> |

#### Returns

`JSX.Element`

**`Example`**

```tsx
function MyComponent (props: FaasDataInjection) {
  return <div>{ props.data }</div>
}

function MyPage () {
  return <FaasDataWrapper action="test" params={{ a: 1 }}>
    <MyComponent />
  </FaasDataWrapper>
}
```

___

### Form

▸ **Form**\<`Values`\>(`props`): `Element`

Form component with Ant Design & FaasJS

- Based on [Ant Design Form](https://ant.design/components/form/).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormProps`](interfaces/FormProps.md)\<`Values`, `any`\> |

#### Returns

`Element`

___

### FormItem

▸ **FormItem**\<`T`\>(`props`): `Element`

FormItem

- Based on [Ant Design Form.Item](https://ant.design/components/form#formitem).
- Can be used without [Form](https://faasjs.com/doc/ant-design/#form).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormItemProps`](interfaces/FormItemProps.md)\<`T`\> |

#### Returns

`Element`

**`Example`**

```tsx
// use inline type
<FormItem type='string' id='name' />

// use custom type
<FormItem id='password'>
  <Input.Password />
</>
```

___

### Link

▸ **Link**(`props`): `Element`

Link component with button

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`LinkProps`](interfaces/LinkProps.md) |

#### Returns

`Element`

**`Example`**

```tsx
// pure link
<Link href="/">Home</Link>

// link with button
<Link href="/" button={{ type:'primary' }}>Home</Link>
```

___

### Loading

▸ **Loading**(`props`): `Element`

Loading component based on Spin

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`LoadingProps`](#loadingprops) |

#### Returns

`Element`

**`Example`**

```tsx
<Loading /> // display loading

<Loading loading={ !remoteData }>
  <div>{remoteData}</div>
</Loading>
```

___

### PageNotFound

▸ **PageNotFound**(): `Element`

#### Returns

`Element`

___

### Routes

▸ **Routes**(`props`): `Element`

Routes with lazy loading and 404 page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`RoutesProps`](interfaces/RoutesProps.md) |

#### Returns

`Element`

**`Example`**

```tsx
import { Routes, lazy } from '@faasjs/ant-design'
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

___

### Table

▸ **Table**\<`T`, `ExtendTypes`\>(`props`): `Element`

Table component with Ant Design & FaasJS

- Based on [Ant Design Table](https://ant.design/components/table/).
- Support FaasJS injection.
- Auto generate filter dropdown (disable with `filterDropdown: false`).
- Auto generate sorter (disable with `sorter: false`).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`\<`string`, `any`\> |
| `ExtendTypes` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TableProps`](#tableprops)\<`T`, `ExtendTypes`\> |

#### Returns

`Element`

___

### Tabs

▸ **Tabs**(`props`): `Element`

Tabs component with Ant Design & FaasJS

- Based on [Ant Design Tabs](https://ant.design/components/tabs/).
- Support auto skip null/false tab item.
- Support `id` as key and label.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TabsProps`](interfaces/TabsProps.md) |

#### Returns

`Element`

**`Example`**

```tsx
import { Tabs } from '@faasjs/ant-design'

<Tabs
  items={[
    {
      id: 'id',
      children: 'content',
    },
    1 === 0 && {
      id: 'hidden',
      children: 'content',
    },
  ]}
/>
```

___

### Title

▸ **Title**(`props`): `JSX.Element`

Title is used to change the title of the page

Return null by default.

```tsx
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

### faas

▸ **faas**\<`PathOrData`\>(`action`, `params`): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Request faas server

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`\<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `params` | `FaasParams`\<`PathOrData`\> | {object} action params |

#### Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

**`Example`**

```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```

___

### transferOptions

▸ **transferOptions**(`options`): \{ `label`: `string` ; `value?`: `string` \| `number`  }[]

convert string[] or number[] to { label, value }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BaseOption`](#baseoption)[] |

#### Returns

\{ `label`: `string` ; `value?`: `string` \| `number`  }[]

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

### useApp

▸ **useApp**(): [`useAppProps`](interfaces/useAppProps.md)

Get app context.

```ts
import { useApp } from '@faasjs/ant-design'

const { message, notification, setModalProps, setDrawerProps } = useApp()
```

#### Returns

[`useAppProps`](interfaces/useAppProps.md)

___

### useConfigContext

▸ **useConfigContext**(): `Partial`\<[`ConfigProviderProps`](interfaces/ConfigProviderProps.md)\>

#### Returns

`Partial`\<[`ConfigProviderProps`](interfaces/ConfigProviderProps.md)\>

___

### useDrawer

▸ **useDrawer**(`init?`): `Object`

Hook style drawer

```tsx
function Example() {
  const { drawer, setDrawerProps } = useDrawer()

  return <>
    <Button onClick={ () => setDrawerProps(prev => ({ open: !prev.open})) }>
      Toggle
    </Button>
    {drawer}
  </>
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `init?` | [`DrawerProps`](interfaces/DrawerProps.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `drawer` | `Element` |
| `drawerProps` | [`DrawerProps`](interfaces/DrawerProps.md) |
| `setDrawerProps` | (`changes`: `Partial`\<[`DrawerProps`](interfaces/DrawerProps.md)\>) => `void` |

___

### useFaas

▸ **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options?`): `FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

Request faas server with React hook

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`\<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `defaultParams` | `FaasParams`\<`PathOrData`\> | {object} initial action params |
| `options?` | `useFaasOptions`\<`PathOrData`\> | - |

#### Returns

`FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

**`Example`**

```tsx
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```

___

### useModal

▸ **useModal**(`init?`): `Object`

Hook style modal

```tsx
function Example() {
  const { modal, setModalProps } = useModal()

  return <>
    <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button>
    {modal}
  </>
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `init?` | [`ModalProps`](interfaces/ModalProps.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `modal` | `Element` |
| `modalProps` | [`ModalProps`](interfaces/ModalProps.md) |
| `setModalProps` | (`changes`: `Partial`\<[`ModalProps`](interfaces/ModalProps.md)\>) => `void` |
