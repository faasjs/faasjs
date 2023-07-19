# Namespace: Form

## Table of contents

### Variables

- [ErrorList](Form.md#errorlist)
- [Item](Form.md#item)
- [List](Form.md#list)
- [Provider](Form.md#provider)
- [useForm](Form.md#useform)
- [useFormInstance](Form.md#useforminstance)
- [useWatch](Form.md#usewatch)

## Variables

### ErrorList

• **ErrorList**: (`__namedParameters`: `ErrorListProps`) => `React.JSX.Element`

#### Type declaration

▸ (`«destructured»`): `React.JSX.Element`

##### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `ErrorListProps` |

##### Returns

`React.JSX.Element`

___

### Item

• **Item**: typeof [`FormItem`](../modules.md#formitem)

___

### List

• **List**: `FC`<`FormListProps`\>

___

### Provider

• **Provider**: `FC`<`FormProviderProps`\>

___

### useForm

• **useForm**: <Values\>(`form?`: `FormInstance`<`Values`\>) => [`FormInstance`<`Values`\>]

#### Type declaration

▸ <`Values`\>(`form?`): [`FormInstance`<`Values`\>]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `form?` | `FormInstance`<`Values`\> |

##### Returns

[`FormInstance`<`Values`\>]

___

### useFormInstance

• **useFormInstance**: <Value\>() => `FormInstance`<`Value`\>

#### Type declaration

▸ <`Value`\>(): `FormInstance`<`Value`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |

##### Returns

`FormInstance`<`Value`\>

___

### useWatch

• **useWatch**: <TDependencies1, TForm, TDependencies2, TDependencies3, TDependencies4\>(`dependencies`: [`TDependencies1`, `TDependencies2`, `TDependencies3`, `TDependencies4`], `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`][`TDependencies4`]<TDependencies1, TForm, TDependencies2, TDependencies3\>(`dependencies`: [`TDependencies1`, `TDependencies2`, `TDependencies3`], `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`]<TDependencies1, TForm, TDependencies2\>(`dependencies`: [`TDependencies1`, `TDependencies2`], `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`]<TDependencies, TForm\>(`dependencies`: `TDependencies` \| [`TDependencies`], `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `GetGeneric`<`TForm`\>[`TDependencies`]<TForm\>(`dependencies`: [], `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `GetGeneric`<`TForm`\><TForm\>(`dependencies`: `NamePath`, `form?`: `TForm` \| `WatchOptions`<`TForm`\>) => `any`<ValueType\>(`dependencies`: `NamePath`, `form?`: `FormInstance`<`any`\> \| `WatchOptions`<`FormInstance`<`any`\>\>) => `ValueType`

#### Type declaration

▸ <`TDependencies1`, `TForm`, `TDependencies2`, `TDependencies3`, `TDependencies4`\>(`dependencies`, `form?`): `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`][`TDependencies4`]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |
| `TDependencies3` | extends `string` \| `number` \| `symbol` |
| `TDependencies4` | extends `string` \| `number` \| `symbol` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`, `TDependencies3`, `TDependencies4`] |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`][`TDependencies4`]

▸ <`TDependencies1`, `TForm`, `TDependencies2`, `TDependencies3`\>(`dependencies`, `form?`): `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |
| `TDependencies3` | extends `string` \| `number` \| `symbol` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`, `TDependencies3`] |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`][`TDependencies3`]

▸ <`TDependencies1`, `TForm`, `TDependencies2`\>(`dependencies`, `form?`): `GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies1` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |
| `TDependencies2` | extends `string` \| `number` \| `symbol` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [`TDependencies1`, `TDependencies2`] |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`GetGeneric`<`TForm`\>[`TDependencies1`][`TDependencies2`]

▸ <`TDependencies`, `TForm`\>(`dependencies`, `form?`): `GetGeneric`<`TForm`\>[`TDependencies`]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TDependencies` | extends `string` \| `number` \| `symbol` |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `TDependencies` \| [`TDependencies`] |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`GetGeneric`<`TForm`\>[`TDependencies`]

▸ <`TForm`\>(`dependencies`, `form?`): `GetGeneric`<`TForm`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | [] |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`GetGeneric`<`TForm`\>

▸ <`TForm`\>(`dependencies`, `form?`): `any`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TForm` | extends `FormInstance`<`any`, `TForm`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `NamePath` |
| `form?` | `TForm` \| `WatchOptions`<`TForm`\> |

##### Returns

`any`

▸ <`ValueType`\>(`dependencies`, `form?`): `ValueType`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `ValueType` | `Store` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `dependencies` | `NamePath` |
| `form?` | `FormInstance`<`any`\> \| `WatchOptions`<`FormInstance`<`any`\>\> |

##### Returns

`ValueType`
