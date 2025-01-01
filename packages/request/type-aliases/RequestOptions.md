[@faasjs/request](../README.md) / RequestOptions

# Type Alias: RequestOptions

> **RequestOptions**: `object` & `Pick`\<`https.RequestOptions`, `"pfx"` \| `"passphrase"` \| `"agent"`\>

## Type declaration

### auth?

> `optional` **auth**: `string`

The authentication credentials to use for the request.

Format: `username:password`

### body?

> `optional` **body**: \{\} \| `string`

### downloadFile?

> `optional` **downloadFile**: `string`

Path of downloading a file from the server.

```ts
await request('https://example.com', { downloadFile: 'filepath' })
```

### downloadStream?

> `optional` **downloadStream**: `NodeJS.WritableStream`

Create a write stream to download a file.

```ts
import { createWriteStream } from 'fs'

const stream = createWriteStream('filepath')
await request('https://example.com', { downloadStream: stream })
```

### file?

> `optional` **file**: `string`

Path of uploading a file to the server.

```ts
await request('https://example.com', { file: 'filepath' })
```

### headers?

> `optional` **headers**: `OutgoingHttpHeaders`

### logger?

> `optional` **logger**: `Logger`

### method?

> `optional` **method**: `string`

The HTTP method to use when making the request. Defaults to GET.

### parse()?

> `optional` **parse**: (`body`) => `any`

Body parser. Defaults to `JSON.parse`.

#### Parameters

##### body

`string`

#### Returns

`any`

### query?

> `optional` **query**: `object`

#### Index Signature

\[`key`: `string`\]: `any`

### timeout?

> `optional` **timeout**: `number`

Timeout in milliseconds,

#### Default

```ts
5000
```
