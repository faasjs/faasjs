# JSON Guide

Use this guide when you need to parse, serialize, or normalize JSON data in FaasJS projects using the helpers from `@faasjs/utils`.

## Applicable Scenarios

- Parsing JSON strings safely with type inference
- Normalizing unknown inputs into typed objects or arrays
- Converting JSON data to and from streams
- Building structured request or response bodies

## What `@faasjs/utils` Gives You

- `parseJson` — safely parse a JSON string with type inference
- `parseObjectFromJson` — normalize an existing object or JSON string into an object record
- `parseArrayFromJson` — normalize an existing array or JSON string into an array
- `objectToStream` — serialize JSON data into a `ReadableStream`
- `streamToObject` — parse JSON data from a stream

## Common Patterns

### 1. Parse JSON safely

Use `parseJson` when you have a JSON string and want a typed result. Use `parseObjectFromJson` when input could be an object or a JSON string — normalizes both into a typed record. Use `parseArrayFromJson` when input could be an array or a JSON string — normalizes both into a typed array.

All three throw on invalid input, so wrap them in try/catch at trust boundaries.

```ts
import { parseJson, parseObjectFromJson, parseArrayFromJson } from '@faasjs/utils'

const data = parseJson<{ id: number }>('{"id": 1}')
// data.id === 1

const obj = parseObjectFromJson<{ name: string }>(event.body)
// Accepts both { name: "alice" } and '{"name": "alice"}'

const arr = parseArrayFromJson<string[]>(rawItems)
// Accepts both ["a", "b"] and '["a", "b"]'
```

### 2. Build a JSON stream body

Use `objectToStream` for JSON payloads so you do not need to call `JSON.stringify()` yourself.

```ts
import { objectToStream } from '@faasjs/utils'

const jsonBody = objectToStream({
  ok: true,
  user: {
    id: 1,
    name: 'admin',
  },
})
```

### 3. Read a stream body back into JSON data

Use `streamToObject` for JSON payloads.

```ts
import { objectToStream, streamToObject } from '@faasjs/utils'

const result = await streamToObject<{ ok: boolean }>(objectToStream({ ok: true }))
console.log(result.ok) // true
```

### 4. Pick the matching helper pair

- `objectToStream` goes with `streamToObject`
- Prefer the JSON pair for structured data
- Use `stringToStream` / `streamToString` from `@faasjs/utils` for raw text payloads (see [Utils Guide](./utils.md))

## Review Checklist

- JSON parsing uses `parseJson` / `parseObjectFromJson` / `parseArrayFromJson` instead of raw `JSON.parse`
- input normalization prefers `parseObjectFromJson` or `parseArrayFromJson` over type assertions
- JSON payloads use `objectToStream` / `streamToObject` instead of manual `JSON.stringify` / `JSON.parse`
- examples and tests choose the smallest helper that keeps intent obvious
