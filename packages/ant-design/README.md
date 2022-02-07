# @faasjs/ant-design

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

UI components based on [FaasJS](https://faasjs.com) and [Ant Design](https://ant.design).

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

<iframe src="https://codesandbox.io/embed/recursing-lumiere-8wn11" style="width:100%;height:500px;border:0;overflow:hidden;" title="faasjs-ant-design-form" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### FormItem

Form are based on [Ant Design's Form.Item component](https://ant.design/components/form/#Form.Item).

<iframe src="https://codesandbox.io/embed/faasjs-ant-design-formitem-olqg5" style="width:100%;height:500px;border:0;overflow:hidden;" title="faasjs-ant-design-formitem" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## Modules

### Namespaces

- [Form](modules/Form.md)

### Type aliases

- [BaseItemProps](#baseitemprops)
- [BaseOption](#baseoption)
- [BlankProps](#blankprops)
- [DescriptionItemProps](#descriptionitemprops)
- [DescriptionProps](#descriptionprops)
- [DrawerProps](#drawerprops)
- [ExtendDescriptionItemProps](#extenddescriptionitemprops)
- [ExtendDescriptionTypeProps](#extenddescriptiontypeprops)
- [ExtendFormItemProps](#extendformitemprops)
- [ExtendFormTypeProps](#extendformtypeprops)
- [ExtendTableItemProps](#extendtableitemprops)
- [ExtendTableTypeProps](#extendtabletypeprops)
- [FaasItemProps](#faasitemprops)
- [FaasItemType](#faasitemtype)
- [FaasItemTypeValue](#faasitemtypevalue)
- [FaasState](#faasstate)
- [FormItemProps](#formitemprops)
- [FormProps](#formprops)
- [RoutesProps](#routesprops)
- [TableItemProps](#tableitemprops)
- [TableProps](#tableprops)
- [TitleProps](#titleprops)

### Functions

- [Blank](#blank)
- [Config](#config)
- [Description](#description)
- [Form](#form)
- [FormItem](#formitem)
- [Routes](#routes)
- [Table](#table)
- [Title](#title)
- [transferOptions](#transferoptions)
- [useDrawer](#usedrawer)
- [useFaasState](#usefaasstate)

## Type aliases

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

### DescriptionItemProps

Ƭ **DescriptionItemProps**<`T`\>: { `children?`: `JSX.Element` ; `render?`: (`value`: `T`, `values`: `any`) => `string` \| `number` \| `boolean` \| `Element`  } & [`FaasItemProps`](#faasitemprops)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### DescriptionProps

Ƭ **DescriptionProps**<`T`, `ExtendItemProps`\>: { `dataSource?`: `T` ; `extendTypes?`: { [key: string]: [`ExtendDescriptionTypeProps`](#extenddescriptiontypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`DescriptionItemProps`](#descriptionitemprops) \| `ExtendItemProps`)[]  } & `DescriptionsProps`

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
| `render?` | (`value`: `any`, `values`: `any`) => `string` \| `number` \| `boolean` \| `Element` |

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
| `render?` | (`value`: `any`, `values`: `any`, `index`: `number`) => `string` \| `number` \| `boolean` \| `Element` |

___

### FaasItemProps

Ƭ **FaasItemProps**: [`BaseItemProps`](#baseitemprops) & { `type?`: [`FaasItemType`](#faasitemtype)  }

___

### FaasItemType

Ƭ **FaasItemType**: ``"string"`` \| ``"string[]"`` \| ``"number"`` \| ``"number[]"`` \| ``"boolean"``

___

### FaasItemTypeValue

Ƭ **FaasItemTypeValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `boolean` | `boolean` |
| `number` | `number` |
| `number[]` | `number`[] |
| `string` | `string` |
| `string[]` | `string`[] |

___

### FaasState

Ƭ **FaasState**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Blank` | { `text`: `string`  } |
| `Blank.text` | `string` |
| `Form` | { `submit`: { `text`: `string`  }  } |
| `Form.submit` | { `text`: `string`  } |
| `Form.submit.text` | `string` |
| `Title` | { `separator`: `string` ; `suffix`: `string`  } |
| `Title.separator` | `string` |
| `Title.suffix` | `string` |
| `common` | { `all`: `string` ; `blank`: `string` ; `pageNotFound`: `string` ; `submit`: `string`  } |
| `common.all` | `string` |
| `common.blank` | `string` |
| `common.pageNotFound` | `string` |
| `common.submit` | `string` |

___

### FormItemProps

Ƭ **FormItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null`` ; `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](#extendformtypeprops);  } ; `label?`: `string` \| ``false`` ; `rules?`: `RuleObject`[] ; `render?`: () => `Element`  } & `FormItemInputProps`<`T`\> & [`FaasItemProps`](#faasitemprops) & `AntdFormItemProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FormProps

Ƭ **FormProps**<`Values`, `ExtendItemProps`\>: { `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](#extendformtypeprops);  } ; `items?`: ([`FormItemProps`](#formitemprops) \| `ExtendItemProps`)[] ; `submit?`: ``false`` \| { `text?`: `string`  }  } & `AntdFormProps`<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |
| `ExtendItemProps` | `any` |

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

Ƭ **TableItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null``  } & [`FaasItemProps`](#faasitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### TableProps

Ƭ **TableProps**<`T`, `ExtendTypes`\>: { `extendTypes?`: { [key: string]: [`ExtendTableTypeProps`](#extendtabletypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`TableItemProps`](#tableitemprops) \| `ExtendTypes` & [`ExtendTableItemProps`](#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`<`string`, `FilterValue`\>, `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[], `extra`: `TableCurrentDataSource`<`T`\>) => { `extra`: `TableCurrentDataSource`<`T`\> ; `filters`: `Record`<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[]  }  } & `AntdTableProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

___

### TitleProps

Ƭ **TitleProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `separator?` | `string` | ` - ` as default |
| `suffix?` | `string` | - |
| `title` | `string` \| `string`[] | - |

## Functions

### Blank

▸ **Blank**(`options?`): `any`

If value is undefined or null, return text, otherwise return value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BlankProps`](#blankprops) |

#### Returns

`any`

```ts
<Blank value={undefined} text="Empty" />
```

___

### Config

▸ **Config**(`props`): `JSX.Element`

Config for all @faasjs/ant-design components.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.config` | `Partial`<[`FaasState`](#faasstate)\> |

#### Returns

`JSX.Element`

```ts
<Config config={{
 common: {
  blank: '空',
 },
}} />
```

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
Example:
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

### Routes

▸ **Routes**(`props`): `Element`

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

### Title

▸ **Title**(`props`): `JSX.Element`

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

### useDrawer

▸ **useDrawer**(`init?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `init?` | [`DrawerProps`](#drawerprops) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `drawer` | `Element` |
| `drawerProps` | [`DrawerProps`](#drawerprops) |
| `setDrawerProps` | (`changes`: `Partial`<[`DrawerProps`](#drawerprops)\>) => `void` |

___

### useFaasState

▸ `Const` **useFaasState**(): [[`FaasState`](#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](#faasstate)\>) => `void`]

#### Returns

[[`FaasState`](#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](#faasstate)\>) => `void`]
