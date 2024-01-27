[@faasjs/react](../README.md) / signal

# Function: signal()

> **signal**\<`T`\>(`initialValue`, `options`): `Signal`\<`T`\>

Create a [signal](https://preactjs.com/guide/v10/signals) with options

## Type parameters

• **T** = `any`

## Parameters

• **initialValue**: `any`

• **options**: [`SignalOptions`](../type-aliases/SignalOptions.md)= `{}`

## Returns

`Signal`\<`T`\>

## Example

```ts
import { signal } from '@faasjs/react'

const count = signal(0, { debugName: 'count' })

count.value = 1
```
