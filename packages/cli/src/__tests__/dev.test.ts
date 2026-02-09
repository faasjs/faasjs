import { spawn } from 'node:child_process'
import { describe, expect, it, vi } from 'vitest'
import { action } from '../commands/dev'

vi.mock('node:child_process', () => ({
  spawn: vi.fn(() => ({
    kill: vi.fn(),
  })),
}))

describe('dev command', () => {
  it('should start vite dev server', () => {
    process.env.FaasRoot = '/tmp/faas-dev'

    action({ port: 5173 })

    expect(spawn).toHaveBeenCalledWith(
      'npm exec vite -- --host 0.0.0.0 --port 5173',
      {
        cwd: '/tmp/faas-dev',
        shell: true,
        stdio: 'inherit',
      }
    )
  })
})
