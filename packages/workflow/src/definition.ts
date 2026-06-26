import { formatSchemaError } from '@faasjs/node-utils'

import {
  defineWorkflowOptionsSchema,
  type DefineWorkflowOptions,
  type WorkflowDefinition,
  type WorkflowSchemaSteps,
  type WorkflowStepSchemas,
  type WorkflowSteps,
} from './types'

/**
 * Define a workflow. The definition is explicit and is not registered globally.
 * When `schemas` is provided, each step's params are validated with its Zod
 * schema before the handler runs, and `context.params` is inferred from that
 * schema's output type.
 *
 * @param options - Workflow type, root step name, and step handlers.
 *
 * @example
 * ```ts
 * import { defineWorkflow, done, next } from '@faasjs/workflow'
 * import { z } from '@faasjs/utils'
 *
 * export const orderWorkflow = defineWorkflow({
 *   type: 'order_fulfillment',
 *   root: 'reserveInventory',
 *   schemas: {
 *     reserveInventory: z.object({
 *       orderId: z.string(),
 *     }),
 *     capturePayment: z.object({
 *       orderId: z.string(),
 *     }),
 *   },
 *   steps: {
 *     async reserveInventory({ params }) {
 *       await orders.reserveInventory(params.orderId)
 *
 *       return next('capturePayment', {
 *         orderId: params.orderId,
 *       })
 *     },
 *     async capturePayment({ params }) {
 *       await payments.capture(params.orderId)
 *
 *       return done({
 *         orderId: params.orderId,
 *       })
 *     },
 *   },
 * })
 * ```
 */
export function defineWorkflow<
  const TSchemas extends WorkflowStepSchemas,
  const TRoot extends Extract<keyof TSchemas, string>,
>(
  options: DefineWorkflowOptions<WorkflowSchemaSteps<TSchemas>, TRoot, TSchemas>,
): WorkflowDefinition<WorkflowSchemaSteps<TSchemas>, TRoot, TSchemas>
export function defineWorkflow<
  const TSteps extends WorkflowSteps,
  const TRoot extends Extract<keyof TSteps, string>,
>(options: DefineWorkflowOptions<TSteps, TRoot>): WorkflowDefinition<TSteps, TRoot>
export function defineWorkflow(
  options: DefineWorkflowOptions<WorkflowSteps, string, WorkflowStepSchemas | undefined>,
): WorkflowDefinition<WorkflowSteps, string, WorkflowStepSchemas | undefined> {
  const result = defineWorkflowOptionsSchema.safeParse(options)

  if (!result.success) {
    throw Error(formatSchemaError(result.error, '[workflow] Invalid workflow definition.'))
  }

  return Object.freeze(
    result.data.schemas
      ? {
          type: result.data.type,
          root: result.data.root,
          steps: result.data.steps,
          schemas: result.data.schemas,
        }
      : {
          type: result.data.type,
          root: result.data.root,
          steps: result.data.steps,
        },
  )
}
