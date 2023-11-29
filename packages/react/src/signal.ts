import {
  signal as originSignal,
  effect,
  computed,
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from '@preact/signals-react'

export {
  originSignal,
  effect,
  computed,
  batch,
  useComputed,
  useSignal,
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
