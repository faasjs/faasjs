[@faasjs/ant-design](../README.md) / TableFaasDataResponse

# Type Alias: TableFaasDataResponse\<T\>

> **TableFaasDataResponse**\<`T`\> = `object`

Paginated response shape expected by [Table](../functions/Table.md) when using `faasData`.

## Type Parameters

### T

`T` = `any`

Row record type contained in `rows`.

## Properties

### pagination

> **pagination**: `object`

#### current

> **current**: `number`

#### pageSize

> **pageSize**: `number`

#### total

> **total**: `number`

### rows

> **rows**: `T`[]
