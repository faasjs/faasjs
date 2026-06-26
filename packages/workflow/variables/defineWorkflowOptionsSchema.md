[@faasjs/workflow](../README.md) / defineWorkflowOptionsSchema

# Variable: defineWorkflowOptionsSchema

> `const` **defineWorkflowOptionsSchema**: `ZodObject`\<\{ `root`: `ZodString`; `schemas`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodCustom`\<`ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>\>; `steps`: `ZodRecord`\<`ZodString`, `ZodCustom`\<[`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`\>, [`WorkflowStepHandler`](../type-aliases/WorkflowStepHandler.md)\<`any`\>\>\>; `type`: `ZodString`; \}, `$strip`\>

Zod schema used to validate [defineWorkflow](../functions/defineWorkflow.md) options.
