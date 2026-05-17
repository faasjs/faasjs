import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Logger } from '@faasjs/node-utils'

import type { Middleware } from '../middleware'

/**
 * Extra options for a single {@link Server.handle} call.
 */
export type ServerHandlerOptions = {
  /**
   * Explicit request start timestamp used for response timing headers.
   */
  requestedAt?: number
  /**
   * Force a specific API file path instead of route lookup.
   */
  filepath?: string
}

type Cache = {
  file?: string
  handler?: (...args: any) => Promise<any>
}

type Mounted = {
  pending: [IncomingMessage, ServerResponse<IncomingMessage>, number][]
}

export type { Cache, Mounted }

/**
 * Configuration options for {@link Server}.
 */
export type ServerOptions = {
  /**
   * Port used by {@link Server.listen}.
   *
   * @default 3000
   */
  port?: number

  /**
   * Async hook invoked after the server starts listening.
   *
   * Errors thrown by this hook are reported through the server error logger.
   *
   * @param {object} context - Lifecycle context passed to the start hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the start hook.
   *
   * @example
   * ```ts
   * import { join } from 'node:path'
   * const server = new Server(join(process.cwd(), 'src'), {
   *   onStart: async ({ logger }) => {
   *     logger.info('Server started')
   *   },
   * })
   * ```
   */
  onStart?: (context: { logger: Logger }) => Promise<void>

  /**
   * Async hook invoked when server-level errors occur.
   *
   * This hook receives normalized `Error` instances.
   *
   * @param {Error} error - Error raised during server operation.
   * @param {object} context - Lifecycle context passed to the error hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the error hook.
   *
   * @example
   * ```ts
   * import { join } from 'node:path'
   * const server = new Server(join(process.cwd(), 'src'), {
   *   onError: async (error, { logger }) => {
   *     logger.error(error)
   *   },
   * })
   * ```
   */
  onError?: (error: Error, context: { logger: Logger }) => Promise<void>

  /**
   * Async hook invoked after the server closes.
   *
   * Use this hook for cleanup or shutdown logging.
   *
   * @param {object} context - Lifecycle context passed to the close hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the close hook.
   *
   * @example
   * ```ts
   * import { join } from 'node:path'
   * const server = new Server(join(process.cwd(), 'src'), {
   *   onClose: async ({ logger }) => {
   *     logger.info('Server closed')
   *   },
   * })
   * ```
   */
  onClose?: (context: { logger: Logger }) => Promise<void>

  /**
   * Middleware invoked before each request is dispatched to a FaasJS function.
   *
   * Write to the response to short-circuit normal request handling.
   *
   * @example
   * ```ts
   * import { join } from 'node:path'
   * const server = new Server(join(process.cwd(), 'src'), {
   *   beforeHandle: async (req, res) => {
   *     console.log(`Processing ${req.method} request to ${req.url}`)
   *
   *     if (req.method !== 'POST') res.writeHead(405, { Allow: 'POST' })
   *   },
   * })
   * ```
   */
  beforeHandle?: Middleware
}
