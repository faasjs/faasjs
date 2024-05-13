import { type Context, createContext, useContext } from 'react'
import { useConstant } from './constant'

/**
 * Creates a splited context with the given default value.
 *
 * @example
 * ```tsx
 * const { Provider, use } = createSplitedContext<{
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
export function createSplitedContext<T extends Record<string, any>>(
  defaultValue: {
    [K in keyof T]: Partial<T[K]> | null
  }
) {
  const contexts: Record<string, Context<any>> = {}
  const keys = Object.keys(defaultValue)

  for (const key of keys) contexts[key] = createContext(defaultValue[key])

  function Provider(props: {
    value?: Partial<T>
    children: React.ReactNode
  }) {
    let children = props.children

    for (const key of keys) {
      const Context = contexts[key]
      const value = props.value?.[key] ?? defaultValue[key]

      children = <Context.Provider value={value}>{children}</Context.Provider>
    }

    return children
  }

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

  return {
    Provider,
    use,
  }
}
