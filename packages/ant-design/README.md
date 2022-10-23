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
  'boolean'

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

### Type Aliases

- [BaseItemProps](#baseitemprops)
- [BaseOption](#baseoption)
- [BlankProps](#blankprops)
- [CalendarProps](#calendarprops)
- [ConfigProviderProps](#configproviderprops)
- [DatePickerProps](#datepickerprops)
- [DescriptionItemProps](#descriptionitemprops)
- [DescriptionProps](#descriptionprops)
- [DrawerProps](#drawerprops)
- [ExtendDescriptionItemProps](#extenddescriptionitemprops)
- [ExtendDescriptionTypeProps](#extenddescriptiontypeprops)
- [ExtendFormItemProps](#extendformitemprops)
- [ExtendFormTypeProps](#extendformtypeprops)
- [ExtendTableItemProps](#extendtableitemprops)
- [ExtendTableTypeProps](#extendtabletypeprops)
- [ExtendTypes](#extendtypes)
- [FaasItemProps](#faasitemprops)
- [FaasItemType](#faasitemtype)
- [FaasItemTypeValue](#faasitemtypevalue)
- [FormItemProps](#formitemprops)
- [FormProps](#formprops)
- [LinkProps](#linkprops)
- [ModalProps](#modalprops)
- [RoutesProps](#routesprops)
- [TableItemProps](#tableitemprops)
- [TableProps](#tableprops)
- [TimePickerProps](#timepickerprops)
- [TitleProps](#titleprops)
- [setDrawerProps](#setdrawerprops)
- [setModalProps](#setmodalprops)

### Variables

- [ConfigContext](#configcontext)
- [DatePicker](#datepicker)

### Functions

- [Blank](#blank)
- [Calendar](#calendar)
- [ConfigProvider](#configprovider)
- [Description](#description)
- [Form](#form)
- [FormItem](#formitem)
- [Link](#link)
- [PageNotFound](#pagenotfound)
- [Routes](#routes)
- [Table](#table)
- [TimePicker](#timepicker)
- [Title](#title)
- [transferOptions](#transferoptions)
- [useConfigContext](#useconfigcontext)
- [useDrawer](#usedrawer)
- [useModal](#usemodal)

## Type Aliases

### BaseItemProps

Ƭ **BaseItemProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options?` | [`BaseOption`](#baseoption)[] |
| `title?` | `string` |

___

### BaseOption

Ƭ **BaseOption**: `string` \| `number` \| { `label`: `string` ; `value?`: `string` \| `number`  }

___

### BlankProps

Ƭ **BlankProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `text?` | `string` |
| `value?` | `any` |

___

### CalendarProps

Ƭ **CalendarProps**: `AntdProps`<`Dayjs`\>

___

### ConfigProviderProps

Ƭ **ConfigProviderProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Blank?` | { `text?`: `string`  } |
| `Blank.text?` | `string` |
| `Form?` | { `submit?`: { `text?`: `string`  }  } |
| `Form.submit?` | { `text?`: `string`  } |
| `Form.submit.text?` | `string` |
| `Link?` | { `style?`: `CSSProperties` ; `target?`: `string`  } |
| `Link.style?` | `CSSProperties` |
| `Link.target?` | `string` |
| `Title?` | { `separator?`: `string` ; `suffix?`: `string`  } |
| `Title.separator?` | `string` |
| `Title.suffix?` | `string` |
| `antd?` | `AntdConfigProviderProps` |
| `common?` | { `add?`: `string` ; `all?`: `string` ; `blank?`: `string` ; `delete?`: `string` ; `pageNotFound?`: `string` ; `required?`: `string` ; `reset?`: `string` ; `search?`: `string` ; `submit?`: `string`  } |
| `common.add?` | `string` |
| `common.all?` | `string` |
| `common.blank?` | `string` |
| `common.delete?` | `string` |
| `common.pageNotFound?` | `string` |
| `common.required?` | `string` |
| `common.reset?` | `string` |
| `common.search?` | `string` |
| `common.submit?` | `string` |
| `lang?` | `string` |

___

### DatePickerProps

Ƭ **DatePickerProps**: `PickerDateProps`<`Dayjs`\>

___

### DescriptionItemProps

Ƭ **DescriptionItemProps**<`T`\>: { `children?`: `JSX.Element` ; `render?`: (`value`: `T`, `values`: `any`) => `JSX.Element` \| `string` \| `number` \| `boolean` \| ``null``  } & [`FaasItemProps`](#faasitemprops)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### DescriptionProps

Ƭ **DescriptionProps**<`T`, `ExtendItemProps`\>: { `dataSource?`: `T` ; `extendTypes?`: { `[key: string]`: [`ExtendDescriptionTypeProps`](#extenddescriptiontypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`DescriptionItemProps`](#descriptionitemprops) \| `ExtendItemProps`)[] ; `renderTitle?`: (`values`: `T`) => `ReactNode`  } & `DescriptionsProps`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendItemProps` | `any` |

___

### DrawerProps

Ƭ **DrawerProps**: `AntdDrawerProps` & { `children?`: `JSX.Element` \| `JSX.Element`[]  }

___

### ExtendDescriptionItemProps

Ƭ **ExtendDescriptionItemProps**: [`BaseItemProps`](#baseitemprops)

___

### ExtendDescriptionTypeProps

Ƭ **ExtendDescriptionTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |
| `render?` | (`value`: `any`, `values`: `any`) => `JSX.Element` \| `string` \| `number` \| `boolean` \| ``null`` |

___

### ExtendFormItemProps

Ƭ **ExtendFormItemProps**: [`BaseItemProps`](#baseitemprops) & `AntdFormItemProps`

___

### ExtendFormTypeProps

Ƭ **ExtendFormTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |

___

### ExtendTableItemProps

Ƭ **ExtendTableItemProps**<`T`\>: [`BaseItemProps`](#baseitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### ExtendTableTypeProps

Ƭ **ExtendTableTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |
| `render?` | (`value`: `any`, `values`: `any`, `index`: `number`) => `JSX.Element` \| `string` \| `number` \| `boolean` \| ``null`` |

___

### ExtendTypes

Ƭ **ExtendTypes**: `Object`

#### Index signature

▪ [type: `string`]: [`ExtendFormTypeProps`](#extendformtypeprops)

___

### FaasItemProps

Ƭ **FaasItemProps**: [`BaseItemProps`](#baseitemprops) & { `type?`: [`FaasItemType`](#faasitemtype)  }

___

### FaasItemType

Ƭ **FaasItemType**: ``"string"`` \| ``"string[]"`` \| ``"number"`` \| ``"number[]"`` \| ``"boolean"`` \| ``"date"`` \| ``"time"`` \| ``"object"`` \| ``"object[]"``

___

### FaasItemTypeValue

Ƭ **FaasItemTypeValue**: `Object`

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

### FormItemProps

Ƭ **FormItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null`` ; `extendTypes?`: [`ExtendTypes`](#extendtypes) ; `label?`: `string` \| ``false`` ; `render?`: () => `JSX.Element` \| ``null`` ; `rules?`: `RuleObject`[]  } & `FormItemInputProps` & [`FaasItemProps`](#faasitemprops) & `Omit`<`AntdFormItemProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FormProps

Ƭ **FormProps**<`Values`, `ExtendItemProps`\>: { `beforeItems?`: `JSX.Element` \| `JSX.Element`[] ; `children?`: `ReactNode` ; `extendTypes?`: [`ExtendTypes`](#extendtypes) ; `footer?`: `JSX.Element` \| `JSX.Element`[] ; `items?`: ([`FormItemProps`](#formitemprops) \| `ExtendItemProps`)[] ; `onFinish?`: (`values`: `Values`, `submit?`: (`values`: `any`) => `Promise`<`any`\>) => `Promise`<`any`\> ; `submit?`: ``false`` \| { `text?`: `string` ; `to?`: { `action`: `string` ; `params?`: `Record`<`string`, `any`\>  }  }  } & `Omit`<`AntdFormProps`<`Values`\>, ``"onFinish"`` \| ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |
| `ExtendItemProps` | `any` |

___

### LinkProps

Ƭ **LinkProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `button?` | `ButtonProps` |
| `children?` | `ReactNode` |
| `href` | `string` |
| `style?` | `CSSProperties` |
| `target?` | `string` |
| `text?` | `string` \| `number` |

___

### ModalProps

Ƭ **ModalProps**: `AntdModalProps` & { `children?`: `JSX.Element` \| `JSX.Element`[] \| `string`  }

___

### RoutesProps

Ƭ **RoutesProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fallback?` | `JSX.Element` |
| `notFound?` | `JSX.Element` |
| `routes` | `RouteProps` & { `page?`: `LazyExoticComponent`<`ComponentType`<`any`\>\>  }[] |

___

### TableItemProps

Ƭ **TableItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null`` ; `optionsType?`: ``"auto"``  } & [`FaasItemProps`](#faasitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### TableProps

Ƭ **TableProps**<`T`, `ExtendTypes`\>: { `extendTypes?`: { `[key: string]`: [`ExtendTableTypeProps`](#extendtabletypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`TableItemProps`](#tableitemprops) \| `ExtendTypes` & [`ExtendTableItemProps`](#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`<`string`, `FilterValue` \| ``null``\>, `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[], `extra`: `TableCurrentDataSource`<`T`\>) => { `extra`: `TableCurrentDataSource`<`T`\> ; `filters`: `Record`<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[]  }  } & `AntdTableProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

___

### TimePickerProps

Ƭ **TimePickerProps**: `Omit`<`PickerTimeProps`<`Dayjs`\>, ``"picker"``\>

___

### TitleProps

Ƭ **TitleProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `children?` | `JSX.Element` | return children |
| `h1?` | `boolean` \| { `className?`: `string` ; `style?`: `React.CSSProperties`  } | return a h1 element |
| `header?` | `PageHeaderProps` | return a PageHeader element |
| `plain?` | `boolean` | return a pure text element |
| `separator?` | `string` | ` - ` as default |
| `suffix?` | `string` | - |
| `title` | `string` \| `string`[] | - |

___

### setDrawerProps

Ƭ **setDrawerProps**: (`changes`: `Partial`<[`DrawerProps`](#drawerprops)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`<[`DrawerProps`](#drawerprops)\> |

##### Returns

`void`

___

### setModalProps

Ƭ **setModalProps**: (`changes`: `Partial`<[`ModalProps`](#modalprops)\>) => `void`

#### Type declaration

▸ (`changes`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `changes` | `Partial`<[`ModalProps`](#modalprops)\> |

##### Returns

`void`

## Variables

### ConfigContext

• `Const` **ConfigContext**: `Context`<[`ConfigProviderProps`](#configproviderprops)\>

___

### DatePicker

• `Const` **DatePicker**: `PickerComponentClass`<`Object`, `unknown`\> & {}

## Functions

### Blank

▸ **Blank**(`options?`): `any`

If value is undefined or null, return text, otherwise return value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`BlankProps`](#blankprops) | {object} |

#### Returns

`any`

```ts
<Blank value={undefined} text="Empty" />
```

___

### Calendar

▸ **Calendar**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `CalendarProps`<`Dayjs`\> |

#### Returns

`Element`

___

### ConfigProvider

▸ **ConfigProvider**(`__namedParameters`): `Element`

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
| `__namedParameters` | `Object` |
| `__namedParameters.children` | `ReactNode` |
| `__namedParameters.config` | [`ConfigProviderProps`](#configproviderprops) |

#### Returns

`Element`

___

### Description

▸ **Description**<`T`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`DescriptionProps`](#descriptionprops)<`T`, `any`\> |

#### Returns

`Element`

___

### Form

▸ **Form**<`Values`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormProps`](#formprops)<`Values`, `any`\> |

#### Returns

`Element`

___

### FormItem

▸ **FormItem**<`T`\>(`props`): `Element`

FormItem, can be used without Form.

```ts
// use inline type
<FormItem item={{ type: 'string', id: 'name' }} />

// use custom type
<FormItem item={{ id: 'password' }}>
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
| `props` | [`FormItemProps`](#formitemprops)<`T`\> |

#### Returns

`Element`

___

### Link

▸ **Link**(`__namedParameters`): `Element`

```ts
// pure link
<Link href="/">Home</Link>

// link with button
<Link href="/" button={{type:'primary'}}>Home</Link>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`LinkProps`](#linkprops) |

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
| `props` | [`RoutesProps`](#routesprops) |

#### Returns

`Element`

___

### Table

▸ **Table**<`T`, `ExtendTypes`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TableProps`](#tableprops)<`T`, `ExtendTypes`\> |

#### Returns

`Element`

___

### TimePicker

▸ **TimePicker**(`props`): `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TimePickerProps`](#timepickerprops) & `RefAttributes`<`any`\> |

#### Returns

`ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

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
| `props` | [`TitleProps`](#titleprops) |

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

### useConfigContext

▸ **useConfigContext**(): [`ConfigProviderProps`](#configproviderprops)

#### Returns

[`ConfigProviderProps`](#configproviderprops)

___

### useDrawer

▸ **useDrawer**(`init?`): `Object`

Hook style drawer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init?` | [`DrawerProps`](#drawerprops) | initial props  ```ts function Example() {   const { drawer, setDrawerProps } = useDrawer()    return <>     <Button onClick={ () => setDrawerProps(prev => ({ open: !prev.open})) }>       Toggle     </Button>     {drawer}   </> } ``` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `drawer` | `Element` |
| `drawerProps` | [`DrawerProps`](#drawerprops) |
| `setDrawerProps` | (`changes`: `Partial`<[`DrawerProps`](#drawerprops)\>) => `void` |

___

### useModal

▸ **useModal**(`init?`): `Object`

Hook style modal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init?` | [`ModalProps`](#modalprops) | initial props  ```ts function Example() {   const { modal, setModalProps } = useModal()    return <>     <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button>     {modal}</> } ``` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `modal` | `Element` |
| `modalProps` | [`ModalProps`](#modalprops) |
| `setModalProps` | (`changes`: `Partial`<[`ModalProps`](#modalprops)\>) => `void` |
