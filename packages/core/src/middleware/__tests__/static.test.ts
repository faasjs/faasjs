import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { closeAll, Server } from '../../server'

describe('staticHandler', () => {
  let server: Server
  const poolId = Number(process.env.VITEST_POOL_ID || 0)
  const port = 31101 + poolId

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('should work', async () => {
    const useMiddlewareBody = readFileSync(
      join(__dirname, 'funcs', 'useMiddleware.func.ts'),
      'utf-8',
    )
    const defaultBody = readFileSync(join(__dirname, 'funcs', 'default.func.ts'), 'utf-8')

    const response1 = await fetch(`http://127.0.0.1:${port}/useMiddleware.func.ts`)
    expect(response1.status).toBe(200)
    expect(await response1.text()).toBe(useMiddlewareBody)

    const response2 = await fetch(`http://127.0.0.1:${port}/useMiddleware.func.ts`)
    expect(response2.status).toBe(200)
    expect(await response2.text()).toBe(useMiddlewareBody)

    const response3 = await fetch(`http://127.0.0.1:${port}/default.default.func.ts`)
    expect(response3.status).toBe(200)
    expect(await response3.text()).toBe(defaultBody)
  })

  it('notFound', async () => {
    const response1 = await fetch(`http://127.0.0.1:${port}/404`)
    expect(response1.status).toBe(404)
    expect(await response1.text()).toBe('Not Found')

    const response2 = await fetch(`http://127.0.0.1:${port}/404`)
    expect(response2.status).toBe(404)
    expect(await response2.text()).toBe('Not Found')
  })

  it('notFound with fallback path', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/fallback404`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe(
      readFileSync(join(__dirname, 'funcs', 'useMiddleware.func.ts'), 'utf-8'),
    )
  })

  it('notFound with handle function', async () => {
    const response1 = await fetch(`http://127.0.0.1:${port}/custom404`)
    expect(response1.status).toBe(404)
    expect(await response1.text()).toBe('custom404')

    const response2 = await fetch(`http://127.0.0.1:${port}/custom404`)
    expect(response2.status).toBe(404)
    expect(await response2.text()).toBe('custom404')
  })

  it('should support no-cache mode without using static cache map', async () => {
    const response1 = await fetch(`http://127.0.0.1:${port}/noCache404`)
    expect(response1.status).toBe(404)
    expect(await response1.text()).toBe('Not Found')

    const response2 = await fetch(`http://127.0.0.1:${port}/noCache404`)
    expect(response2.status).toBe(404)
    expect(await response2.text()).toBe('Not Found')
  })

  it('should skip static handling for non-GET and hidden paths', async () => {
    const postResponse = await fetch(`http://127.0.0.1:${port}/default.anything`, {
      method: 'POST',
    })

    expect(postResponse.status).toBe(404)
    expect(await postResponse.text()).toBe('Not Found')

    const hiddenResponse = await fetch(`http://127.0.0.1:${port}/.hidden`)

    expect(hiddenResponse.status).toBe(404)
    expect(await hiddenResponse.text()).toBe('Not Found')
  })

  it('should respond 500 when static target is a directory stream', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/default.dir`)

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Internal Server Error')
  })
})
