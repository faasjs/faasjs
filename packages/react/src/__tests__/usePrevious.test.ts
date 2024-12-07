/**
 * @jest-environment @happy-dom/jest-environment
 */

import { renderHook } from '@testing-library/react'
import { usePrevious } from '../usePrevious'

describe('usePrevious hook', () => {
  test('should return undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious(1))
    expect(result.current).toBeUndefined()
  })

  test('should return the previous value after update', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)
  })

  test('should handle object values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: { a: 1 } },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: { a: 2 } })
    expect(result.current).toEqual({ a: 1 })

    rerender({ value: { a: 3 } })
    expect(result.current).toEqual({ a: 2 })
  })

  test('should handle array values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: [1, 2, 3] },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: [4, 5, 6] })
    expect(result.current).toEqual([1, 2, 3])

    rerender({ value: [7, 8, 9] })
    expect(result.current).toEqual([4, 5, 6])
  })
})
