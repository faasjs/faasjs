import { join } from 'node:path'
import { request } from '@faasjs/request'
import { vi } from 'vitest'
import { Server } from '../../server'

describe('server', () => {
  it('should handle SIGTERM and SIGINT', async () => {
    const port = 3002 + Number(process.env.VITEST_POOL_ID)
    const onClose = vi.fn().mockImplementation(async () => { })
    const serverA = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverA.listen()

    await new Promise(resolve => setTimeout(resolve, 10))
    const resA = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGTERM')

    expect(await resA).toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(onClose).toHaveBeenCalled()

    const serverB = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverB.listen()

    await new Promise(resolve => setTimeout(resolve, 10))

    const resB = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGINT')

    await expect(resB).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
