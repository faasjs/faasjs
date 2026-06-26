[@faasjs/workflow](../README.md) / next

# Function: next()

> **next**(`name`, `params?`): [`NextWorkflowInstruction`](../type-aliases/NextWorkflowInstruction.md)

Mark the current step as done and create a next runnable step.

## Parameters

### name

`string`

Target step name.

### params?

`unknown`

Params passed to the target step.

## Returns

[`NextWorkflowInstruction`](../type-aliases/NextWorkflowInstruction.md)

## Example

```ts
import { next } from '@faasjs/workflow'

async function reserveInventory({ params }) {
  await reserveInventoryForOrder(params.orderId)

  return next('capturePayment', {
    orderId: params.orderId,
  })
}
```
