/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useServerAction } from '../useServerAction'

describe('useServerAction', () => {
  it('should work', async () => {
    const action = jest.fn().mockResolvedValue({ data: {} })
    const { result } = renderHook(() => useServerAction(action))

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.data).toBeUndefined()

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.data).toEqual({})
  })

  it('should call action with params', async () => {
    const params = [1, 2, 3]
    const action = jest.fn().mockResolvedValue({})
    renderHook(() => useServerAction(action, params))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(action).toHaveBeenCalledWith(params)
  })

  it('should set error when action failed', async () => {
    const action = jest.fn().mockResolvedValue({ error: { message: 'error' } })
    const { result } = renderHook(() => useServerAction(action))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(result.current.error).toEqual(Error('error'))
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should set error when action rejects', async () => {
    const action = jest.fn().mockRejectedValue(Error('error'))
    const { result } = renderHook(() => useServerAction(action))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(result.current.error).toMatchObject({ message: 'error' })
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})
