[@faasjs/ant-design](../README.md) / cloneUnionFaasItemElement

# Function: cloneUnionFaasItemElement()

> **cloneUnionFaasItemElement**(`element`, `props`): `ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Clone a [UnionFaasItemElement](../type-aliases/UnionFaasItemElement.md) while injecting additional React props.

If the element is a React element it is cloned in-place; if it is a function component
it is instantiated via `createElement` with the given props.

## Parameters

### element

[`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)

React element or function component to clone.

### props

`any`

Props injected into the cloned element.

## Returns

`ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Cloned React element with the injected props.
