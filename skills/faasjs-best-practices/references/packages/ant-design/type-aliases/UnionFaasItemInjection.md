[@faasjs/ant-design](../README.md) / UnionFaasItemInjection

# Type Alias: UnionFaasItemInjection\<Value, Values\>

> **UnionFaasItemInjection**\<`Value`, `Values`\> = `object`

Props injected into custom union item components.

## Type Parameters

### Value

`Value` = `any`

Current item value type.

### Values

`Values` = `any`

Whole record or row type that contains the value.

## Properties

### index?

> `optional` **index?**: `number`

Current row or list index when available.

### scene?

> `optional` **scene?**: [`UnionScene`](UnionScene.md)

Rendering surface requesting the injected element.

### value?

> `optional` **value?**: `Value`

Current field, cell, or item value.

### values?

> `optional` **values?**: `Values`

Full record or row containing the current value.
