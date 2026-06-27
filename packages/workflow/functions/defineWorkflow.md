[@faasjs/workflow](../README.md) / defineWorkflow

# Function: defineWorkflow()

## Call Signature

> **defineWorkflow**\<`TSchemas`, `TRoot`, `TMetadataSchema`\>(`options`): [`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>, `TRoot`, `TSchemas`, `TMetadataSchema`\>

Define a workflow. The definition is explicit and is not registered globally.
When `schemas` is provided, each step's params are validated with its Zod
schema before the handler runs, and `context.params` is inferred from that
schema's output type. When `metadataSchema` is provided, workflow metadata is
validated when the workflow starts, and `context.metadata` is inferred from
that schema's output type.

### Type Parameters

#### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](../type-aliases/WorkflowStepSchemas.md)

#### TRoot

`TRoot` _extends_ `string`

#### TMetadataSchema

`TMetadataSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

### Parameters

#### options

[`DefineWorkflowOptions`](../type-aliases/DefineWorkflowOptions.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>, `TRoot`, `TSchemas`, `TMetadataSchema`\>

Workflow type, root step name, and step handlers.

### Returns

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>, `TRoot`, `TSchemas`, `TMetadataSchema`\>

### Example

```ts
import { defineWorkflow, done, next } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

export const orderWorkflow = defineWorkflow({
  type: 'order_fulfillment',
  root: 'reserveInventory',
  schemas: {
    reserveInventory: z.object({
      orderId: z.string(),
    }),
    capturePayment: z.object({
      orderId: z.string(),
    }),
  },
  metadataSchema: z.object({
    tenantId: z.string(),
  }),
  steps: {
    async reserveInventory({ params, metadata }) {
      await orders.reserveInventory(params.orderId, metadata.tenantId)

      return next('capturePayment', {
        orderId: params.orderId,
      })
    },
    async capturePayment({ params }) {
      await payments.capture(params.orderId)

      return done({
        orderId: params.orderId,
      })
    },
  },
})
```

## Call Signature

> **defineWorkflow**\<`TSchemas`, `TRoot`\>(`options`): [`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`\>, `TRoot`, `TSchemas`\>

Define a workflow. The definition is explicit and is not registered globally.
When `schemas` is provided, each step's params are validated with its Zod
schema before the handler runs, and `context.params` is inferred from that
schema's output type. When `metadataSchema` is provided, workflow metadata is
validated when the workflow starts, and `context.metadata` is inferred from
that schema's output type.

### Type Parameters

#### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](../type-aliases/WorkflowStepSchemas.md)

#### TRoot

`TRoot` _extends_ `string`

### Parameters

#### options

[`DefineWorkflowOptions`](../type-aliases/DefineWorkflowOptions.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`\>, `TRoot`, `TSchemas`\>

Workflow type, root step name, and step handlers.

### Returns

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<[`WorkflowSchemaSteps`](../type-aliases/WorkflowSchemaSteps.md)\<`TSchemas`\>, `TRoot`, `TSchemas`\>

### Example

```ts
import { defineWorkflow, done, next } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

export const orderWorkflow = defineWorkflow({
  type: 'order_fulfillment',
  root: 'reserveInventory',
  schemas: {
    reserveInventory: z.object({
      orderId: z.string(),
    }),
    capturePayment: z.object({
      orderId: z.string(),
    }),
  },
  metadataSchema: z.object({
    tenantId: z.string(),
  }),
  steps: {
    async reserveInventory({ params, metadata }) {
      await orders.reserveInventory(params.orderId, metadata.tenantId)

      return next('capturePayment', {
        orderId: params.orderId,
      })
    },
    async capturePayment({ params }) {
      await payments.capture(params.orderId)

      return done({
        orderId: params.orderId,
      })
    },
  },
})
```

## Call Signature

> **defineWorkflow**\<`TMetadataSchema`, `TStepNames`, `TRoot`\>(`options`): [`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`Record`\<`TStepNames`, [`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>\>, `TRoot`, `undefined`, `TMetadataSchema`\>

Define a workflow. The definition is explicit and is not registered globally.
When `schemas` is provided, each step's params are validated with its Zod
schema before the handler runs, and `context.params` is inferred from that
schema's output type. When `metadataSchema` is provided, workflow metadata is
validated when the workflow starts, and `context.metadata` is inferred from
that schema's output type.

### Type Parameters

#### TMetadataSchema

`TMetadataSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

#### TStepNames

`TStepNames` _extends_ `string`

#### TRoot

`TRoot` _extends_ `string`

### Parameters

#### options

[`DefineWorkflowOptions`](../type-aliases/DefineWorkflowOptions.md)\<`Record`\<`TStepNames`, [`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>\>, `TRoot`, `undefined`, `TMetadataSchema`\>

Workflow type, root step name, and step handlers.

### Returns

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`Record`\<`TStepNames`, [`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`, [`WorkflowMetadata`](../type-aliases/WorkflowMetadata.md)\<`TMetadataSchema`\>\>\>, `TRoot`, `undefined`, `TMetadataSchema`\>

### Example

```ts
import { defineWorkflow, done, next } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

export const orderWorkflow = defineWorkflow({
  type: 'order_fulfillment',
  root: 'reserveInventory',
  schemas: {
    reserveInventory: z.object({
      orderId: z.string(),
    }),
    capturePayment: z.object({
      orderId: z.string(),
    }),
  },
  metadataSchema: z.object({
    tenantId: z.string(),
  }),
  steps: {
    async reserveInventory({ params, metadata }) {
      await orders.reserveInventory(params.orderId, metadata.tenantId)

      return next('capturePayment', {
        orderId: params.orderId,
      })
    },
    async capturePayment({ params }) {
      await payments.capture(params.orderId)

      return done({
        orderId: params.orderId,
      })
    },
  },
})
```

## Call Signature

> **defineWorkflow**\<`TSteps`, `TRoot`\>(`options`): [`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`TSteps`, `TRoot`\>

Define a workflow. The definition is explicit and is not registered globally.
When `schemas` is provided, each step's params are validated with its Zod
schema before the handler runs, and `context.params` is inferred from that
schema's output type. When `metadataSchema` is provided, workflow metadata is
validated when the workflow starts, and `context.metadata` is inferred from
that schema's output type.

### Type Parameters

#### TSteps

`TSteps` _extends_ [`WorkflowSteps`](../type-aliases/WorkflowSteps.md)

#### TRoot

`TRoot` _extends_ `string`

### Parameters

#### options

[`DefineWorkflowOptions`](../type-aliases/DefineWorkflowOptions.md)\<`TSteps`, `TRoot`\>

Workflow type, root step name, and step handlers.

### Returns

[`WorkflowDefinition`](../type-aliases/WorkflowDefinition.md)\<`TSteps`, `TRoot`\>

### Example

```ts
import { defineWorkflow, done, next } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

export const orderWorkflow = defineWorkflow({
  type: 'order_fulfillment',
  root: 'reserveInventory',
  schemas: {
    reserveInventory: z.object({
      orderId: z.string(),
    }),
    capturePayment: z.object({
      orderId: z.string(),
    }),
  },
  metadataSchema: z.object({
    tenantId: z.string(),
  }),
  steps: {
    async reserveInventory({ params, metadata }) {
      await orders.reserveInventory(params.orderId, metadata.tenantId)

      return next('capturePayment', {
        orderId: params.orderId,
      })
    },
    async capturePayment({ params }) {
      await payments.capture(params.orderId)

      return done({
        orderId: params.orderId,
      })
    },
  },
})
```
