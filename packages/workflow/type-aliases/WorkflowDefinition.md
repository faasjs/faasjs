[@faasjs/workflow](../README.md) / WorkflowDefinition

# Type Alias: WorkflowDefinition\<TSteps, TRoot, TSchemas, TMetadataSchema\>

> **WorkflowDefinition**\<`TSteps`, `TRoot`, `TSchemas`, `TMetadataSchema`\> = `Readonly`\<\{ `metadataSchema?`: `TMetadataSchema`; `root`: `TRoot`; `schemas?`: `TSchemas`; `steps`: `TSteps`; `type`: `string`; \}\>

Workflow definition returned by [defineWorkflow](../functions/defineWorkflow.md).

## Type Parameters

### TSteps

`TSteps` _extends_ [`WorkflowSteps`](WorkflowSteps.md) = [`WorkflowSteps`](WorkflowSteps.md)

### TRoot

`TRoot` _extends_ `Extract`\<keyof `TSteps`, `string`\> = `Extract`\<keyof `TSteps`, `string`\>

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md) \| `undefined` = [`WorkflowStepSchemas`](WorkflowStepSchemas.md) \| `undefined`

### TMetadataSchema

`TMetadataSchema` _extends_ `ZodType` \| `undefined` = `ZodType` \| `undefined`
