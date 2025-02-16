[@faasjs/ant-design](../README.md) / cloneUnionFaasItemElement

# Function: cloneUnionFaasItemElement()

> **cloneUnionFaasItemElement**(`element`, `props`): `ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Clone a UnionFaasItemElement with the given props.

This function takes a UnionFaasItemElement and props, and returns a cloned element.
If the provided element is a valid React element, it clones it with the new props.
Otherwise, it creates a new element from the provided element and props.

## Parameters

### element

[`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)

The UnionFaasItemElement to be cloned.

### props

`any`

The props to be applied to the cloned element.

## Returns

`ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

The cloned element with the applied props.
