# @faasjs/ant-design

## Table of contents

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

#### Defined in

[packages/ant-design/src/data.ts:21](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L21)

___

### BaseOption

Ƭ **BaseOption**: `string` \| `number` \| { `label`: `string` ; `value?`: `string` \| `number`  }

#### Defined in

[packages/ant-design/src/data.ts:16](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L16)

___

### BlankProps

Ƭ **BlankProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `text?` | `string` |
| `value?` | `any` |

#### Defined in

[packages/ant-design/src/Blank.tsx:5](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Blank.tsx#L5)

___

### DescriptionItemProps

Ƭ **DescriptionItemProps**<`T`\>: { `children?`: `JSX.Element` ; `render?`: (`value`: `T`, `values`: `any`) => `string` \| `number` \| `boolean` \| `Element`  } & [`FaasItemProps`](modules.md#faasitemprops)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[packages/ant-design/src/Description.tsx:20](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Description.tsx#L20)

___

### DescriptionProps

Ƭ **DescriptionProps**<`T`, `ExtendItemProps`\>: { `dataSource?`: `T` ; `extendTypes?`: { [key: string]: [`ExtendDescriptionTypeProps`](modules.md#extenddescriptiontypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`DescriptionItemProps`](modules.md#descriptionitemprops) \| `ExtendItemProps`)[]  } & `DescriptionsProps`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendItemProps` | `any` |

#### Defined in

[packages/ant-design/src/Description.tsx:25](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Description.tsx#L25)

___

### DrawerProps

Ƭ **DrawerProps**: `AntdDrawerProps` & { `children?`: `JSX.Element` \| `JSX.Element`[]  }

#### Defined in

[packages/ant-design/src/Drawer.tsx:6](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Drawer.tsx#L6)

___

### ExtendDescriptionItemProps

Ƭ **ExtendDescriptionItemProps**: [`BaseItemProps`](modules.md#baseitemprops)

#### Defined in

[packages/ant-design/src/Description.tsx:18](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Description.tsx#L18)

___

### ExtendDescriptionTypeProps

Ƭ **ExtendDescriptionTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |
| `render?` | (`value`: `any`, `values`: `any`) => `string` \| `number` \| `boolean` \| `Element` |

#### Defined in

[packages/ant-design/src/Description.tsx:13](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Description.tsx#L13)

___

### ExtendFormItemProps

Ƭ **ExtendFormItemProps**: [`BaseItemProps`](modules.md#baseitemprops) & `AntdFormItemProps`

#### Defined in

[packages/ant-design/src/FormItem.tsx:64](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/FormItem.tsx#L64)

___

### ExtendFormTypeProps

Ƭ **ExtendFormTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |

#### Defined in

[packages/ant-design/src/FormItem.tsx:60](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/FormItem.tsx#L60)

___

### ExtendTableItemProps

Ƭ **ExtendTableItemProps**<`T`\>: [`BaseItemProps`](modules.md#baseitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[packages/ant-design/src/Table.tsx:35](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Table.tsx#L35)

___

### ExtendTableTypeProps

Ƭ **ExtendTableTypeProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children?` | `JSX.Element` \| ``null`` |
| `render?` | (`value`: `any`, `values`: `any`, `index`: `number`) => `string` \| `number` \| `boolean` \| `Element` |

#### Defined in

[packages/ant-design/src/Table.tsx:30](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Table.tsx#L30)

___

### FaasItemProps

Ƭ **FaasItemProps**: [`BaseItemProps`](modules.md#baseitemprops) & { `type?`: [`FaasItemType`](modules.md#faasitemtype)  }

#### Defined in

[packages/ant-design/src/data.ts:27](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L27)

___

### FaasItemType

Ƭ **FaasItemType**: ``"string"`` \| ``"string[]"`` \| ``"number"`` \| ``"number[]"`` \| ``"boolean"``

#### Defined in

[packages/ant-design/src/data.ts:3](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L3)

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

#### Defined in

[packages/ant-design/src/data.ts:8](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L8)

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

#### Defined in

[packages/ant-design/src/Config.tsx:4](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Config.tsx#L4)

___

### FormItemProps

Ƭ **FormItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null`` ; `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](modules.md#extendformtypeprops);  } ; `label?`: `string` \| ``false`` ; `rules?`: `RuleObject`[] ; `render?`: () => `Element`  } & `FormItemInputProps`<`T`\> & [`FaasItemProps`](modules.md#faasitemprops) & `AntdFormItemProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[packages/ant-design/src/FormItem.tsx:66](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/FormItem.tsx#L66)

___

### FormProps

Ƭ **FormProps**<`Values`, `ExtendItemProps`\>: { `extendTypes?`: { [type: string]: [`ExtendFormTypeProps`](modules.md#extendformtypeprops);  } ; `items?`: ([`FormItemProps`](modules.md#formitemprops) \| `ExtendItemProps`)[] ; `submit?`: ``false`` \| { `text?`: `string`  }  } & `AntdFormProps`<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |
| `ExtendItemProps` | `any` |

#### Defined in

[packages/ant-design/src/Form.tsx:15](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Form.tsx#L15)

___

### RoutesProps

Ƭ **RoutesProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fallback?` | `JSX.Element` |
| `notFound?` | `JSX.Element` |
| `routes` | `RouteProps` & { `page?`: `LazyExoticComponent`<`ComponentType`<`any`\>\>  }[] |

#### Defined in

[packages/ant-design/src/Routers.tsx:19](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Routers.tsx#L19)

___

### TableItemProps

Ƭ **TableItemProps**<`T`\>: { `children?`: `JSX.Element` \| ``null``  } & [`FaasItemProps`](modules.md#faasitemprops) & `Omit`<`AntdTableColumnProps`<`T`\>, ``"children"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[packages/ant-design/src/Table.tsx:25](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Table.tsx#L25)

___

### TableProps

Ƭ **TableProps**<`T`, `ExtendTypes`\>: { `extendTypes?`: { [key: string]: [`ExtendTableTypeProps`](modules.md#extendtabletypeprops);  } ; `faasData?`: `FaasDataWrapperProps`<`T`\> ; `items`: ([`TableItemProps`](modules.md#tableitemprops) \| `ExtendTypes` & [`ExtendTableItemProps`](modules.md#extendtableitemprops))[] ; `onChange?`: (`pagination`: `TablePaginationConfig`, `filters`: `Record`<`string`, `FilterValue`\>, `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[], `extra`: `TableCurrentDataSource`<`T`\>) => { `extra`: `TableCurrentDataSource`<`T`\> ; `filters`: `Record`<`string`, `FilterValue` \| ``null``\> ; `pagination`: `TablePaginationConfig` ; `sorter`: `SorterResult`<`T`\> \| `SorterResult`<`T`\>[]  }  } & `AntdTableProps`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendTypes` | `any` |

#### Defined in

[packages/ant-design/src/Table.tsx:37](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Table.tsx#L37)

___

### TitleProps

Ƭ **TitleProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `separator?` | `string` | ` - ` as default |
| `suffix?` | `string` | - |
| `title` | `string` \| `string`[] | - |

#### Defined in

[packages/ant-design/src/Title.tsx:4](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Title.tsx#L4)

## Functions

### Blank

▸ **Blank**(`options?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BlankProps`](modules.md#blankprops) |

#### Returns

`any`

#### Defined in

[packages/ant-design/src/Blank.tsx:10](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Blank.tsx#L10)

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

#### Defined in

[packages/ant-design/src/Config.tsx:49](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Config.tsx#L49)

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

#### Defined in

[packages/ant-design/src/Description.tsx:118](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Description.tsx#L118)

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

#### Defined in

[packages/ant-design/src/Form.tsx:29](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Form.tsx#L29)

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

#### Defined in

[packages/ant-design/src/FormItem.tsx:76](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/FormItem.tsx#L76)

___

### Routes

▸ **Routes**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`RoutesProps`](modules.md#routesprops) |

#### Returns

`Element`

#### Defined in

[packages/ant-design/src/Routers.tsx:27](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Routers.tsx#L27)

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

#### Defined in

[packages/ant-design/src/Table.tsx:76](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Table.tsx#L76)

___

### Title

▸ **Title**(`props`): `JSX.Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TitleProps`](modules.md#titleprops) |

#### Returns

`JSX.Element`

#### Defined in

[packages/ant-design/src/Title.tsx:11](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Title.tsx#L11)

___

### transferOptions

▸ **transferOptions**(`options`): { `label`: `string` ; `value?`: `string` \| `number`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BaseOption`](modules.md#baseoption)[] |

#### Returns

{ `label`: `string` ; `value?`: `string` \| `number`  }[]

#### Defined in

[packages/ant-design/src/data.ts:35](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/data.ts#L35)

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

#### Defined in

[packages/ant-design/src/Drawer.tsx:10](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Drawer.tsx#L10)

___

### useFaasState

▸ `Const` **useFaasState**(): [[`FaasState`](modules.md#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](modules.md#faasstate)\>) => `void`]

#### Returns

[[`FaasState`](modules.md#faasstate), (`state`: `IHookStateSetAction`<[`FaasState`](modules.md#faasstate)\>) => `void`]

#### Defined in

[packages/ant-design/src/Config.tsx:39](https://github.com/faasjs/faasjs/blob/1705fd2/packages/ant-design/src/Config.tsx#L39)
