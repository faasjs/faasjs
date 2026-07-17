import { act, renderHook } from '@testing-library/react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import { assertType, describe, expect, it } from 'vitest'

import { useStates, useStatesRef } from '../../useStates'

describe('useStates', () => {
  it('should initialize state variables and their setters', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useStates(initialStates))

    expect(result.current.count).toBe(0)
    expect(result.current.name).toBe('John')
    expect(typeof result.current.setCount).toBe('function')
    expect(typeof result.current.setName).toBe('function')
  })

  it('should update state variables using their setters', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useStates(initialStates))

    act(() => {
      result.current.setCount(10)
    })

    act(() => {
      result.current.setName('Doe')
    })

    expect(result.current.count).toBe(10)
    expect(result.current.name).toBe('Doe')
  })

  it('should handle multiple state variables', () => {
    const initialStates = { count: 0, name: 'John', age: 25 }
    const { result } = renderHook(() => useStates(initialStates))

    expect(result.current.count).toBe(0)
    expect(result.current.name).toBe('John')
    expect(result.current.age).toBe(25)
    expect(typeof result.current.setCount).toBe('function')
    expect(typeof result.current.setName).toBe('function')
    expect(typeof result.current.setAge).toBe('function')

    act(() => {
      result.current.setCount(5)
      result.current.setName('Jane')
      result.current.setAge(30)
    })

    expect(result.current.count).toBe(5)
    expect(result.current.name).toBe('Jane')
    expect(result.current.age).toBe(30)
  })

  it('keeps a stable hook order when state keys change', () => {
    const { result, rerender } = renderHook(
      ({ initialStates }: { initialStates: Record<string, any> }) => useStates(initialStates),
      { initialProps: { initialStates: { count: 0 } as Record<string, any> } },
    )

    expect(() =>
      rerender({
        initialStates: { count: 0, name: 'John' },
      }),
    ).not.toThrow()

    act(() => {
      result.current.setName('Doe')
    })

    expect(result.current.name).toBe('Doe')

    expect(() => rerender({ initialStates: { name: 'John' } })).not.toThrow()
    expect(result.current.name).toBe('Doe')
  })
})

describe('useStatesRef', () => {
  it('should initialize state variables, setters, and refs', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useStatesRef(initialStates))

    expect(result.current.count).toBe(0)
    expect(result.current.name).toBe('John')
    expect(typeof result.current.setCount).toBe('function')
    expect(typeof result.current.setName).toBe('function')
    expect(result.current.countRef.current).toBe(0)
    expect(result.current.nameRef.current).toBe('John')
  })

  it('should update state variables and refs using their setters', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useStatesRef(initialStates))

    act(() => {
      result.current.setCount(10)
    })

    act(() => {
      result.current.setName('Doe')
    })

    expect(result.current.count).toBe(10)
    expect(result.current.name).toBe('Doe')
    expect(result.current.countRef.current).toBe(10)
    expect(result.current.nameRef.current).toBe('Doe')
  })

  it('should handle multiple state refs', () => {
    const initialStates = { count: 0, name: 'John', age: 25 }
    const { result } = renderHook(() => useStatesRef(initialStates))

    expect(result.current.countRef.current).toBe(0)
    expect(result.current.nameRef.current).toBe('John')
    expect(result.current.ageRef.current).toBe(25)

    act(() => {
      result.current.setCount(5)
      result.current.setName('Jane')
      result.current.setAge(30)
    })

    expect(result.current.count).toBe(5)
    expect(result.current.name).toBe('Jane')
    expect(result.current.age).toBe(30)
    expect(result.current.countRef.current).toBe(5)
    expect(result.current.nameRef.current).toBe('Jane')
    expect(result.current.ageRef.current).toBe(30)
  })

  it('should infer setter and ref types', () => {
    const { result } = renderHook(() => useStatesRef({ count: 0 }))

    assertType<Dispatch<SetStateAction<number>>>(result.current.setCount)
    assertType<RefObject<number>>(result.current.countRef)
  })

  it('keeps a stable hook order when ref keys change', () => {
    const { result, rerender } = renderHook(
      ({ initialStates }: { initialStates: Record<string, any> }) => useStatesRef(initialStates),
      { initialProps: { initialStates: { count: 0 } as Record<string, any> } },
    )

    expect(() =>
      rerender({
        initialStates: { count: 0, name: 'John' },
      }),
    ).not.toThrow()

    act(() => {
      result.current.setName('Doe')
    })

    expect(result.current.name).toBe('Doe')
    expect(result.current.nameRef.current).toBe('Doe')
  })
})
