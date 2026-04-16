[@faasjs/ant-design](../README.md) / UnionFaasItemRender

# Type Alias: UnionFaasItemRender\<Value, Values\>

> **UnionFaasItemRender**\<`Value`, `Values`\> = (`value`, `values`, `index`, `scene`) => `React.ReactNode`

Render callback signature shared by form, description, and table item definitions.

## Type Parameters

### Value

`Value` = `any`

Current item value type.

### Values

`Values` = `any`

Whole record or row type that contains the value.

## Parameters

### value

`Value`

Current item value.

### values

`Values`

Whole record or row containing the value.

### index

`number`

Current row or list index.

### scene

[`UnionScene`](UnionScene.md)

Rendering surface requesting the output.

## Returns

`React.ReactNode`
