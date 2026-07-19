[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / AliasedSelectField

# Type Alias: AliasedSelectField\<T\>

> **AliasedSelectField**\<`T`> > > > \> = `object`

Selects a column under a different result key.

## Type Parameters

### T

`T` _extends_ `string`

Table name used to infer valid columns.

## Properties

### alias

> **alias**: `string`

Result key for the selected column.

### column

> **column**: [`ColumnName`](ColumnName.md)\<`T`>>>>\>

Column to select.
