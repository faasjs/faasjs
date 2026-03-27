[@faasjs/ant-design](../README.md) / Title

# Function: Title()

> **Title**(`props`): `Element` \| `null`

Title is used to change the title of the page

Return null by default.

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
