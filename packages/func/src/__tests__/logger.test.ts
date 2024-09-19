import { useFunc } from '../index'

describe('logger', () => {
  it('should work', async () => {
    const logs: string[] = []

    jest
      .spyOn(console, 'log')
      .mockImplementation((...args) => logs.push(args.join(' ')))

    const func = useFunc(() => {
      return async ({ logger }) => {
        logger.info('test')
      }
    })

    await func.mount()

    expect(logs[0]).toContain('DEBUG [Func] Plugins: handler#handler')

    await func.export().handler({}, { request_id: 'request_id' })

    expect(logs[1]).toContain('DEBUG [request_id] event: {}')
    expect(logs[2]).toContain(
      'DEBUG [request_id] context: {"request_id":"request_id",'
    )
    expect(logs[3]).toContain('DEBUG [request_id] [handler] [onInvoke] begin')
    expect(logs[4]).toContain('INFO [request_id] [handler] [onInvoke] test')
    expect(logs[5]).toContain('DEBUG [request_id] [handler] [onInvoke] end')

    jest.restoreAllMocks()
  })
})
