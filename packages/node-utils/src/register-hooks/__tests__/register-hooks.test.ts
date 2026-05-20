import { beforeEach, describe, expect, it, vi } from 'vitest'

const registerNodeModuleHooks = vi.fn<() => void>()

vi.mock('../../load-package', () => ({
  registerNodeModuleHooks,
}))

describe('register-hooks', () => {
  beforeEach(() => {
    registerNodeModuleHooks.mockClear()
    vi.resetModules()
  })

  it('should register hooks on import', async () => {
    await import('../../register-hooks')

    expect(registerNodeModuleHooks).toHaveBeenCalledTimes(1)
  })
})
