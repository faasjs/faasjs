import { useEffect, useState } from 'react'

/**
 * Hook to call a server action and handle loading and error states
 *
 * @example
 * ```tsx
 * import { useServerAction } from '@faasjs/nextjs/client'
 * import { fetchData } from './fetchData'
 *
 * function Example() {
 *   const { data, error, loading } = useServerAction(fetchData, { id: 1 })
 *
 *   if (loading) return <div>Loading...</div>
 *
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return <div>Data: {data}</div>
 * }
 * ```
 */
export function useServerAction<
  TAction extends (...args: any) => Promise<{
    data?: any
    error?: Error | { message: string }
  }> = any,
>(action: TAction, params?: Parameters<TAction>) {
  const [data, setData] = useState<Awaited<ReturnType<TAction>> | undefined>()
  const [error, setError] = useState<Error | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    action(params)
      .then(res => {
        if (res?.error) {
          setError(
            res.error instanceof Error
              ? res.error
              : new Error(res.error.message)
          )
          return
        }
        setData(res.data)
      }, setError)
      .finally(() => setLoading(false))
  }, [params])

  return { data, error, loading }
}
