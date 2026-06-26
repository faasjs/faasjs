[@faasjs/utils](../README.md) / isObjectRecord

# Function: isObjectRecord()

> **isObjectRecord**(`value`): `value is Record<string, unknown>`

Type guard that checks whether a value is an object record.

Checks the coarse object shape without validating any required keys or value
shapes; use an explicit Zod schema for trusted business data. Returns `false`
for arrays, null, primitives, and other non-object values.

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is Record<string, unknown>`

`true` if the value is an object record.

## Example

```ts
import { isObjectRecord } from '@faasjs/utils'

isObjectRecord({ a: 1 }) // true
isObjectRecord([1, 2, 3]) // false
isObjectRecord('hello') // false
isObjectRecord(null) // false
```
