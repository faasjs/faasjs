import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { closeAll, Server } from '../../server'

describe('middleware', () => {
  let server: Server
  const poolId = Number(process.env.VITEST_POOL_ID || 0)
  const port = 31001 + poolId

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('useMiddleware', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/useMiddleware`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('useMiddleware')
  })

  it('emptyMiddleware', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/emptyUseMiddleware`)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })

  it('useMiddlewares', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/useMiddlewares`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('useMiddlewares')
  })

  it('emptyMiddlewares', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/emptyUseMiddlewares`)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })

  it('middleware error', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/error`)
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Internal Server Error')
  })

  it('middleware business 500', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/business-500`)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: { message: 'business-500' } })
  })
})
