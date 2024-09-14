import type { FaasAction } from '@faasjs/types'
import type { FaasDataWrapperProps, FaasDataInjection } from './types'
import { getClient } from './client'
import { cloneElement, useEffect, useMemo, useState } from 'react'

export function FaasDataWrapper<PathOrData extends FaasAction>({
  action,
  params,
  fallback,
  render,
  children,
  onDataChange,
  data,
  setData,
  baseUrl,
}: FaasDataWrapperProps<PathOrData>): JSX.Element {
  const request = getClient(baseUrl).useFaas<PathOrData>(action, params, {
    data,
    setData,
  })
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!loaded && !request.loading) setLoaded(true)
  }, [request.loading])

  useEffect(() => {
    if (onDataChange) onDataChange(request)
  }, [JSON.stringify(request.data)])

  const child = useMemo(() => {
    if (loaded) {
      if (children) return cloneElement(children, request)
      if (render) return render(request) as JSX.Element
    }

    return fallback || null
  }, [
    loaded,
    request.action,
    request.params,
    request.data,
    request.error,
    request.loading,
  ])

  return child
}

FaasDataWrapper.whyDidYouRender = true

/**
 * HOC to wrap a component with FaasDataWrapper
 *
 * @example
 * ```tsx
 * const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
 * ```
 */
export function withFaasData<
  PathOrData extends FaasAction,
  TComponentProps extends
    FaasDataInjection<PathOrData> = FaasDataInjection<PathOrData>,
>(
  Component: React.FC<TComponentProps & Record<string, any>>,
  faasProps: FaasDataWrapperProps<PathOrData>
): React.FC<
  Omit<TComponentProps, keyof FaasDataInjection> & Record<string, any>
> {
  return (props: Omit<TComponentProps, keyof FaasDataInjection>) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as TComponentProps)} />
    </FaasDataWrapper>
  )
}
