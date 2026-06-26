[@faasjs/workflow](../README.md) / WorkflowSchemaSteps

# Type Alias: WorkflowSchemaSteps\<TSchemas\>

> **WorkflowSchemaSteps**\<`TSchemas`\> = `{ [TName in Extract<keyof TSchemas, string>]: WorkflowStepHandler<WorkflowStepParams<TSchemas, TName>> }`

Step handlers inferred from a Zod schema map.

## Type Parameters

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md)
