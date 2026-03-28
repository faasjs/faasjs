[@faasjs/ant-design](../README.md) / cloneUnionFaasItemElement

# Function: cloneUnionFaasItemElement()

> **cloneUnionFaasItemElement**(`element`, `props`): `ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Clone a [UnionFaasItemElement](../type-aliases/UnionFaasItemElement.md) with FaasJS injection props.

React elements are cloned directly, while component references are first wrapped with
`createElement`.

## Parameters

### element

[`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)

Element or component to clone.

### props

`any`

Injection props such as `scene`, `value`, `values`, and `index`.

## Returns

`ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<`any`, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

Cloned React element ready for rendering.

## Example

```tsx
import { cloneUnionFaasItemElement, type UnionFaasItemElement } from '@faasjs/ant-design'

const Cell: UnionFaasItemElement<string> = ({ value }) => <span>{value}</span>

const element = cloneUnionFaasItemElement(Cell, {
  scene: 'table',
  value: 'Hello',
  index: 0,
})
```
