# Namespace: Form

## Table of contents

### Namespaces

- [ErrorList](Form.ErrorList.md)
- [Item](Form.Item.md)
- [List](Form.List.md)
- [Provider](Form.Provider.md)

### Functions

- [ErrorList](Form.md#errorlist)
- [Item](Form.md#item)
- [List](Form.md#list)
- [Provider](Form.md#provider)
- [useForm](Form.md#useform)
- [useFormInstance](Form.md#useforminstance)
- [useWatch](Form.md#usewatch)

## Functions

### ErrorList

▸ **ErrorList**(`props`, `context?`): `ReactNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `ErrorListProps` |
| `context?` | `any` |

#### Returns

`ReactNode`

___

### Item

▸ **Item**\<`T`\>(`props`): `Element`

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
| `props` | [`FormItemProps`](../interfaces/FormItemProps.md)\<`T`\> |

#### Returns

`Element`

___

### List

▸ **List**(`props`, `context?`): `ReactNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `FormListProps` |
| `context?` | `any` |

#### Returns

`ReactNode`

___

### Provider

▸ **Provider**(`props`, `context?`): `ReactNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `FormProviderProps` |
| `context?` | `any` |

#### Returns

`ReactNode`

___

### useForm

▸ **useForm**\<`Values`\>(`form?`): [`FormInstance`\<`Values`\>]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `form?` | `FormInstance`\<`Values`\> |

#### Returns

[`FormInstance`\<`Values`\>]

___

### useFormInstance

▸ **useFormInstance**\<`Value`\>(): `FormInstance`\<`Value`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |

#### Returns

`FormInstance`\<`Value`\>

___

### useWatch

▸ **useWatch**\<`TDependencies1`, `TForm`, `TDependencies2`, `TDependencies3`, `TDependencies4`\>(`dependencies`, `form?`): `GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`][`TDependencies4`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`\<`any`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |
| `TDependencies3` | extends `string` \| `number` \| `symbol` |
| `TDependencies4` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`, `TDependencies3`, `TDependencies4`] |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`][`TDependencies4`]

▸ **useWatch**\<`TDependencies1`, `TForm`, `TDependencies2`, `TDependencies3`\>(`dependencies`, `form?`): `GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`\<`any`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |
| `TDependencies3` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`, `TDependencies3`] |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`]

▸ **useWatch**\<`TDependencies1`, `TForm`, `TDependencies2`\>(`dependencies`, `form?`): `GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`\<`any`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`] |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`GetGeneric`\<`TForm`\>[`TDependencies1`][`TDependencies2`]

▸ **useWatch**\<`TDependencies`, `TForm`\>(`dependencies`, `form?`): `GetGeneric`\<`TForm`\>[`TDependencies`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`\<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `TDependencies` \| [`TDependencies`] |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`GetGeneric`\<`TForm`\>[`TDependencies`]

▸ **useWatch**\<`TForm`\>(`dependencies`, `form?`): `GetGeneric`\<`TForm`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TForm` | extends `FormInstance`\<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [] |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`GetGeneric`\<`TForm`\>

▸ **useWatch**\<`TForm`\>(`dependencies`, `form?`): `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TForm` | extends `FormInstance`\<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `any` |
| `form?` | `TForm` \| `WatchOptions`\<`TForm`\> |

#### Returns

`any`

▸ **useWatch**\<`ValueType`\>(`dependencies`, `form?`): `ValueType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ValueType` | `Store` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `any` |
| `form?` | `FormInstance`\<`any`\> \| `WatchOptions`\<`FormInstance`\<`any`\>\> |

#### Returns

`ValueType`
