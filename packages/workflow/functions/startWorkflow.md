[@faasjs/workflow](../README.md) / startWorkflow

# Function: startWorkflow()

> **startWorkflow**\<`TSteps`, `TRoot`, `TSchemas`, `TMetadataSchema`\>(`workflow`, `options?`): `Promise`\<[`StartWorkflowResult`](../type-aliases/StartWorkflowResult.md)\>

Create a workflow row and its root runnable step.

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

### options?

[`StartWorkflowOptions`](../type-aliases/StartWorkflowOptions.md)\<[`WorkflowStepParams`](../type-aliases/WorkflowStepParams.md)\<`TSchemas`, `TRoot`\>, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\> = `{}`

Root step params and workflow metadata.

## Returns

`Promise`\<[`StartWorkflowResult`](../type-aliases/StartWorkflowResult.md)\>

## Example

```ts
import { startWorkflow } from '@faasjs/workflow'

import { orderWorkflow } from './workflows/order'

const { workflowId } = await startWorkflow(orderWorkflow, {
  params: {
    orderId: 'order_001',
  },
  metadata: {
    tenantId: 'tenant_001',
  },
})

console.log(`Started workflow ${workflowId}`)
```
