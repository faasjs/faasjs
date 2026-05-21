# Utils Guide

Use this guide when you need lightweight helper functions from `@faasjs/utils` in app code, tests, or runtime adapters.

## Applicable Scenarios

- Merging config objects recursively
- Converting text or JSON to and from streams
- Parsing JSON strings safely with type inference
- Normalizing unknown inputs into typed objects or arrays
- Validating data with Zod schemas
- Writing portable helper code that works across Node.js, browsers, and edge runtimes

## What `@faasjs/utils` Gives You

- `deepMerge`: merge nested objects and arrays without mutating the inputs
- `stringToStream`: turn plain text into a UTF-8 `ReadableStream`
- `streamToString`: read a text stream back into a string
- `objectToStream`: serialize JSON data into a stream
- `streamToObject`: parse JSON data from a stream
- `z`: extended Zod instance with convenience helpers (`positiveint`, `nonemptystring`)
- `isObjectRecord`: type guard that checks if a value is a plain object
- `parseJson`: safely parse a JSON string with type inference
- `parseObjectFromJson`: normalize an existing object or JSON string into an object record
- `parseArrayFromJson`: normalize an existing array or JSON string into an array

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

### 5. Parse JSON safely

- Use `parseJson` when you have a JSON string and want a typed result.
- Use `parseObjectFromJson` when input could be an object or a JSON string — normalizes both into a typed record.
- Use `parseArrayFromJson` when input could be an array or a JSON string — normalizes both into a typed array.
- All three throw on invalid input, so wrap them in try/catch at trust boundaries.

```ts
import { parseJson, parseObjectFromJson, parseArrayFromJson } from '@faasjs/utils'

const data = parseJson<{ id: number }>('{"id": 1}')
// data.id === 1

const obj = parseObjectFromJson<{ name: string }>(event.body)
// Accepts both { name: "alice" } and '{"name": "alice"}'

const arr = parseArrayFromJson<string[]>(rawItems)
// Accepts both ["a", "b"] and '["a", "b"]'
```

### 6. Validate data with Zod schemas

- Use `z` (the extended Zod instance) instead of importing bare `zod` for FaasJS projects.
- `z.positiveint()` returns a schema that only allows positive integers.
- `z.nonemptystring()` returns a schema that only allows non-empty strings.
- Use `isObjectRecord` as a type guard in generic code to narrow `unknown` to `Record<string, unknown>`.

```ts
import { z, isObjectRecord } from '@faasjs/utils'

const schema = z.object({
  name: z.nonemptystring(),
  age: z.positiveint(),
})

// Type guard for generic code
function process(value: unknown) {
  if (isObjectRecord(value)) {
    // value is narrowed to Record<string, unknown>
    console.log(Object.keys(value))
  }
}
```

## Review Checklist

- `deepMerge` is used only when recursive merging is actually needed
- text payloads use the text stream helpers
- JSON payloads use the object stream helpers
- JSON parsing uses `parseJson` / `parseObjectFromJson` / `parseArrayFromJson` instead of raw `JSON.parse`
- input normalization prefers `parseObjectFromJson` or `parseArrayFromJson` over type assertions
- Zod schema validation uses `@faasjs/utils` `z` instead of bare `zod` for consistency
- examples and tests choose the smallest helper that keeps intent obvious

## Further Reading

- [@faasjs/utils Package Reference](/doc/utils/)
- [deepMerge](/doc/utils/functions/deepMerge.html)
- [objectToStream](/doc/utils/functions/objectToStream.html)
- [streamToObject](/doc/utils/functions/streamToObject.html)
- [streamToString](/doc/utils/functions/streamToString.html)
- [stringToStream](/doc/utils/functions/stringToStream.html)
- [parseJson](/doc/utils/functions/parseJson.html)
- [parseObjectFromJson](/doc/utils/functions/parseObjectFromJson.html)
- [parseArrayFromJson](/doc/utils/functions/parseArrayFromJson.html)
- [isObjectRecord](/doc/utils/functions/isObjectRecord.html)
