[@faasjs/workflow](../README.md) / WorkflowSchemaSteps

# Type Alias: WorkflowSchemaSteps\<TSchemas, TMetadata\>

> **WorkflowSchemaSteps**\<`TSchemas`, `TMetadata`\> = `{ [TName in Extract<keyof TSchemas, string>]: WorkflowStepHandler<WorkflowStepParams<TSchemas, TName>, TMetadata> }`

Step handlers inferred from a Zod schema map.

## Type Parameters

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md)

### TMetadata

`TMetadata` = `any`
