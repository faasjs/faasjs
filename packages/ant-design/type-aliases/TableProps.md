[@faasjs/ant-design](../README.md) / TableProps

# Type alias: TableProps\<T, ExtendTypes\>

> **TableProps**\<`T`, `ExtendTypes`\>: `Object` & `AntdTableProps`\<`T`\>

## Type declaration

### extendTypes?

> **`optional`** **extendTypes**: `Object`

#### Index signature

 \[`key`: `string`\]: [`ExtendTableTypeProps`](ExtendTableTypeProps.md)

### faasData?

> **`optional`** **faasData**: [`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`T`\>

### items

> **items**: ([`TableItemProps`](../interfaces/TableItemProps.md) \| `ExtendTypes` & [`ExtendTableItemProps`](ExtendTableItemProps.md))[]

### onChange?

> **`optional`** **onChange**: (`pagination`, `filters`, `sorter`, `extra`) => `Object`

#### Parameters

• **pagination**: `TablePaginationConfig`

• **filters**: `Record`\<`string`, `FilterValue` \| `null`\>

• **sorter**: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]

• **extra**: `TableCurrentDataSource`\<`T`\>

#### Returns

`Object`

##### extra

> **extra**: `TableCurrentDataSource`\<`T`\>

##### filters

> **filters**: `Record`\<`string`, `FilterValue` \| `null`\>

##### pagination

> **pagination**: `TablePaginationConfig`

##### sorter

> **sorter**: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]

## Type parameters

• **T** = `any`

• **ExtendTypes** = `any`
