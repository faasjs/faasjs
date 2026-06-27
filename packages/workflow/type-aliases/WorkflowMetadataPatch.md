[@faasjs/workflow](../README.md) / WorkflowMetadataPatch

# Type Alias: WorkflowMetadataPatch\<TMetadata\>

> **WorkflowMetadataPatch**\<`TMetadata`\> = `0` _extends_ `1` & `TMetadata` ? `any` : `TMetadata` _extends_ readonly `unknown`[] ? `never` : `TMetadata` _extends_ `object` ? `{ [TKey in keyof TMetadata]?: 0 extends 1 & TMetadata[TKey] ? any : TMetadata[TKey] extends readonly unknown[] ? TMetadata[TKey] : TMetadata[TKey] extends object ? WorkflowMetadataPatch<TMetadata[TKey]> : TMetadata[TKey] }` : `never`

Deep metadata patch accepted by [WorkflowStepContext.patchMetadata](WorkflowStepContext.md#patchmetadata).

## Type Parameters

### TMetadata

`TMetadata`
