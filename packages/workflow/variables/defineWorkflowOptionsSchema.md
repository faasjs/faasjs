[@faasjs/workflow](../README.md) / defineWorkflowOptionsSchema

# Variable: defineWorkflowOptionsSchema

> `const` **defineWorkflowOptionsSchema**: `ZodObject`\<\{ `metadataSchema`: `ZodOptional`\<`ZodCustom`\<`ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>; `root`: `ZodString`; `schemas`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodCustom`\<`ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>\>; `steps`: `ZodRecord`\<`ZodString`, `ZodCustom`\<[`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`, `any`\>, [`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`, `any`\>\>\>; `type`: `ZodString`; \}, `$strip`\>

Zod schema used to validate [defineWorkflow](../functions/defineWorkflow.md) options.
