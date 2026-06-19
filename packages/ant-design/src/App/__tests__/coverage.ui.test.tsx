import { afterEach, describe, expect, it, vi } from 'vitest'

import { createOnErrorHandler } from '../../App'

describe('App/coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createOnErrorHandler', () => {
    it('should ignore abort errors and surface unknown errors', async () => {
      const messageApi = { error: vi.fn<() => void>() }
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onError = createOnErrorHandler(messageApi)

      await onError('load/test')(new Error('AbortError'))

      expect(messageApi.error).not.toHaveBeenCalled()

      await onError('load/test')({
        toString: () => 'plain object failure',
      })

      expect(messageApi.error).toHaveBeenCalledWith('Unknown error')

      await onError('load/test')(new Error('known failure'))

      expect(messageApi.error).toHaveBeenCalledWith('known failure')
      expect(consoleError).toHaveBeenCalled()
    })
  })
})
