import { type Context, createContext, type ReactNode, useContext } from 'react'

import { useConstant } from '../constant'
import { useEqualMemo } from '../equal'
import { useSplittingState } from '../splittingState'

/**
 * Create a context whose keys can be consumed independently.
 *
 * `createSplittingContext` returns a `Provider` and a `use` hook. Each key in
 * the provided shape is backed by a separate React context so readers only
 * subscribe to the values they access.
 *
 * @template T - Context value shape exposed by the provider and hook.
 * @param {Record<string, any> | (keyof T)[]} defaultValue - Default value map or key list used to create split contexts.
 * @returns {{ Provider<NewT extends T = T>(this: void, props: { value?: Partial<NewT>; children: ReactNode; memo?: true | any[]; initializeStates?: Partial<NewT> }): ReactNode; use<NewT extends T = T>(this: void): Readonly<NewT> }} Provider and hook helpers for the split context.
 *
 * @example
 * ```tsx
 * const { Provider, use } = createSplittingContext<{
 *   value: number
 *   setValue: React.Dispatch<React.SetStateAction<number>>
 * }>({
 *   value: 0,
 *   setValue: null,
 * })
 *
 * function ReaderComponent() {
 *   const { value } = use()
 *
 *   return <div>{value}</div>
 * }
 *
 * function WriterComponent() {
 *   const { setValue } = use()
 *
 *   return (
 *     <button type='button' onClick={() => setValue((p: number) => p + 1)}>
 *       Change
 *     </button>
 *   )
 * }
 *
 * function App() {
 *   const [value, setValue] = useState(0)
 *
 *   return (
 *     <Provider value={{ value, setValue }}>
 *       <ReaderComponent />
 *       <WriterComponent />
 *     </Provider>
 *   )
 * }
 * ```
 */
export function createSplittingContext<T extends Record<string, any>>(
  defaultValue:
    | {
        [K in keyof T]: Partial<T[K]> | null
      }
    | (keyof T)[],
): {
  /**
   * The provider component of the splitting context.
   *
   * @see [Provider docs](https://faasjs.com/doc/react/functions/createSplittingContext.html#provider)
   *
   * @example
   * ```tsx
   * function App() {
   *   const [value, setValue] = useState(0)
   *
   *   return (
   *     <Provider value={{ value, setValue }}>
   *       <ReaderComponent />
   *       <WriterComponent />
   *     </Provider>
   *   )
   * }
   * ```
   */
  Provider<NewT extends T = T>(
    this: void,
    props: {
      /** Partial context value supplied by the caller. */
      value?: Partial<NewT>
      /** Descendant elements that should read from the split contexts. */
      children: ReactNode
      /**
       * Memoization mode for `children`.
       *
       * @default false
       *
       * Pass `true` to memoize without dependencies or an array to control the
       * deep-equality dependency list manually.
       */
      memo?: true | any[]
      /**
       * Initial values converted into local state via `useSplittingState`.
       *
       * Each key produces both a state value and its matching setter using the
       * `value` / `setValue` naming convention.
       *
       * @example
       * ```tsx
       * <Provider initializeStates={{ value: 0 }}>
       *   <Child />
       * </Provider>
       *
       * // `Child` can read `value` and `setValue`
       * ```
       */
      initializeStates?: Partial<NewT>
    },
  ): ReactNode

  /**
   * Hook used to read values from the splitting context.
   *
   * @see [Hook docs](https://faasjs.com/doc/react/functions/createSplittingContext.html#use)
   *
   * @example
   * ```tsx
   * function ChildComponent() {
   *   const { value, setValue } = use()
   *
   *   return <div>{value}<button onClick={() => setValue(1)}>change value</button></div>
   * }
   * ```
   */
  use: <NewT extends T = T>(this: void) => Readonly<NewT>
} {
  const keys = Array.isArray(defaultValue) ? defaultValue : Object.keys(defaultValue)
  const defaultValues = Array.isArray(defaultValue)
    ? keys.reduce<{ [K in keyof T]: Partial<T[K]> | null }>(
        (prev, cur) => {
          prev[cur] = null
          return prev
        },
        {} as { [K in keyof T]: Partial<T[K]> | null },
      )
    : defaultValue

  const contexts = {} as Record<keyof T, Context<{ [K in keyof T]: Partial<T[K]> | null }[keyof T]>>
  for (const key of keys) contexts[key] = createContext(defaultValues[key])

  function Provider<NewT extends T = T>(
    this: void,
    props: {
      value?: Partial<NewT>
      children: React.ReactNode
      memo?: true | any[]
      initializeStates?: Partial<NewT>
    },
  ) {
    const states = props.initializeStates ? useSplittingState(props.initializeStates) : ({} as NewT)

    let children = props.memo
      ? useEqualMemo(() => props.children, props.memo === true ? [] : props.memo)
      : props.children

    for (const key of keys) {
      const Context = contexts[key]
      const value = props.value?.[key] ?? states[key] ?? defaultValues[key]

      children = <Context.Provider value={value}>{children}</Context.Provider>
    }

    return children
  }

  Provider.displayName = 'SplittingContextProvider'

  function use<NewT extends T = T>(this: void) {
    return useConstant<NewT>(() => {
      const obj = Object.create(null)

      for (const key of Object.keys(contexts)) {
        Object.defineProperty(obj, key, {
          get: () => {
            if (!contexts[key]) {
              throw new Error(`Context for key "${key}" is undefined`)
            }
            return useContext(contexts[key])
          },
        })
      }

      return Object.freeze(obj)
    })
  }

  return {
    Provider,
    use,
  }
}
