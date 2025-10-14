import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  equal,
  useEqualCallback,
  useEqualEffect,
  useEqualMemo,
  useEqualMemoize,
} from '../equal'

describe('equal function', () => {
  it('should return true for identical primitives', () => {
    expect(equal(1, 1)).toBe(true)
    expect(equal('test', 'test')).toBe(true)
    expect(equal(true, true)).toBe(true)
  })

  it('should return false for different primitives', () => {
    expect(equal(1, 2)).toBe(false)
    expect(equal('test', 'Test')).toBe(false)
    expect(equal(true, false)).toBe(false)
  })

  it('should return true for NaN values', () => {
    expect(equal(Number.NaN, Number.NaN)).toBe(true)
  })

  it('should return true for identical arrays', () => {
    expect(equal([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for different arrays', () => {
    expect(equal([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(equal([1, 2, 3], [1, 2])).toBe(false)
  })

  it('should return true for identical dates', () => {
    expect(equal(new Date('2021-01-01'), new Date('2021-01-01'))).toBe(true)
  })

  it('should return false for different dates', () => {
    expect(equal(new Date('2021-01-01'), new Date('2022-01-01'))).toBe(false)
  })

  it('should return true for identical regex', () => {
    expect(equal(/abc/, /abc/)).toBe(true)
  })

  it('should return false for different regex', () => {
    expect(equal(/abc/, /def/)).toBe(false)
  })

  it('should return true for identical functions', () => {
    const fn1 = () => {}
    const fn2 = () => {}
    expect(equal(fn1, fn2)).toBe(true)
  })

  it('should return false for different functions', () => {
    const fn1 = () => 1
    const fn2 = () => 2
    expect(equal(fn1, fn2)).toBe(false)
  })

  it('should return true for async identical functions', () => {
    const fn1 = async () => {}
    const fn2 = async () => {}
    expect(equal(fn1, fn2)).toBe(true)
  })

  it('should return false for sync and async functions', () => {
    const fn1 = async () => {}
    const fn2 = () => {}
    expect(equal(fn1, fn2)).toBe(false)
  })

  it('should return true for identical objects', () => {
    expect(equal({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(equal({ a: 1, b: 2, c: undefined, d: null }, { a: 1, b: 2 })).toBe(
      true
    )
    expect(equal({ a: 1, b: 2 }, { a: 1, b: 2, c: undefined, d: null })).toBe(
      true
    )
  })

  it('should return false for different objects', () => {
    expect(equal({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
    expect(equal({ a: 1, b: 2 }, { a: 1 })).toBe(false)
  })

  it('should return true for null or undefined values', () => {
    expect(equal(null, null)).toBe(true)
    expect(equal(undefined, undefined)).toBe(true)
    expect(equal(null, undefined)).toBe(true)
    expect(equal(undefined, null)).toBe(true)
  })

  it('should return false for null or undefined compared to other values', () => {
    expect(equal(null, 1)).toBe(false)
    expect(equal({}, null)).toBe(false)
    expect(equal(undefined, 'test')).toBe(false)
    expect(equal({}, undefined)).toBe(false)
    expect(equal(null, {})).toBe(false)
  })
})

describe('useEqualMemoize hook', () => {
  it('should memoize the value if it is equal to the previous value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useEqualMemoize(value),
      {
        initialProps: { value: { a: 1, b: 2 } },
      }
    )

    expect(result.current).toEqual({ a: 1, b: 2 })

    rerender({ value: { a: 1, b: 2 } })
    expect(result.current).toEqual({ a: 1, b: 2 })
  })

  it('should update the memoized value if it is not equal to the previous value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useEqualMemoize(value),
      {
        initialProps: { value: { a: 1, b: 2 } },
      }
    )

    expect(result.current).toEqual({ a: 1, b: 2 })

    rerender({ value: { a: 1, b: 3 } })
    expect(result.current).toEqual({ a: 1, b: 3 })
  })

  it('should handle primitive values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useEqualMemoize(value),
      {
        initialProps: { value: 1 },
      }
    )

    expect(result.current).toBe(1)

    rerender({ value: 1 })
    expect(result.current).toBe(1)

    rerender({ value: 2 })
    expect(result.current).toBe(2)
  })

  it('should handle arrays', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useEqualMemoize(value),
      {
        initialProps: { value: [1, 2, 3] },
      }
    )

    expect(result.current).toEqual([1, 2, 3])

    rerender({ value: [1, 2, 3] })
    expect(result.current).toEqual([1, 2, 3])

    rerender({ value: [1, 2, 4] })
    expect(result.current).toEqual([1, 2, 4])
  })
})

describe('useEqualEffect hook', () => {
  it('should call the callback when dependencies change', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useEqualEffect(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 3] })
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 4] })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call the callback when dependencies are equal', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useEqualEffect(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 3] })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle primitive dependencies', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useEqualEffect(callback, deps),
      {
        initialProps: { deps: [1] },
      }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1] })
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [2] })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should handle object dependencies', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useEqualEffect(callback, deps),
      {
        initialProps: { deps: [{ a: 1 }] },
      }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [{ a: 1 }] })
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [{ a: 2 }] })
    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('useEqualMemo hook', () => {
  it('should memoize the result if dependencies are equal', () => {
    const callback = vi.fn(() => 42)
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualMemo(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 3] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should recompute the result if dependencies change', () => {
    const callback = vi.fn(() => 42)
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualMemo(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 4] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should handle primitive dependencies', () => {
    const callback = vi.fn(() => 42)
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualMemo(callback, deps),
      {
        initialProps: { deps: [1] },
      }
    )

    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [2] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should handle object dependencies', () => {
    const callback = vi.fn(() => 42)
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualMemo(callback, deps),
      {
        initialProps: { deps: [{ a: 1 }] },
      }
    )

    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [{ a: 1 }] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [{ a: 2 }] })
    expect(result.current).toBe(42)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('useEqualCallback hook', () => {
  it('should memoize the callback if dependencies are equal', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualCallback(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    const memoizedCallback = result.current
    memoizedCallback()
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 3] })
    expect(result.current).toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should update the memoized callback if dependencies change', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualCallback(callback, deps),
      {
        initialProps: { deps: [1, 2, 3] },
      }
    )

    const memoizedCallback = result.current
    memoizedCallback()
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1, 2, 4] })
    expect(result.current).not.toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should handle primitive dependencies', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualCallback(callback, deps),
      {
        initialProps: { deps: [1] },
      }
    )

    const memoizedCallback = result.current
    memoizedCallback()
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [1] })
    expect(result.current).toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(2)

    rerender({ deps: [2] })
    expect(result.current).not.toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('should handle object dependencies', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      ({ deps }) => useEqualCallback(callback, deps),
      {
        initialProps: { deps: [{ a: 1 }] },
      }
    )

    const memoizedCallback = result.current
    memoizedCallback()
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ deps: [{ a: 1 }] })
    expect(result.current).toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(2)

    rerender({ deps: [{ a: 2 }] })
    expect(result.current).not.toBe(memoizedCallback)
    result.current()
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
