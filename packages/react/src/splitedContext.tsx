import { type Context, createContext, useContext } from 'react'
import { useConstant } from './constant'

/**
 * Creates a splited context with the given default value.
 *
 * @template T - The type of the default value.
 * @param {T} defaultValue - The default value for the split context.
 * @returns {Object} - An object containing the Provider and use functions.
 *
 * @example
 * ```tsx
 * const { Provider, use } = createSplitedContext({
 *   value: 0,
 *   setValue: (_: any) => {},
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
 * const App = memo(() => {
 *   return (
 *     <>
 *       <ReaderComponent />
 *       <WriterComponent />
 *     </>
 *   )
 * })
 *
 * function Container() {
 *   const [value, setValue] = useState(0)
 *
 *   return (
 *     <Provider value={{ value, setValue }}>
 *       <App />
 *     </Provider>
 *   )
 * }
 * ```
 */
export function createSplitedContext<T extends Record<string, any>>(
  defaultValue: T
) {
  const contexts: Record<string, Context<any>> = {}

  for (const key of Object.keys(defaultValue))
    contexts[key] = createContext(defaultValue[key])

  function Provider(props: { value: T; children: React.ReactNode }) {
    let children = props.children

    for (const key of Object.keys(props.value)) {
      const Context = contexts[key]
      ;(Context.Provider as any).whyDidYouRender = true

      children = (
        <Context.Provider value={props.value[key]}>{children}</Context.Provider>
      )
    }

    return <>{children}</>
  }

  Provider.whyDidYouRender = true

  function use() {
    return useConstant(() => {
      const obj = Object.create(null) as T

      for (const key of Object.keys(contexts)) {
        Object.defineProperty(obj, key, {
          get: () => useContext(contexts[key]),
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
