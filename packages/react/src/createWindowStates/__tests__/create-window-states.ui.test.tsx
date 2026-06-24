import { act, renderHook } from '@testing-library/react'
import type { Dispatch, SetStateAction } from 'react'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { createWindowStates, type WindowStateRef } from '../../createWindowStates'

describe('createWindowStates', () => {
  it('should read default values', () => {
    const states = createWindowStates({ count: 0, text: '' })

    const { result } = renderHook(() => ({
      count: states.useCount(),
      text: states.useText(),
    }))

    expect(result.current).toEqual({ count: 0, text: '' })
  })

  it('should update multiple subscribers with the same setter', () => {
    const states = createWindowStates({ text: '' })
    const first = renderHook(() => states.useText())
    const second = renderHook(() => states.useText())

    act(() => {
      states.setText('updated')
    })

    expect(first.result.current).toBe('updated')
    expect(second.result.current).toBe('updated')
  })

  it('should support functional updates', () => {
    const states = createWindowStates({ count: 0 })
    const { result } = renderHook(() => states.useCount())

    act(() => {
      states.setCount((count) => count + 1)
    })

    expect(result.current).toBe(1)
  })

  it('should update refs immediately', () => {
    const states = createWindowStates({ text: '' })

    expect(states.textRef.current).toBe('')

    act(() => {
      states.setText('latest')
    })

    expect(states.textRef.current).toBe('latest')
  })

  it('should provide the latest value to late subscribers', () => {
    const states = createWindowStates({ text: 'initial' })

    act(() => {
      states.setText('before mount')
    })

    const { result } = renderHook(() => states.useText())

    expect(result.current).toBe('before mount')
  })

  it('should isolate keys in the same state collection', () => {
    const states = createWindowStates({ count: 0, text: '' })
    let countRenders = 0
    const text = renderHook(() => states.useText())
    const count = renderHook(() => {
      countRenders += 1

      return states.useCount()
    })
    const countRendersBeforeTextUpdate = countRenders

    act(() => {
      states.setText('changed')
    })

    expect(text.result.current).toBe('changed')
    expect(count.result.current).toBe(0)
    expect(countRenders).toBe(countRendersBeforeTextUpdate)
  })

  it('should isolate different state collections with the same keys', () => {
    const firstStates = createWindowStates({ text: '' })
    const secondStates = createWindowStates({ text: '' })
    const first = renderHook(() => firstStates.useText())
    const second = renderHook(() => secondStates.useText())

    act(() => {
      firstStates.setText('first')
    })

    expect(first.result.current).toBe('first')
    expect(second.result.current).toBe('')
  })

  it('should remove listeners on unmount', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')

    try {
      const states = createWindowStates({ text: '' })
      const { unmount } = renderHook(() => states.useText())
      const addCall = addEventListener.mock.calls.find(([name]) =>
        String(name).startsWith('createWindowStates:'),
      )

      expect(addCall).toBeDefined()

      unmount()

      expect(
        removeEventListener.mock.calls.some(
          ([name, listener]) => name === addCall?.[0] && listener === addCall?.[1],
        ),
      ).toBe(true)
    } finally {
      addEventListener.mockRestore()
      removeEventListener.mockRestore()
    }
  })

  it('should infer generated helper types', () => {
    const states = createWindowStates({ count: 0, text: '' })

    expectTypeOf(states.useCount).returns.toEqualTypeOf<number>()
    expectTypeOf(states.useText).returns.toEqualTypeOf<string>()
    expectTypeOf(states.setCount).toEqualTypeOf<Dispatch<SetStateAction<number>>>()
    expectTypeOf(states.textRef).toEqualTypeOf<WindowStateRef<string>>()

    const checkTypes = () => {
      // @ts-expect-error count setter should reject string values
      states.setCount('1')
      // @ts-expect-error ref current should be read-only
      states.textRef.current = 'changed'
    }

    expect(checkTypes).toBeTypeOf('function')
  })
})
