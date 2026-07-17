[**@faasjs/utils**](../README.md)

[@faasjs/utils](../README.md) / deepMerge

# Function: deepMerge()

## Call Signature

> **deepMerge**\<`A`>>>>>>\>(`a`): `A`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored. Non-plain object instances such as `Date`
are treated as replacement values instead of recursively merged.

### Type Parameters

#### A

`A` _extends_ `object`

### Parameters

#### a

`A`

First object or array to clone into the merged result. Later overload arguments are merged from left to right.

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

> **deepMerge**\<`A`, `B`>>>>>>\>(`a`, `b`): `A` & `B`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored. Non-plain object instances such as `Date`
are treated as replacement values instead of recursively merged.

### Type Parameters

#### A

`A` _extends_ `object`

#### B

`B` _extends_ `object`

### Parameters

#### a

`A`

First object or array to clone into the merged result. Later overload arguments are merged from left to right.

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

> **deepMerge**\<`A`, `B`, `C`>>>>>>\>(`a`, `b`, `c`): `A` & `B` & `C`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored. Non-plain object instances such as `Date`
are treated as replacement values instead of recursively merged.

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

First object or array to clone into the merged result. Later overload arguments are merged from left to right.

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

> **deepMerge**\<`A`, `B`, `C`, `D`>>>>>>\>(`a`, `b`, `c`, `d`): `A` & `B` & `C` & `D`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored. Non-plain object instances such as `Date`
are treated as replacement values instead of recursively merged.

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

First object or array to clone into the merged result. Later overload arguments are merged from left to right.

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
