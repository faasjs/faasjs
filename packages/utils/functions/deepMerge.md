[@faasjs/utils](../README.md) / deepMerge

# Function: deepMerge()

# @faasjs/utils

FaasJS cross-runtime utility helpers.

The package bundles pure utilities that work across Node.js, browsers, and edge runtimes,
including deep merge helpers and stream conversion helpers.

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

## Call Signature

> **deepMerge**\<`A`\>(`a`): `A`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored.

### Type Parameters

#### A

`A` _extends_ `object`

### Parameters

#### a

`A`

### Returns

`A`

A cloned merged value built from the provided sources.

### Example

```ts
import { deepMerge } from '@faasjs/utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
```

## Call Signature

> **deepMerge**\<`A`, `B`\>(`a`, `b`): `A` & `B`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored.

### Type Parameters

#### A

`A` _extends_ `object`

#### B

`B` _extends_ `object`

### Parameters

#### a

`A`

#### b

`B`

### Returns

`A` & `B`

A cloned merged value built from the provided sources.

### Example

```ts
import { deepMerge } from '@faasjs/utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
```

## Call Signature

> **deepMerge**\<`A`, `B`, `C`\>(`a`, `b`, `c`): `A` & `B` & `C`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored.

### Type Parameters

#### A

`A` _extends_ `object`

#### B

`B` _extends_ `object`

#### C

`C` _extends_ `object`

### Parameters

#### a

`A`

#### b

`B`

#### c

`C`

### Returns

`A` & `B` & `C`

A cloned merged value built from the provided sources.

### Example

```ts
import { deepMerge } from '@faasjs/utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
```

## Call Signature

> **deepMerge**\<`A`, `B`, `C`, `D`\>(`a`, `b`, `c`, `d`): `A` & `B` & `C` & `D`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored.

### Type Parameters

#### A

`A` _extends_ `object`

#### B

`B` _extends_ `object`

#### C

`C` _extends_ `object`

#### D

`D` _extends_ `object`

### Parameters

#### a

`A`

#### b

`B`

#### c

`C`

#### d

`D`

### Returns

`A` & `B` & `C` & `D`

A cloned merged value built from the provided sources.

### Example

```ts
import { deepMerge } from '@faasjs/utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
```
