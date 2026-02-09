import { describe, expect, it, vi } from 'vitest'
import { action } from '../commands/build'
import { runCommand } from '../helper'

vi.mock('../helper', async importOriginal => {
  const actual = await importOriginal<typeof import('../helper')>()

  return {
    ...actual,
    getRootPath: vi.fn(() => '/tmp/faas-build'),
    runCommand: vi.fn(),
  }
})

describe('build command', () => {
  it('should build frontend assets with vite', () => {
    action()

    expect(runCommand).toHaveBeenCalledWith(
      'npm exec vite build',
      '/tmp/faas-build'
    )
  })
})
