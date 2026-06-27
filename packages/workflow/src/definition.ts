import { formatSchemaError } from '@faasjs/node-utils'
import type { ZodType } from '@faasjs/utils'

import {
  defineWorkflowOptionsSchema,
  type DefineWorkflowOptions,
  type WorkflowDefinition,
  type WorkflowMetadata,
  type WorkflowSchemaSteps,
  type WorkflowStepHandler,
  type WorkflowStepSchemas,
  type WorkflowSteps,
} from './types'

/**
 * Define a workflow. The definition is explicit and is not registered globally.
 * When `schemas` is provided, each step's params are validated with its Zod
 * schema before the handler runs, and `context.params` is inferred from that
 * schema's output type. When `metadataSchema` is provided, workflow metadata is
 * validated when the workflow starts, and `context.metadata` is inferred from
 * that schema's output type.
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
 *   metadataSchema: z.object({
 *     tenantId: z.string(),
 *     reserved: z.boolean().optional(),
 *   }),
 *   steps: {
 *     async reserveInventory({ params, metadata, patchMetadata }) {
 *       await orders.reserveInventory(params.orderId, metadata.tenantId)
 *       await patchMetadata({
 *         reserved: true,
 *       })
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
  const TMetadataSchema extends ZodType,
>(
  options: DefineWorkflowOptions<
    WorkflowSchemaSteps<TSchemas, WorkflowMetadata<TMetadataSchema>>,
    TRoot,
    TSchemas,
    TMetadataSchema
  >,
): WorkflowDefinition<
  WorkflowSchemaSteps<TSchemas, WorkflowMetadata<TMetadataSchema>>,
  TRoot,
  TSchemas,
  TMetadataSchema
>
export function defineWorkflow<
  const TSchemas extends WorkflowStepSchemas,
  const TRoot extends Extract<keyof TSchemas, string>,
>(
  options: DefineWorkflowOptions<WorkflowSchemaSteps<TSchemas>, TRoot, TSchemas>,
): WorkflowDefinition<WorkflowSchemaSteps<TSchemas>, TRoot, TSchemas>
export function defineWorkflow<
  const TMetadataSchema extends ZodType,
  const TStepNames extends string,
  const TRoot extends Extract<TStepNames, string>,
>(
  options: DefineWorkflowOptions<
    Record<TStepNames, WorkflowStepHandler<any, WorkflowMetadata<TMetadataSchema>>>,
    TRoot,
    undefined,
    TMetadataSchema
  >,
): WorkflowDefinition<
  Record<TStepNames, WorkflowStepHandler<any, WorkflowMetadata<TMetadataSchema>>>,
  TRoot,
  undefined,
  TMetadataSchema
>
export function defineWorkflow<
  const TSteps extends WorkflowSteps,
  const TRoot extends Extract<keyof TSteps, string>,
>(options: DefineWorkflowOptions<TSteps, TRoot>): WorkflowDefinition<TSteps, TRoot>
export function defineWorkflow(
  options: DefineWorkflowOptions<
    WorkflowSteps,
    string,
    WorkflowStepSchemas | undefined,
    ZodType | undefined
  >,
): WorkflowDefinition<WorkflowSteps, string, WorkflowStepSchemas | undefined, ZodType | undefined> {
  const result = defineWorkflowOptionsSchema.safeParse(options)

  if (!result.success) {
    throw Error(formatSchemaError(result.error, '[workflow] Invalid workflow definition.'))
  }

  const definition: {
    type: string
    root: string
    steps: WorkflowSteps
    schemas?: WorkflowStepSchemas
    metadataSchema?: ZodType
  } = {
    type: result.data.type,
    root: result.data.root,
    steps: result.data.steps,
  }

  if (result.data.schemas) definition.schemas = result.data.schemas
  if (result.data.metadataSchema) definition.metadataSchema = result.data.metadataSchema

  return Object.freeze(definition) as WorkflowDefinition<
    WorkflowSteps,
    string,
    WorkflowStepSchemas | undefined,
    ZodType | undefined
  >
}
