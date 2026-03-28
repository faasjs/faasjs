[@faasjs/ant-design](../README.md) / Title

# Function: Title()

> **Title**(`props`): `Element` \| `null`

Update `document.title` and optionally render the title inline.

The component returns `null` by default and is often used only for its side effect.

## Parameters

### props

[`TitleProps`](../interfaces/TitleProps.md)

Title props controlling document title updates and optional inline rendering.

## Returns

`Element` \| `null`

## Example

```tsx
import { Title } from '@faasjs/ant-design'

export function DetailPage() {
  return (
    <>
      <Title title={['Orders', 'Detail']} h1 />
      <div>...</div>
    </>
  )
}
```
