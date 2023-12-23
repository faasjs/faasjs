import {
  signal as originSignal,
  effect,
  computed,
  batch,
} from '@preact/signals-react'
import {
  useComputed,
  useSignal as originUseSignal,
  useSignalEffect,
} from '@preact/signals-react/runtime'
import type { SetStateAction } from 'react'

export {
  originSignal,
  originUseSignal,
  effect,
  computed,
  batch,
  useComputed,
  useSignalEffect,
}

export type SignalOptions = {
  debugName?: string
}

/**
 * Create a [signal](https://preactjs.com/guide/v10/signals) with options
 *
 * @param initialValue
 * @param options
 * @param options.debugName - debug name for signal, will print signal value to console.debug
 *
 * @example
 * ```ts
 * import { signal } from '@faasjs/react'
 *
 * const count = signal(0, { debugName: 'count' })
 *
 * count.value = 1
 * ```
 */
export function signal<T = any>(
  initialValue: any,
  options: SignalOptions = {}
) {
  const state = originSignal<T>(initialValue)

  if (options.debugName)
    effect(() => console.debug(options.debugName, state.value))

  return state
}

/**
 * Create a [signal](https://preactjs.com/guide/v10/signals) like useState.
 *
 * ```tsx
 * import { useSignalState, useSignalEffect } from '@faasjs/react'
 *
 * function App () {
 *   const [count, setCount] = useSignalState(0, { debugName: 'count' })
 *
 *   useSignalEffect(() => console.log('count', count))
 *
 *   return <div>
 *     <button onClick={() => setCount(count + 1)}>+</button>
 *     <span>{count}</span>
 *   </div>
 * }
 * ```
 */
export function useSignalState<T = any>(
  initialValue: T,
  options: SignalOptions = {}
): readonly [T, (changes: SetStateAction<T>) => void] {
  const state = originUseSignal<T>(initialValue)

  if (options.debugName) {
    useSignalEffect(() => console.log(options.debugName, state.value))
  }

  return [
    state.value,
    (changes: SetStateAction<T>) => {
      state.value =
        typeof changes === 'function'
          ? (changes as (prevState: T) => T)(state.value)
          : changes
    },
  ] as const
}
