[@faasjs/workflow](../README.md) / WorkflowStepParams

# Type Alias: WorkflowStepParams\<TSchemas, TName\>

> **WorkflowStepParams**\<`TSchemas`, `TName`\> = `TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md) ? `TName` _extends_ keyof `TSchemas` ? `SchemaOutput`\<`TSchemas`\[`TName`\], `Record`\<`string`, `never`\>\> : `Record`\<`string`, `never`\> : `any`

Params inferred from a step's Zod schema.

## Type Parameters

### TSchemas

`TSchemas` _extends_ [`WorkflowStepSchemas`](WorkflowStepSchemas.md) \| `undefined` = `undefined`

### TName

`TName` _extends_ `string` = `string`
