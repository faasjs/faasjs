import type { FaasAction, FaasData, FaasParams } from '@faasjs/types'
import { getClient } from './client'
import { cloneElement, useEffect, useMemo, useState } from 'react'
import type { Response } from '@faasjs/browser'

/**
 * Injects FaasData props.
 */
export type FaasDataInjection<PathOrData extends FaasAction = any> = {
  action: PathOrData | string
  params: Record<string, any>
  loading: boolean
  reloadTimes: number
  data: FaasData<PathOrData>
  error: any
  promise: Promise<Response<FaasData<PathOrData>>>
  reload(params?: Record<string, any>): Promise<Response<PathOrData>>
  setData: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPromise: React.Dispatch<
    React.SetStateAction<Promise<Response<FaasData<PathOrData>>>>
  >
  setError: React.Dispatch<React.SetStateAction<any>>
}

export type FaasDataWrapperProps<PathOrData extends FaasAction> = {
  render?(args: FaasDataInjection<PathOrData>): JSX.Element | JSX.Element[]
  children?: React.ReactElement<Partial<FaasDataInjection<PathOrData>>>
  fallback?: JSX.Element | false
  action: PathOrData | string
  params?: FaasParams<PathOrData>
  onDataChange?(args: FaasDataInjection<PathOrData>): void
  /** use custom data, should work with setData */
  data?: FaasData<PathOrData>
  /** use custom setData, should work with data */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  baseUrl?: string
}

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
  Omit<TComponentProps, keyof FaasDataInjection<PathOrData>> &
    Record<string, any>
> {
  return (
    props: Omit<TComponentProps, keyof FaasDataInjection<PathOrData>>
  ) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as TComponentProps)} />
    </FaasDataWrapper>
  )
}
