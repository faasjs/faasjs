/**
 * @jest-environment @happy-dom/jest-environment
 */
import { act, renderHook } from '@testing-library/react'
import { useSplittingState } from '../splittingState'

describe('useSplittingState', () => {
  it('should initialize state variables and their setters', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useSplittingState(initialStates))

    expect(result.current.count).toBe(0)
    expect(result.current.name).toBe('John')
    expect(typeof result.current.setCount).toBe('function')
    expect(typeof result.current.setName).toBe('function')
  })

  it('should update state variables using their setters', () => {
    const initialStates = { count: 0, name: 'John' }
    const { result } = renderHook(() => useSplittingState(initialStates))

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
    const { result } = renderHook(() => useSplittingState(initialStates))

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
})
