import { DEFAULT_JOB_MAX_ATTEMPTS, DEFAULT_JOB_QUEUE } from './types'

/**
 * Resolve and validate the queue name, using the default if none is provided.
 *
 * @param queue - Queue name or `undefined` to use the default.
 * @returns The validated queue name.
 * @throws {Error} If the queue name is empty or only whitespace.
 */
export function resolveQueue(queue: string | undefined): string {
  const resolved = queue ?? DEFAULT_JOB_QUEUE

  if (!resolved.trim()) throw Error('[jobs] queue must not be empty.')

  return resolved
}

/**
 * Resolve and validate a positive integer option.
 *
 * @param value - The option value or `undefined`.
 * @param fallback - The default value when `value` is `undefined`.
 * @param label - A label used in error messages.
 * @returns The resolved positive integer.
 * @throws {Error} If the resolved value is not a positive integer.
 */
export function resolvePositiveInteger(
  value: number | undefined,
  fallback: number,
  label: string,
): number {
  const resolved = value ?? fallback

  if (!Number.isInteger(resolved) || resolved <= 0)
    throw Error(`[jobs] ${label} must be a positive integer.`)

  return resolved
}

/**
 * Resolve and validate the `maxAttempts` option.
 *
 * @param maxAttempts - The option value or `undefined`.
 * @returns The resolved positive integer.
 * @throws {Error} If the value is not a positive integer.
 */
export function resolveMaxAttempts(maxAttempts: number | undefined): number {
  return resolvePositiveInteger(maxAttempts, DEFAULT_JOB_MAX_ATTEMPTS, 'maxAttempts')
}
