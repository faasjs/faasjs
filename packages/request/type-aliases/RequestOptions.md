[@faasjs/request](../README.md) / RequestOptions

# Type alias: RequestOptions

> **RequestOptions**: `Object`

## Type declaration

### agent?

> **agent**?: `boolean`

### auth?

> **auth**?: `string`

The authentication credentials to use for the request.

Format: `username:password`

### body?

> **body**?: `Object` \| `string`

### downloadFile?

> **downloadFile**?: `string`

Path of downloading a file from the server.

```ts
await request('https://example.com', { downloadFile: 'filepath' })
```

### downloadStream?

> **downloadStream**?: `NodeJS.WritableStream`

Create a write stream to download a file.

```ts
import { createWriteStream } from 'fs'

const stream = createWriteStream('filepath')
await request('https://example.com', { downloadStream: stream })
```

### file?

> **file**?: `string`

Path of uploading a file to the server.

```ts
await request('https://example.com', { file: 'filepath' })
```

### headers?

> **headers**?: `http.OutgoingHttpHeaders`

### logger?

> **logger**?: `Logger`

### method?

> **method**?: `string`

The HTTP method to use when making the request. Defaults to GET.

### parse?

> **parse**?: (`body`) => `any`

Body parser. Defaults to `JSON.parse`.

#### Parameters

• **body**: `string`

#### Returns

`any`

### passphrase?

> **passphrase**?: `string`

### pfx?

> **pfx**?: `Buffer`

### query?

> **query**?: `Object`

#### Index signature

 \[`key`: `string`\]: `any`

### timeout?

> **timeout**?: `number`

Timeout in milliseconds,

#### Default

```ts
5000
```
