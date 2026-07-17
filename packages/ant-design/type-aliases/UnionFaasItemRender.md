[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / UnionFaasItemRender

# Type Alias: UnionFaasItemRender\<Value, Values\>

> **UnionFaasItemRender**\<`Value`, `Values`> > > > > > \> = (`value`, `values`, `index`, `scene`) => `React.ReactNode`

Render callback shared by form items, description items, and table columns.

## Type Parameters

### Value

`Value` = `any`

### Values

`Values` = `any`

## Parameters

### value

`Value`

Normalized value for the field or column.

### values

`Values`

Full record for the current row or form.

### index

`number`

Position of the item inside a list (always 0 for single items).

### scene

[`UnionScene`](UnionScene.md)

Rendering surface that triggered the callback.

## Returns

`React.ReactNode`
