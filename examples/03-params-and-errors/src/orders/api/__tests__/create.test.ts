import { test } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { func } from '../create.func'

describe('orders/api/create', () => {
  const wrapped = test(func)

  it('returns success payload when params are valid', async () => {
    const response = await wrapped.JSONhandler({
      title: 'Book',
      price: 18,
      quantity: 2,
    })

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      id: 'demo-order',
      title: 'Book',
      total: 36,
    })
  })

  it('returns 400 when params are invalid', async () => {
    const response = await wrapped.JSONhandler({
      title: '',
      price: -1,
    } as any)

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('returns custom status code from HttpError', async () => {
    const response = await wrapped.JSONhandler({
      title: 'duplicate',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(409)
    expect(response.error).toEqual({
      message: 'Order title already exists',
    })
  })

  it('returns 500 for unexpected errors', async () => {
    const response = await wrapped.JSONhandler({
      title: 'explode',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(500)
    expect(response.error).toEqual({
      message: 'Unexpected failure',
    })
  })
})
