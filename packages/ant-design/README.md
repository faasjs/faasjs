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

- [BaseItemProps](modules.md#baseitemprops)
- [BaseOption](modules.md#baseoption)
- [BlankProps](modules.md#blankprops)
- [DescriptionItemProps](modules.md#descriptionitemprops)
- [DescriptionProps](modules.md#descriptionprops)
- [DrawerProps](modules.md#drawerprops)
- [ExtendDescriptionItemProps](modules.md#extenddescriptionitemprops)
- [ExtendDescriptionTypeProps](modules.md#extenddescriptiontypeprops)
- [ExtendFormItemProps](modules.md#extendformitemprops)
- [ExtendFormTypeProps](modules.md#extendformtypeprops)
- [ExtendTableItemProps](modules.md#extendtableitemprops)
- [ExtendTableTypeProps](modules.md#extendtabletypeprops)
- [FaasItemProps](modules.md#faasitemprops)
- [FaasItemType](modules.md#faasitemtype)
- [FaasItemTypeValue](modules.md#faasitemtypevalue)
- [FaasState](modules.md#faasstate)
- [FormItemProps](modules.md#formitemprops)
- [FormProps](modules.md#formprops)
- [RoutesProps](modules.md#routesprops)
- [TableItemProps](modules.md#tableitemprops)
- [TableProps](modules.md#tableprops)
- [TitleProps](modules.md#titleprops)

### Functions

- [Blank](modules.md#blank)
- [Config](modules.md#config)
- [Description](modules.md#description)
- [Form](modules.md#form)
- [FormItem](modules.md#formitem)
- [Routes](modules.md#routes)
- [Table](modules.md#table)
- [Title](modules.md#title)
- [transferOptions](modules.md#transferoptions)
- [useDrawer](modules.md#usedrawer)
- [useFaasState](modules.md#usefaasstate)

## Type aliases

### BaseItemProps

Ƭ **BaseItemProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options?` | [`BaseOption`](modules.md#baseoption)[] |
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

Ƭ **DescriptionItemProps**<`T`\>: { `children?`: `JSX.Element` ; `render?`: (`value`: `T`, `values`: `any`) => `string` \| `number` \| `boolean` \| `Element`  } & [`FaasItemProps`](modules.md#faasitemprops)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### DescriptionProps

Ƭ **DescriptionProps**<`T`, `ExtendItemProps`\>: { `dataSource?`: `T` ; `extendTypes?`: { [key: string]: [`ExtendDescriptionTypeProps`](modules.md#extenddescriptiontypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`DescriptionItemProps`](modules.md#descriptionitemprops) \| `ExtendItemProps`)[]  } & `DescriptionsProps`

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

Ƭ **ExtendDescriptionItemProps**: [`BaseItemProps`](modules.md#baseitemprops)

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

Ƭ **ExtendFormItemProps**: [`BaseItemProps`](modules.md#baseitemprops) & `AntdFormItemProps`

___

### ExtendFormTypeProps

Ƭ **ExtendFormTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |

___

### ExtendTableItemProps

Ƭ **ExtendTableItemProps**<`T`\>: [`BaseItemProps`](modules.md#baseitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

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

Ƭ **FaasItemProps**: [`BaseItemProps`](modules.md#baseitemprops) & { `type?`: [`FaasItemType`](modules.md#faasitemtype)  }

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
| `Blank` | `Object` |
| `Blank.text` | `string` |
| `Form` | `Object` |
| `Form.submit` | `Object` |
| `Form.submit.text` | `string` |
| `Title` | `Object` |
| `Title.separator` | `string` |
| `Title.suffix` | `string` |
| `common` | `Object` |
| `common.all` | `string` |
| `common.blank` | `string` |
| `common.pageNotFound` | `string` |
| `common.submit` | `string` |

___

### FormItemProps

Ƭ **FormItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null`` ; `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](modules.md#extendformtypeprops);  } ; `label?`: `string` \| ``false`` ; `rules?`: `RuleObject`[] ; `render?`: () => `Element`  } & `FormItemInputProps`<`T`\> & [`FaasItemProps`](modules.md#faasitemprops) & `AntdFormItemProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FormProps

Ƭ **FormProps**<`Values`, `ExtendItemProps`\>: { `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](modules.md#extendformtypeprops);  } ; `items?`: ([`FormItemProps`](modules.md#formitemprops) \| `ExtendItemProps`)[] ; `submit?`: ``false`` \| { `text?`: `string`  }  } & `AntdFormProps`<`Values`\>

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

Ƭ **TableItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null``  } & [`FaasItemProps`](modules.md#faasitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### TableProps

Ƭ **TableProps**<`T`, `ExtendTypes`\>: { `extendTypes?`: { [key: string]: [`ExtendTableTypeProps`](modules.md#extendtabletypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`TableItemProps`](modules.md#tableitemprops) \| `ExtendTypes` & [`ExtendTableItemProps`](modules.md#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`<`string`, `FilterValue`\>, `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[], `extra`: `TableCurrentDataSource`<`T`\>) => { `extra`: `TableCurrentDataSource`<`T`\> ; `filters`: `Record`<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[]  }  } & `AntdTableProps`<`T`\>

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BlankProps`](modules.md#blankprops) |

#### Returns

`any`

___

### Config

▸ **Config**(`props`): `JSX.Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.config` | `Partial`<[`FaasState`](modules.md#faasstate)\> |

#### Returns

`JSX.Element`

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
| `props` | [`DescriptionProps`](modules.md#descriptionprops)<`T`, `any`\> |

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
| `props` | [`FormProps`](modules.md#formprops)<`Values`, `any`\> |

#### Returns

`Element`

___

### FormItem

▸ **FormItem**<`T`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormItemProps`](modules.md#formitemprops)<`T`\> |

#### Returns

`Element`

___

### Routes

▸ **Routes**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`RoutesProps`](modules.md#routesprops) |

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
| `props` | [`TableProps`](modules.md#tableprops)<`T`, `ExtendTypes`\> |

#### Returns

`Element`

___

### Title

▸ **Title**(`props`): `JSX.Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TitleProps`](modules.md#titleprops) |

#### Returns

`JSX.Element`

___

### transferOptions

▸ **transferOptions**(`options`): { `label`: `string` ; `value?`: `string` \| `number`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BaseOption`](modules.md#baseoption)[] |

#### Returns

{ `label`: `string` ; `value?`: `string` \| `number`  }[]

___

### useDrawer

▸ **useDrawer**(`init?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `init?` | [`DrawerProps`](modules.md#drawerprops) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `drawer` | `Element` |
| `drawerProps` | [`DrawerProps`](modules.md#drawerprops) |
| `setDrawerProps` | (`changes`: `Partial`<[`DrawerProps`](modules.md#drawerprops)\>) => `void` |

___

### useFaasState

▸ `Const` **useFaasState**(): [[`FaasState`](modules.md#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](modules.md#faasstate)\>) => `void`]

#### Returns

[[`FaasState`](modules.md#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](modules.md#faasstate)\>) => `void`]
