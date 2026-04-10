[@faasjs/dev](../README.md) / ReactSsrRenderPageResult

# Type Alias: ReactSsrRenderPageResult

> **ReactSsrRenderPageResult** = `object`

Result returned by a React SSR page renderer.

## Properties

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Optional response headers for the rendered page.

### html

> **html**: `string`

Rendered HTML inserted into the template root element.

### props?

> `optional` **props?**: `Record`\<`string`, `unknown`\>

Serialized payload exposed on `window.__FAASJS_REACT_SSR__`.

### statusCode?

> `optional` **statusCode?**: `number`

Optional HTTP status code for the rendered page.
