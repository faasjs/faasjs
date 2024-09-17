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

    expect(logs[0]).toContain('DEBUG [Func] onMount')
    expect(logs[1]).toContain('DEBUG [Func] Plugins: Handler#Handler')
    expect(logs[2]).toContain('DEBUG [Func] mounted')

    await func.export().handler({}, { request_id: 'request_id' })

    expect(logs[3]).toContain('DEBUG [request_id] event: {}')
    expect(logs[4]).toContain(
      'DEBUG [request_id] context: {"request_id":"request_id",'
    )
    expect(logs[5]).toContain('DEBUG [request_id] [Handler] [onInvoke] begin')
    expect(logs[6]).toContain('INFO [request_id] [Handler] [onInvoke] test')
    expect(logs[7]).toContain('DEBUG [request_id] [Handler] [onInvoke] end')

    jest.restoreAllMocks()
  })
})
