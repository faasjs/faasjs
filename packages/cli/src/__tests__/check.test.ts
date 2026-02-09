import { describe, expect, it, vi } from 'vitest'
import { action } from '../commands/check'
import { runCommand } from '../helper'

vi.mock('../helper', async importOriginal => {
  const actual = await importOriginal<typeof import('../helper')>()

  return {
    ...actual,
    getRootPath: vi.fn(() => '/tmp/faas-check'),
    runCommand: vi.fn(),
  }
})

describe('check command', () => {
  it('runs lint, type and test by default', () => {
    action({})

    expect(runCommand).toHaveBeenNthCalledWith(
      1,
      'npm exec biome check .',
      '/tmp/faas-check'
    )
    expect(runCommand).toHaveBeenNthCalledWith(
      2,
      'npm exec tsc --noEmit',
      '/tmp/faas-check'
    )
    expect(runCommand).toHaveBeenNthCalledWith(
      3,
      'npm exec vitest run',
      '/tmp/faas-check'
    )
  })

  it('supports skip flags', () => {
    vi.mocked(runCommand).mockClear()

    action({ test: false })

    expect(runCommand).toHaveBeenCalledTimes(2)
  })
})
