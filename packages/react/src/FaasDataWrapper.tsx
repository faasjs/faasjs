import type { FaasAction } from '@faasjs/types'
import type { FaasDataWrapperProps } from './types'
import { getClient } from './client'
import {
  cloneElement,
  type ComponentProps,
  useEffect,
  useMemo,
  useState,
} from 'react'

export function FaasDataWrapper<PathOrData extends FaasAction>({
  action,
  params,
  fallback,
  render,
  children,
  onDataChange,
  data,
  setData,
  domain,
}: FaasDataWrapperProps<PathOrData>): JSX.Element {
  const request = getClient(domain).useFaas<PathOrData>(action, params, {
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
 * const MyComponent = withFaasData(MyComponent, { action: 'test', params: { a: 1 } })
 * ```
 */
export function withFaasData<
  TComponent extends React.FC<any>,
  PathOrData extends FaasAction,
>(Component: TComponent, faasProps: FaasDataWrapperProps<PathOrData>) {
  return (props: Omit<ComponentProps<TComponent>, 'data'>) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as ComponentProps<TComponent>)} />
    </FaasDataWrapper>
  )
}
