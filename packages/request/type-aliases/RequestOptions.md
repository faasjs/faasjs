[@faasjs/request](../README.md) / RequestOptions

# Type alias: RequestOptions

> **RequestOptions**: `Object`

## Type declaration

### agent?

> **`optional`** **agent**: `boolean`

### auth?

> **`optional`** **auth**: `string`

The authentication credentials to use for the request.

Format: `username:password`

### body?

> **`optional`** **body**: `Object` \| `string`

### downloadFile?

> **`optional`** **downloadFile**: `string`

Path of downloading a file from the server.

```ts
await request('https://example.com', { downloadFile: 'filepath' })
```

### downloadStream?

> **`optional`** **downloadStream**: `NodeJS.WritableStream`

Create a write stream to download a file.

```ts
import { createWriteStream } from 'fs'

const stream = createWriteStream('filepath')
await request('https://example.com', { downloadStream: stream })
```

### file?

> **`optional`** **file**: `string`

Path of uploading a file to the server.

```ts
await request('https://example.com', { file: 'filepath' })
```

### headers?

> **`optional`** **headers**: `http.OutgoingHttpHeaders`

### logger?

> **`optional`** **logger**: `Logger`

### method?

> **`optional`** **method**: `string`

The HTTP method to use when making the request. Defaults to GET.

### parse()?

> **`optional`** **parse**: (`body`) => `any`

Body parser. Defaults to `JSON.parse`.

#### Parameters

• **body**: `string`

#### Returns

`any`

### passphrase?

> **`optional`** **passphrase**: `string`

### pfx?

> **`optional`** **pfx**: `Buffer`

### query?

> **`optional`** **query**: `Object`

#### Index signature

 \[`key`: `string`\]: `any`

### timeout?

> **`optional`** **timeout**: `number`

Timeout in milliseconds,

#### Default

```ts
5000
```
