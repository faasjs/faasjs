[@faasjs/ant-design](../README.md) / PageNotFound

# Function: PageNotFound()

> **PageNotFound**(): `Element`

Default 404 route element that uses the configured localized title.

## Returns

`Element`

## Example

```tsx
import { PageNotFound, Routes } from '@faasjs/ant-design'
;<Routes routes={[{ path: '/', element: <div>Home</div> }]} notFound={<PageNotFound />} />
```
