[@faasjs/ant-design](../README.md) / TableProps

# Type Alias: TableProps\<T, ExtendTypes\>

> **TableProps**\<`T`, `ExtendTypes`\>: `object` & `AntdTableProps`\<`T`\>

## Type declaration

### extendTypes?

> `optional` **extendTypes**: `object`

#### Index Signature

 \[`key`: `string`\]: [`ExtendTableTypeProps`](ExtendTableTypeProps.md)\<`any`\>

### faasData?

> `optional` **faasData**: [`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`T`\>

### items

> **items**: ([`TableItemProps`](../interfaces/TableItemProps.md) \| `ExtendTypes` & [`ExtendTableItemProps`](ExtendTableItemProps.md))[]

### onChange()?

> `optional` **onChange**: (`pagination`, `filters`, `sorter`, `extra`) => `object`

#### Parameters

##### pagination

`TablePaginationConfig`

##### filters

`Record`\<`string`, `FilterValue` \| `null`\>

##### sorter

`SorterResult`\<`T`\> | `SorterResult`\<`T`\>[]

##### extra

`TableCurrentDataSource`\<`T`\>

#### Returns

`object`

##### extra

> **extra**: `TableCurrentDataSource`\<`T`\>

##### filters

> **filters**: `Record`\<`string`, `FilterValue` \| `null`\>

##### pagination

> **pagination**: `TablePaginationConfig`

##### sorter

> **sorter**: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]

## Type Parameters

• **T** = `any`

• **ExtendTypes** = `any`
