[@faasjs/workflow](../README.md) / RunWorkflowOptions

# Type Alias: RunWorkflowOptions

> **RunWorkflowOptions** = `Omit`\<[`RunWorkflowStepOptions`](RunWorkflowStepOptions.md), `"workflowId"`\> & `object`

Options for [runWorkflow](../functions/runWorkflow.md).

## Type Declaration

### maxSteps?

> `optional` **maxSteps?**: `number`

Maximum number of steps to run before throwing.

### pollIntervalMs?

> `optional` **pollIntervalMs?**: `number`

Delay when no step is claimable but the workflow is still running. Defaults to `100`.

### signal?

> `optional` **signal?**: `AbortSignal`

Abort signal used to interrupt the loop.

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Maximum wall-clock duration in milliseconds before throwing.
