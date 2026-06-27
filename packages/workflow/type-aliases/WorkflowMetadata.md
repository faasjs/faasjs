[@faasjs/workflow](../README.md) / WorkflowMetadata

# Type Alias: WorkflowMetadata\<TMetadataSchema\>

> **WorkflowMetadata**\<`TMetadataSchema`\> = `TMetadataSchema` _extends_ `ZodType` ? `SchemaOutput`\<`TMetadataSchema`, `Record`\<`string`, `never`\>\> : `any`

Metadata inferred from a workflow metadata Zod schema.

## Type Parameters

### TMetadataSchema

`TMetadataSchema` _extends_ `ZodType` \| `undefined` = `undefined`
