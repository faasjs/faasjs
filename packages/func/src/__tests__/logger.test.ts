import { describe, expect, it, vi } from 'vitest'
import { useFunc } from '../index'

describe('logger', () => {
  it('should work', async () => {
    const logs: string[] = []

    vi.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')))

    const func = useFunc(() => {
      return async ({ logger }) => {
        logger.info('test')
      }
    })

    await func.mount()

    expect(logs[0]).toContain('DEBUG [Func] plugins: handler#handler')

    await func.export().handler({}, { request_id: 'request_id' })

    expect(logs[1]).toContain('DEBUG [request_id] [handler] [onInvoke] begin')
    expect(logs[2]).toContain('INFO [request_id] [handler] [onInvoke] test')
    expect(logs[3]).toContain('DEBUG [request_id] [handler] [onInvoke] end')

    vi.restoreAllMocks()
  })
})
