import type { BaseUrl, Response } from './browser'
import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'
import { cloneElement, forwardRef, type JSX, useImperativeHandle, useState } from 'react'
import { getClient } from './client'
import { useEqualEffect, useEqualMemo } from './equal'

/**
 * Injects FaasData props.
 */
export type FaasDataInjection<PathOrData extends FaasActionUnionType = any> = {
  action: FaasAction<PathOrData>
  params: FaasParams<PathOrData>
  loading: boolean
  reloadTimes: number
  data: FaasData<PathOrData>
  error: any
  promise: Promise<Response<FaasData<PathOrData>>>
  /**
   * Reloads data with new or existing parameters.
   *
   * **Note**: It will sets skip to false before loading data.
   */
  reload(params?: Record<string, any>): Promise<FaasData<PathOrData>>
  setData: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<FaasData<PathOrData>>>>>
  setError: React.Dispatch<React.SetStateAction<any>>
}

export type FaasDataWrapperProps<PathOrData extends FaasActionUnionType> = {
  render?(args: FaasDataInjection<PathOrData>): JSX.Element | JSX.Element[]
  children?: React.ReactElement<Partial<FaasDataInjection<PathOrData>>>
  fallback?: JSX.Element | false
  action: FaasAction<PathOrData>
  params?: FaasParams<PathOrData>
  onDataChange?(args: FaasDataInjection<PathOrData>): void
  /** use custom data, should work with setData */
  data?: FaasData<PathOrData>
  /** use custom setData, should work with data */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  baseUrl?: BaseUrl
  ref?: React.Ref<FaasDataWrapperRef<PathOrData>>
}

export type FaasDataWrapperRef<PathOrData extends FaasActionUnionType = any> =
  FaasDataInjection<PathOrData>

type FixedForwardRef = <T, P = Record<string, unknown>>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null

const fixedForwardRef = forwardRef as FixedForwardRef

export const FaasDataWrapper = fixedForwardRef(
  <PathOrData extends FaasActionUnionType = any>(
    props: FaasDataWrapperProps<PathOrData>,
    ref: React.ForwardedRef<FaasDataWrapperRef<PathOrData>>,
  ): JSX.Element | null => {
    const requestOptions = {
      ...(props.data !== undefined ? { data: props.data } : {}),
      ...(props.setData ? { setData: props.setData } : {}),
    }

    const request = getClient(props.baseUrl).useFaas<PathOrData>(
      props.action,
      props.params ?? ({} as FaasParams<PathOrData>),
      requestOptions,
    )
    const [loaded, setLoaded] = useState<boolean>(false)

    useImperativeHandle(ref, () => request, [request])

    useEqualEffect(() => {
      if (!request.loading) setLoaded((prev) => (prev === false ? true : prev))
    }, [request.loading])

    useEqualEffect(() => {
      if (props.onDataChange) props.onDataChange(request)
    }, [request.data])

    const child = useEqualMemo(() => {
      if (loaded) {
        if (props.children) return cloneElement(props.children, request)
        if (props.render) return props.render(request) as JSX.Element
      }

      return props.fallback || null
    }, [loaded, request.action, request.params, request.data, request.error, request.loading])

    return child
  },
)

Object.assign(FaasDataWrapper, {
  displayName: 'FaasDataWrapper',
})

/**
 * HOC to wrap a component with FaasDataWrapper
 *
 * @example
 * ```tsx
 * const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
 * ```
 */
export function withFaasData<
  PathOrData extends FaasActionUnionType,
  TComponentProps extends Required<FaasDataInjection<PathOrData>> = Required<
    FaasDataInjection<PathOrData>
  >,
>(
  Component: React.FC<TComponentProps>,
  faasProps: FaasDataWrapperProps<PathOrData>,
): React.FC<Omit<TComponentProps, keyof FaasDataInjection<PathOrData>> & Record<string, any>> {
  return (props: Omit<TComponentProps, keyof FaasDataInjection<PathOrData>>) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as TComponentProps)} />
    </FaasDataWrapper>
  )
}
