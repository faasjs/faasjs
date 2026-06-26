[@faasjs/workflow](../README.md) / runWorkflowStep

# Function: runWorkflowStep()

> **runWorkflowStep**(`workflow`, `options?`): `Promise`\<[`RunWorkflowStepResult`](../type-aliases/RunWorkflowStepResult.md)\>

Claim and execute at most one runnable step for a workflow definition.

## Parameters

### workflow

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)

Workflow definition.

### options?

[`RunWorkflowStepOptions`](../type-aliases/RunWorkflowStepOptions.md) = `{}`

Optional claim restrictions and lease settings.

## Returns

`Promise`\<[`RunWorkflowStepResult`](../type-aliases/RunWorkflowStepResult.md)\>

## Example

```ts
import { defineJob } from '@faasjs/jobs'
import { runWorkflowStep } from '@faasjs/workflow'

import { orderWorkflow } from '../workflows/order'

export default defineJob({
  async handler() {
    const result = await runWorkflowStep(orderWorkflow, {
      workerId: 'order-worker',
      leaseSeconds: 60,
    })

    if (!result.claimed) return

    console.log(`Ran step ${result.stepId} for workflow ${result.workflowId}`)
  },
})
```
