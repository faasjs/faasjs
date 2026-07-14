import { act, renderHook } from '@testing-library/react'
import type { Dispatch, SetStateAction } from 'react'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import * as ReactExports from '../..'
import { createProxyStates, type ProxyStateRef } from '../../createProxyStates'

describe('createProxyStates', () => {
  it('should read default values', () => {
    const states = createProxyStates({ count: 0, text: '' })

    const { result } = renderHook(() => ({
      count: states.useCount(),
      text: states.useText(),
    }))

    expect(result.current).toEqual({ count: 0, text: '' })
  })

  it('should update multiple subscribers with the same setter', () => {
    const states = createProxyStates({ text: '' })
    const first = renderHook(() => states.useText())
    const second = renderHook(() => states.useText())

    act(() => {
      states.setText('updated')
    })

    expect(first.result.current).toBe('updated')
    expect(second.result.current).toBe('updated')
  })

  it('should support functional updates', () => {
    const states = createProxyStates({ count: 0 })
    const { result } = renderHook(() => states.useCount())

    act(() => {
      states.setCount((count) => count + 1)
    })

    expect(result.current).toBe(1)
  })

  it('should update refs immediately', () => {
    const states = createProxyStates({ text: '' })

    expect(states.textRef.current).toBe('')

    act(() => {
      states.setText('latest')
    })

    expect(states.textRef.current).toBe('latest')
  })

  it('should provide the latest value to late subscribers', () => {
    const states = createProxyStates({ text: 'initial' })

    act(() => {
      states.setText('before mount')
    })

    const { result } = renderHook(() => states.useText())

    expect(result.current).toBe('before mount')
  })

  it('should notify subscribers when setting the same value', () => {
    const states = createProxyStates({ count: 0 })
    let renders = 0
    const { result } = renderHook(() => {
      renders += 1

      return states.useCount()
    })
    const rendersBeforeUpdate = renders

    act(() => {
      states.setCount(0)
    })

    expect(result.current).toBe(0)
    expect(renders).toBeGreaterThan(rendersBeforeUpdate)
  })

  it('should isolate keys in the same state collection', () => {
    const states = createProxyStates({ count: 0, text: '' })
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
    const firstStates = createProxyStates({ text: '' })
    const secondStates = createProxyStates({ text: '' })
    const first = renderHook(() => firstStates.useText())
    const second = renderHook(() => secondStates.useText())

    act(() => {
      firstStates.setText('first')
    })

    expect(first.result.current).toBe('first')
    expect(second.result.current).toBe('')
  })

  it('should stop updating unmounted subscribers', () => {
    const states = createProxyStates({ text: '' })
    let firstRenders = 0
    const first = renderHook(() => {
      firstRenders += 1

      return states.useText()
    })
    const second = renderHook(() => states.useText())

    first.unmount()
    const firstRendersBeforeUpdate = firstRenders

    act(() => {
      states.setText('updated')
    })

    expect(firstRenders).toBe(firstRendersBeforeUpdate)
    expect(second.result.current).toBe('updated')
  })

  it('should not dispatch window events', () => {
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent')

    try {
      const states = createProxyStates({ text: '' })

      states.setText('updated')

      expect(dispatchEvent).not.toHaveBeenCalled()
    } finally {
      dispatchEvent.mockRestore()
    }
  })

  it('should export only Proxy state names', () => {
    expect(ReactExports.createProxyStates).toBe(createProxyStates)
    expect(ReactExports).not.toHaveProperty('createWindowStates')
  })

  it('should infer generated helper types', () => {
    const states = createProxyStates({ count: 0, text: '' })

    expectTypeOf(states.useCount).returns.toEqualTypeOf<number>()
    expectTypeOf(states.useText).returns.toEqualTypeOf<string>()
    expectTypeOf(states.setCount).toEqualTypeOf<Dispatch<SetStateAction<number>>>()
    expectTypeOf(states.textRef).toEqualTypeOf<ProxyStateRef<string>>()

    const checkTypes = () => {
      // @ts-expect-error count setter should reject string values
      states.setCount('1')
      // @ts-expect-error ref current should be read-only
      states.textRef.current = 'changed'
      // @ts-expect-error createWindowStates should no longer be exported
      void ReactExports.createWindowStates
      // @ts-expect-error WindowStateRef should no longer be exported
      expectTypeOf<ReactExports.WindowStateRef<string>>()
    }

    expect(checkTypes).toBeTypeOf('function')
  })
})
