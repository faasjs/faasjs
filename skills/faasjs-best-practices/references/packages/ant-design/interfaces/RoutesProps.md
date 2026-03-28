[@faasjs/ant-design](../README.md) / RoutesProps

# Interface: RoutesProps

Props for the lazy-loading [Routes](../functions/Routes.md) wrapper.

## Properties

### fallback?

> `optional` **fallback?**: `Element`

Fallback element rendered while lazy pages are loading.

### notFound?

> `optional` **notFound?**: `Element`

Element rendered for the generated catch-all 404 route.

### routes

> **routes**: `RouteProps` & `object`[]

Route records forwarded to React Router, with optional lazy `page` components.
