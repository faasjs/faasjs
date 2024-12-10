import { join } from 'node:path'
import { request } from '@faasjs/request'
import { Server } from '../../server'

describe('server', () => {
  it('should handle SIGTERM and SIGINT', async () => {
    const port = 3002 + Number(process.env.JEST_WORKER_ID)
    const serverA = new Server(join(__dirname, 'funcs'), { port })
    serverA.listen()

    const closeSpyA = jest.spyOn(serverA, 'close')

    await new Promise(resolve => setTimeout(resolve, 10))
    const resA = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGTERM')

    expect(await resA).toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(closeSpyA).toHaveBeenCalled()

    const serverB = new Server(join(__dirname, 'funcs'), { port })
    serverB.listen()

    const closeSpyB = jest.spyOn(serverB, 'close')

    await new Promise(resolve => setTimeout(resolve, 10))
    const resB = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGINT')

    await expect(resB).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(closeSpyB).toHaveBeenCalled()
  })
})
