[@faasjs/utils](../README.md) / isObjectRecord

# Function: isObjectRecord()

> **isObjectRecord**(`value`): `value is Record<string, unknown>`

Type guard that checks whether a value is a plain object record.

Uses Zod's `safeParse` to validate that the value is an object with
string keys and unknown values. Returns `false` for arrays, null,
primitives, and other non-plain-object values.

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is Record<string, unknown>`

`true` if the value is a plain object record.

## Example

```ts
import { isObjectRecord } from '@faasjs/utils'

isObjectRecord({ a: 1 }) // true
isObjectRecord([1, 2, 3]) // false
isObjectRecord('hello') // false
isObjectRecord(null) // false
```
