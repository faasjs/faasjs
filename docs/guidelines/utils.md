# Utils Guide

Use this guide when you need lightweight helper functions from `@faasjs/utils` in app code, tests, or runtime adapters.

## Applicable Scenarios

- Merging config objects recursively
- Converting text to and from streams
- Parsing JSON or YAML text in portable code
- Writing portable helper code that works across Node.js, browsers, and edge runtimes

## What `@faasjs/utils` Gives You

- `deepMerge`: merge nested objects and arrays without mutating the inputs
- `stringToStream`: turn plain text into a UTF-8 `ReadableStream`
- `streamToString`: read a text stream back into a string
- `objectToStream`: serialize JSON data into a stream (see [JSON Guide](./json.md))
- `streamToObject`: parse JSON data from a stream (see [JSON Guide](./json.md))
- `z`: extended Zod instance with convenience helpers (see [Validation Guide](./valid.md))
- `isObjectRecord`: type guard that checks if a value is a plain object (see [Validation Guide](./valid.md))
- `parseJson`: safely parse a JSON string with type inference (see [JSON Guide](./json.md))
- `parseObjectFromJson`: normalize an existing object or JSON string into an object record (see [JSON Guide](./json.md))
- `parseArrayFromJson`: normalize an existing array or JSON string into an array (see [JSON Guide](./json.md))
- `parseYaml`: parse the YAML subset supported by FaasJS (see [YAML Guide](./yaml.md))

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

### 2. Build a stream body from text

- Use `stringToStream` for raw text.
- For JSON payloads, use `objectToStream` (see [JSON Guide](./json.md)).

```ts
import { stringToStream } from '@faasjs/utils'

const textBody = stringToStream('hello from FaasJS')
```

### 3. Read a stream body back into text

- Use `streamToString` for text payloads.
- For JSON payloads, use `streamToObject` (see [JSON Guide](./json.md)).

```ts
import { streamToString, stringToStream } from '@faasjs/utils'

const text = await streamToString(stringToStream('hello'))
console.log(text) // 'hello'
```

### 4. Pick the matching helper pair

- `stringToStream` goes with `streamToString` for text content
- `objectToStream` goes with `streamToObject` for JSON content (see [JSON Guide](./json.md))

### 5. Parse JSON safely

See [JSON Guide](./json.md) for JSON parsing patterns with `parseJson`, `parseObjectFromJson`, and `parseArrayFromJson`.

### 6. Parse YAML directly

Use `parseYaml` from `@faasjs/utils` only when code already has YAML text. For staged `faas.yaml` discovery, use `loadConfig()` from `@faasjs/node-utils` instead.

```ts
import { parseYaml } from '@faasjs/utils'

const value = parseYaml('enabled: true')
```

### 7. Validate data with Zod schemas

See [Validation Guide](./valid.md) for data validation patterns with `z` and `isObjectRecord`.

## Review Checklist

- `deepMerge` is used only when recursive merging is actually needed
- text payloads use `stringToStream` / `streamToString`
- JSON payloads use the helpers from [JSON Guide](./json.md)
- direct YAML text parsing uses `parseYaml` from `@faasjs/utils`; staged `faas.yaml` loading uses `loadConfig`
- data validation uses the helpers from [Validation Guide](./valid.md)
- examples and tests choose the smallest helper that keeps intent obvious
