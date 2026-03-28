[@faasjs/ant-design](../README.md) / Link

# Function: Link()

> **Link**(`props`): `Element`

Render a navigation-aware link or button.

Internal links are pushed through React Router, while links with `_blank` targets are opened
with `window.open`.

## Parameters

### props

[`LinkProps`](../interfaces/LinkProps.md)

Link props controlling navigation target, rendering mode, and button behavior.

## Returns

`Element`

## Example

```tsx
import { Link } from '@faasjs/ant-design'

export function Navigation() {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/users/new" button={{ type: 'primary' }}>
        Create User
      </Link>
    </>
  )
}
```
