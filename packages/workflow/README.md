# @faasjs/workflow

# @faasjs/workflow

PostgreSQL-backed persistent workflows for FaasJS.

Workflows are explicit TypeScript definitions executed step by step. Use
`runWorkflowStep()` from a `.job.ts` file to process at most one step per job
invocation, or `runWorkflow()` to run a workflow until it reaches a terminal state.

## Install

```sh
npm install @faasjs/workflow @faasjs/pg
```

## Usage

```ts
import { defineWorkflow, done, next, runWorkflow } from '@faasjs/workflow'
import { z } from '@faasjs/utils'

const workflow = defineWorkflow({
  type: 'agent_workflow',
  root: 'plan',
  schemas: {
    plan: z.object({
      taskId: z.string(),
    }),
    run: z.object({
      taskId: z.string(),
    }),
  },
  steps: {
    async plan(ctx) {
      return next('run', { taskId: ctx.params.taskId })
    },
    async run() {
      return done()
    },
  },
})

await runWorkflow(workflow, { params: { taskId: 'task_001' } })
```

## Functions

- [defineWorkflow](functions/defineWorkflow.md)
- [done](functions/done.md)
- [fail](functions/fail.md)
- [fork](functions/fork.md)
- [next](functions/next.md)
- [runWorkflow](functions/runWorkflow.md)
- [runWorkflowStep](functions/runWorkflowStep.md)
- [startWorkflow](functions/startWorkflow.md)

## Type Aliases

- [DefineWorkflowOptions](type-aliases/DefineWorkflowOptions.md)
- [DefineWorkflowOptionsInput](type-aliases/DefineWorkflowOptionsInput.md)
- [DoneWorkflowInstruction](type-aliases/DoneWorkflowInstruction.md)
- [FailWorkflowInstruction](type-aliases/FailWorkflowInstruction.md)
- [ForkWorkflowInstruction](type-aliases/ForkWorkflowInstruction.md)
- [NextWorkflowInstruction](type-aliases/NextWorkflowInstruction.md)
- [RunWorkflowInput](type-aliases/RunWorkflowInput.md)
- [RunWorkflowOptions](type-aliases/RunWorkflowOptions.md)
- [RunWorkflowResult](type-aliases/RunWorkflowResult.md)
- [RunWorkflowStepOptions](type-aliases/RunWorkflowStepOptions.md)
- [RunWorkflowStepResult](type-aliases/RunWorkflowStepResult.md)
- [StartWorkflowOptions](type-aliases/StartWorkflowOptions.md)
- [StartWorkflowResult](type-aliases/StartWorkflowResult.md)
- [WorkflowDefinition](type-aliases/WorkflowDefinition.md)
- [WorkflowInstruction](type-aliases/WorkflowInstruction.md)
- [WorkflowRecord](type-aliases/WorkflowRecord.md)
- [WorkflowSchemaSteps](type-aliases/WorkflowSchemaSteps.md)
- [WorkflowStatus](type-aliases/WorkflowStatus.md)
- [WorkflowStepContext](type-aliases/WorkflowStepContext.md)
- [WorkflowStepHandler](type-aliases/WorkflowStepHandler.md)
- [WorkflowStepParams](type-aliases/WorkflowStepParams.md)
- [WorkflowStepRecord](type-aliases/WorkflowStepRecord.md)
- [WorkflowSteps](type-aliases/WorkflowSteps.md)
- [WorkflowStepSchemas](type-aliases/WorkflowStepSchemas.md)
- [WorkflowStepStatus](type-aliases/WorkflowStepStatus.md)
- [WorkflowStepTarget](type-aliases/WorkflowStepTarget.md)

## Variables

- [defineWorkflowOptionsSchema](variables/defineWorkflowOptionsSchema.md)
