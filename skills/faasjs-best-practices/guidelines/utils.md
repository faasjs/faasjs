# Utils Guide

Use this guide when you need lightweight helper functions from `@faasjs/utils` in app code, tests, or runtime adapters.

## Use This Guide When

- merging default options with user overrides
- converting text or JSON into `ReadableStream`
- reading a stream body back into text or data
- keeping helper code portable across Node.js, browsers, and edge runtimes

## What `@faasjs/utils` Gives You

- `deepMerge`: merge nested objects and arrays without mutating the inputs
- `stringToStream`: turn plain text into a UTF-8 `ReadableStream`
- `streamToString`: read a text stream back into a string
- `objectToStream`: serialize JSON data into a stream
- `streamToObject`: parse JSON data from a stream

## Common Patterns

### 1. Merge defaults with overrides

- Use `deepMerge` when you want one final config object from defaults, environment values, and per-request overrides.
- Later values win. Nested objects merge recursively. Arrays are deduplicated with newer items first.

```ts
import { deepMerge } from '@faasjs/utils'

const defaults = {
  auth: {
    required: true,
    roles: ['user'],
  },
  features: ['search'],
}

const overrides = {
  auth: {
    roles: ['admin'],
  },
  features: ['export'],
}

const config = deepMerge(defaults, overrides)

config
// {
//   auth: {
//     required: true,
//     roles: ['admin', 'user'],
//   },
//   features: ['export', 'search'],
// }
```

### 2. Build a stream body from text or JSON

- Use `stringToStream` for raw text.
- Use `objectToStream` for JSON so you do not need to call `JSON.stringify()` yourself.

```ts
import { objectToStream, stringToStream } from '@faasjs/utils'

const textBody = stringToStream('hello from FaasJS')
const jsonBody = objectToStream({
  ok: true,
  user: {
    id: 1,
    name: 'admin',
  },
})
```

### 3. Read a stream body back into usable data

- Use `streamToString` for text payloads.
- Use `streamToObject` for JSON payloads.

```ts
import { objectToStream, streamToObject, streamToString, stringToStream } from '@faasjs/utils'

const text = await streamToString(stringToStream('hello'))
const result = await streamToObject<{ ok: boolean }>(objectToStream({ ok: true }))

console.log(text) // 'hello'
console.log(result.ok) // true
```

### 4. Pick the matching helper pair

- `stringToStream` goes with `streamToString`
- `objectToStream` goes with `streamToObject`
- Prefer the JSON pair for structured data and the text pair for raw body content

## Review Checklist

- `deepMerge` is used only when recursive merging is actually needed
- text payloads use the text stream helpers
- JSON payloads use the object stream helpers
- examples and tests choose the smallest helper that keeps intent obvious

## Read Next

- [@faasjs/utils package reference](../references/packages/utils/README.md)
- [deepMerge](../references/packages/utils/functions/deepMerge.md)
- [objectToStream](../references/packages/utils/functions/objectToStream.md)
- [streamToObject](../references/packages/utils/functions/streamToObject.md)
- [streamToString](../references/packages/utils/functions/streamToString.md)
- [stringToStream](../references/packages/utils/functions/stringToStream.md)
