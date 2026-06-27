[@faasjs/workflow](../README.md) / runWorkflow

# Function: runWorkflow()

> **runWorkflow**\<`TSteps`, `TRoot`, `TSchemas`, `TMetadataSchema`\>(`workflow`, `input`, `options?`): `Promise`\<[`RunWorkflowResult`](../type-aliases/RunWorkflowResult.md)\>

Run a workflow until it completes, fails, or is cancelled.

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](../type-aliases/WorkflowSteps.md)

### TRoot

`TRoot` _extends_ `string`

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](../type-aliases/WorkflowStepSchemas.md) \| `undefined` = `undefined`

### TMetadataSchema

`TMetadataSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

## Parameters

### workflow

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`TSteps`, `TRoot`, `TSchemas`, `TMetadataSchema`\>

Workflow definition.

### input

[`RunWorkflowInput`](../type-aliases/RunWorkflowInput.md)\<[`WorkflowStepParams`](../type-aliases/WorkflowStepParams.md)\<`TSchemas`, `TRoot`\>, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>

Params and metadata for a new workflow, or workflow id to resume.

### options?

[`RunWorkflowOptions`](../type-aliases/RunWorkflowOptions.md) = `{}`

Loop limits and lease settings.

## Returns

`Promise`\<[`RunWorkflowResult`](../type-aliases/RunWorkflowResult.md)\>

## Example

```ts
import { runWorkflow } from '@faasjs/workflow'

import { orderWorkflow } from './workflows/order'

const result = await runWorkflow(
  orderWorkflow,
  {
    params: {
      orderId: 'order_001',
    },
    metadata: {
      tenantId: 'tenant_001',
    },
  },
  {
    maxSteps: 20,
    timeoutMs: 30_000,
  },
)

console.log(`Workflow ${result.workflowId} finished as ${result.status}`)
```
