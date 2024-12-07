/**
 * @jest-environment @happy-dom/jest-environment
 */

import { act, renderHook } from '@testing-library/react'
import { useStateRef } from '../useStateRef'

describe('useStateRef', () => {
  it('should initialize state and ref with the initial value', () => {
    const { result } = renderHook(() => useStateRef(0))

    const [state, , ref] = result.current

    expect(state).toBe(0)
    expect(ref.current).toBe(0)
  })

  it('should update state and ref when setState is called', () => {
    const { result } = renderHook(() => useStateRef<number>())

    const [, setState, ref] = result.current

    act(() => {
      setState(1)
    })

    const [state] = result.current

    expect(state).toBe(1)
    expect(ref.current).toBe(1)
  })

  it('should keep ref in sync with state', () => {
    const { result } = renderHook(() => useStateRef())

    const [, setState, ref] = result.current

    act(() => {
      setState(1)
    })

    expect(ref.current).toBe(1)

    act(() => {
      setState(2)
    })

    expect(ref.current).toBe(2)
  })
})
