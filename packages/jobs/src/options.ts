import { DEFAULT_JOB_MAX_ATTEMPTS, DEFAULT_JOB_QUEUE } from './types'

export function resolveQueue(queue: string | undefined): string {
  const resolved = queue ?? DEFAULT_JOB_QUEUE

  if (!resolved.trim()) throw Error('[jobs] queue must not be empty.')

  return resolved
}

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

export function resolveMaxAttempts(maxAttempts: number | undefined): number {
  return resolvePositiveInteger(maxAttempts, DEFAULT_JOB_MAX_ATTEMPTS, 'maxAttempts')
}
