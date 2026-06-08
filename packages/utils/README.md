# @faasjs/utils

# @faasjs/utils

FaasJS cross-runtime utility helpers.

The package bundles pure utilities that work across Node.js, browsers, and edge runtimes,
including deep merge helpers, random identifier helpers, and stream conversion helpers.

## Install

```sh
npm install @faasjs/utils
```

## Usage

```ts
import { deepMerge, streamToString } from '@faasjs/utils'

const merged = deepMerge({ a: 1 }, { b: 2 })
const text = await streamToString(
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('hello'))
      controller.close()
    },
  }),
)

console.log(merged, text)
```

## Functions

- [deepMerge](functions/deepMerge.md)
- [generateId](functions/generateId.md)
- [isObjectRecord](functions/isObjectRecord.md)
- [objectToStream](functions/objectToStream.md)
- [parseArrayFromJson](functions/parseArrayFromJson.md)
- [parseJson](functions/parseJson.md)
- [parseObjectFromJson](functions/parseObjectFromJson.md)
- [parseYaml](functions/parseYaml.md)
- [streamToObject](functions/streamToObject.md)
- [streamToString](functions/streamToString.md)
- [stringToStream](functions/stringToStream.md)
- [toErrorMessage](functions/toErrorMessage.md)

## Type Aliases

- [Z](type-aliases/Z.md)

## Variables

- [z](variables/z.md)
