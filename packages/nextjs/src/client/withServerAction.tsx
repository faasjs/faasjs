import { useServerAction } from './useServerAction'

/**
 * HOC to call a server action and handle loading and error states
 *
 * @example
 * ```tsx
 * import { withServerAction } from '@faasjs/nextjs/client'
 * import { fetchData } from './fetchData'
 *
 * const Example = withServerAction(({ data }) => {
 *  return <div>Data: {data}</div>
 * }, fetchData, { id: 1 })
 * ```
 */
export function withServerAction<
  TComponentProps extends {
    data?: Awaited<ReturnType<TAction>>
  },
  TAction extends (...args: any) => Promise<any> = any,
>(
  Component: React.FC<TComponentProps>,
  action: TAction,
  params?: Parameters<TAction>,
  options?: {
    loading?: React.ReactNode
    error?: React.ReactNode
  }
): React.FC<TComponentProps> {
  return props => {
    const { data, error, loading } = useServerAction(action, params)

    if (loading) return options?.loading || null

    if (error) return options?.error || null

    return <Component {...(props as TComponentProps)} data={data} />
  }
}
