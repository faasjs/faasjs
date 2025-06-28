import { type Context, createContext, type ReactNode, useContext } from 'react'
import { useConstant } from './constant'
import { useEqualMemo } from './equal'
import { useSplittingState } from './splittingState'

/**
 * Creates a splitting context with the given default value.
 *
 * @param defaultValue The default value of the splitting context.
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
    | (keyof T)[]
): {
  /**
   * The provider component of the splitting context.
   *
   * @see https://faasjs.com/doc/react/functions/createSplittingContext.html#provider
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
  Provider<NewT extends T = T>(props: {
    value?: Partial<NewT>
    children: ReactNode
    /**
     * Whether to use memoization for the children.
     *
     * @default false
     *
     * `true`: memoize the children without dependencies.
     * `any[]`: memoize the children with specific dependencies.
     */
    memo?: true | any[]
    /**
     * An object containing initial values that will be automatically converted into state variables using {@link useSplittingState} hook. Each property will create both a state value and its setter following the pattern: value/setValue.
     *
     * @example
     * ```tsx
     * <Provider
     *  initializeStates={{
     *    value: 0,
     *  }}
     * >
     *   // Children will have access to: value, setValue
     * </Provider>
     */
    initializeStates?: Partial<NewT>
  }): ReactNode

  /**
   * The hook to use the splitting context.
   *
   * @see https://faasjs.com/doc/react/functions/createSplittingContext.html#use
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
  use: <NewT extends T = T>() => Readonly<NewT>
} {
  const keys = Array.isArray(defaultValue)
    ? defaultValue
    : Object.keys(defaultValue)
  const defaultValues = Array.isArray(defaultValue)
    ? keys.reduce<{ [K in keyof T]: Partial<T[K]> | null }>(
        (prev, cur) => {
          prev[cur] = null
          return prev
        },
        {} as { [K in keyof T]: Partial<T[K]> | null }
      )
    : defaultValue

  const contexts = {} as Record<
    keyof T,
    Context<{ [K in keyof T]: Partial<T[K]> | null }[keyof T]>
  >
  for (const key of keys) contexts[key] = createContext(defaultValues[key])

  function Provider<NewT extends T = T>(props: {
    value?: Partial<NewT>
    children: React.ReactNode
    memo?: true | any[]
    initializeStates?: Partial<NewT>
  }) {
    const states = props.initializeStates
      ? useSplittingState(props.initializeStates)
      : ({} as NewT)

    let children = props.memo
      ? useEqualMemo(
          () => props.children,
          props.memo === true ? [] : props.memo
        )
      : props.children

    for (const key of keys) {
      const Context = contexts[key]
      const value = props.value?.[key] ?? states[key] ?? defaultValues[key]

      children = <Context.Provider value={value}>{children}</Context.Provider>
    }

    return children
  }

  Provider.displayName = 'SplittingContextProvider'
  Provider.whyDidYouRender = true

  function use<NewT extends T = T>() {
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

  use.whyDidYouRender = true

  return {
    Provider,
    use,
  }
}
