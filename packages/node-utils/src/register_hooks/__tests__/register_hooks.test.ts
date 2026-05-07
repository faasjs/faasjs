import { beforeEach, describe, expect, it, vi } from 'vitest'

const registerNodeModuleHooks = vi.fn<() => void>()

vi.mock('../../load_package', () => ({
  registerNodeModuleHooks,
}))

describe('register_hooks', () => {
  beforeEach(() => {
    registerNodeModuleHooks.mockClear()
    vi.resetModules()
  })

  it('should register hooks on import', async () => {
    await import('../../register_hooks')

    expect(registerNodeModuleHooks).toHaveBeenCalledTimes(1)
  })
})
