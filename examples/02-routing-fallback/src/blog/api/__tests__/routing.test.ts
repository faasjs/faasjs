import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { closeAll, Server } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe.sequential('routing fallback', () => {
  const poolId = Number(process.env.VITEST_POOL_ID || 0)
  const port = 31320 + poolId

  beforeAll(() => {
    const root = join(__dirname, '..', '..', '..')

    new Server(root, {
      port,
    }).listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('matches index.func.ts', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/blog/api`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{}',
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toEqual({
      route: 'blog/api/index',
    })
  })

  it('falls back to blog/api/default.func.ts', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/blog/api/unknown`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{}',
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toEqual({
      route: 'blog/api/default',
      path: '/blog/api/unknown',
    })
  })

  it('matches exact file first, then nested default fallback', async () => {
    const hitCreate = await fetch(`http://127.0.0.1:${port}/blog/api/post/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{}',
    })

    const createBody = await hitCreate.json()

    expect(hitCreate.status).toBe(200)
    expect(createBody.data).toEqual({
      route: 'blog/api/post/create',
      created: true,
    })

    const hitNestedDefault = await fetch(`http://127.0.0.1:${port}/blog/api/post/not-found`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{}',
    })

    const nestedBody = await hitNestedDefault.json()

    expect(hitNestedDefault.status).toBe(200)
    expect(nestedBody.data).toEqual({
      route: 'blog/api/post/default',
      path: '/blog/api/post/not-found',
    })
  })
})
