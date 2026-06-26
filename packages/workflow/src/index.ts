/**
 * # @faasjs/workflow
 *
 * PostgreSQL-backed persistent workflows for FaasJS.
 *
 * Workflows are explicit TypeScript definitions executed step by step. Use
 * `runWorkflowStep()` from a `.job.ts` file to process at most one step per job
 * invocation, or `runWorkflow()` to run a workflow until it reaches a terminal state.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/workflow @faasjs/pg
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { defineWorkflow, done, next, runWorkflow } from '@faasjs/workflow'
 * import { z } from '@faasjs/utils'
 *
 * const workflow = defineWorkflow({
 *   type: 'agent_workflow',
 *   root: 'plan',
 *   schemas: {
 *     plan: z.object({
 *       taskId: z.string(),
 *     }),
 *     run: z.object({
 *       taskId: z.string(),
 *     }),
 *   },
 *   steps: {
 *     async plan(ctx) {
 *       return next('run', { taskId: ctx.params.taskId })
 *     },
 *     async run() {
 *       return done()
 *     },
 *   },
 * })
 *
 * await runWorkflow(workflow, { params: { taskId: 'task_001' } })
 * ```
 *
 * @packageDocumentation
 */

export { defineWorkflow } from './definition'
export { done, fail, fork, next } from './instructions'
export { runWorkflow, runWorkflowStep, startWorkflow } from './runner'
export { defineWorkflowOptionsSchema } from './types'
export type {
  DefineWorkflowOptions,
  DefineWorkflowOptionsInput,
  DoneWorkflowInstruction,
  FailWorkflowInstruction,
  ForkWorkflowInstruction,
  NextWorkflowInstruction,
  RunWorkflowInput,
  RunWorkflowOptions,
  RunWorkflowResult,
  RunWorkflowStepOptions,
  RunWorkflowStepResult,
  StartWorkflowOptions,
  StartWorkflowResult,
  WorkflowDefinition,
  WorkflowInstruction,
  WorkflowRecord,
  WorkflowStatus,
  WorkflowStepContext,
  WorkflowStepHandler,
  WorkflowStepParams,
  WorkflowStepRecord,
  WorkflowStepSchemas,
  WorkflowStepStatus,
  WorkflowSchemaSteps,
  WorkflowSteps,
  WorkflowStepTarget,
} from './types'
