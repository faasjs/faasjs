import { availableParallelism, cpus } from 'node:os'

import type { TestProject } from 'vitest/node'

function getAvailableWorkerCount() {
  return typeof availableParallelism === 'function' ? availableParallelism() : cpus().length
}

function resolveConfiguredWorkerCount(value: unknown) {
  if (typeof value === 'number') return value > 0 ? value : undefined

  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (!trimmedValue) return undefined

    if (trimmedValue.endsWith('%')) {
      const maxWorkers = getAvailableWorkerCount()
      const percentageWorkers = Math.round((Number.parseInt(trimmedValue) / 100) * maxWorkers)

      return Math.max(1, Math.min(maxWorkers, percentageWorkers))
    }

    const numericValue = Number(trimmedValue)

    if (Number.isFinite(numericValue) && numericValue > 0) return numericValue
  }

  return undefined
}

/**
 * Resolves how many worker-scoped resources a Vitest global setup should pre-provision.
 *
 * Vitest does not expose the final worker count on `project.config` when `maxWorkers` is omitted,
 * so test infrastructure that allocates one resource per worker needs to mirror Vitest's default
 * worker selection.
 *
 * @param {Pick<TestProject, 'config' | 'vitest'>} project - Active Vitest project.
 * @returns Worker count that matches the current Vitest run.
 */
export function resolveVitestWorkerCount(project: Pick<TestProject, 'config' | 'vitest'>) {
  const configuredWorkers = resolveConfiguredWorkerCount(
    project.config.maxWorkers ?? process.env.VITEST_MAX_WORKERS,
  )

  if (configuredWorkers) return configuredWorkers

  const maxWorkers = getAvailableWorkerCount()

  if (project.vitest?.config?.watch) return Math.max(Math.floor(maxWorkers / 2), 1)

  return Math.max(maxWorkers - 1, 1)
}
