import type { FaasAction, FaasActionUnionType, FaasData, FaasParams } from '@faasjs/types'
import { cloneElement, forwardRef, type JSX, useImperativeHandle, useState } from 'react'

import type { BaseUrl, Response } from './browser'
import { getClient } from './client'
import { useEqualEffect, useEqualMemo } from './equal'

/**
 * Request state injected by {@link useFaas}, {@link FaasDataWrapper}, and {@link withFaasData}.
 *
 * @template PathOrData - Action path or response data type used for inference.
 */
export type FaasDataInjection<PathOrData extends FaasActionUnionType = any> = {
  /** Action path associated with the current request state. */
  action: FaasAction<PathOrData>
  /** Params used for the most recent request attempt. */
  params: FaasParams<PathOrData>
  /** Whether the request is currently in flight. */
  loading: boolean
  /** Number of times `reload()` has triggered a new request. */
  reloadTimes: number
  /** Current resolved data value. */
  data: FaasData<PathOrData>
  /** Last request error, if one occurred. */
  error: any
  /** Promise representing the latest request. */
  promise: Promise<Response<FaasData<PathOrData>>>
  /**
   * Reloads data with new or existing parameters.
   *
   * When the source hook is currently skipped, calling `reload` clears the skip
   * flag before starting the next request.
   */
  reload(params?: Record<string, any>): Promise<FaasData<PathOrData>>
  /** Controlled or internal setter for the resolved data value. */
  setData: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /** Setter for the loading flag. */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  /** Setter for the latest request promise. */
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<FaasData<PathOrData>>>>>
  /** Setter for the last request error. */
  setError: React.Dispatch<React.SetStateAction<any>>
}

/**
 * Props for the {@link FaasDataWrapper} render-prop component.
 *
 * @template PathOrData - Action path or response data type used for inference.
 */
export type FaasDataWrapperProps<PathOrData extends FaasActionUnionType> = {
  /** Render prop invoked with the resolved request state after the first load completes. */
  render?(args: FaasDataInjection<PathOrData>): JSX.Element | JSX.Element[]
  /** Child element cloned with injected request state after the first load completes. */
  children?: React.ReactElement<Partial<FaasDataInjection<PathOrData>>>
  /** Element rendered before the first successful load. */
  fallback?: JSX.Element | false
  /** Action path to request. */
  action: FaasAction<PathOrData>
  /** Params sent to the action. */
  params?: FaasParams<PathOrData>
  /** Callback invoked whenever the resolved data value changes. */
  onDataChange?(args: FaasDataInjection<PathOrData>): void
  /** Controlled data value used instead of internal state. */
  data?: FaasData<PathOrData>
  /** Controlled setter used instead of internal state. */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /** Base URL override used for this wrapper instance. */
  baseUrl?: BaseUrl
  /** Imperative ref exposing the current injected request state. */
  ref?: React.Ref<FaasDataWrapperRef<PathOrData>>
}

/**
 * Imperative ref shape exposed by {@link FaasDataWrapper}.
 *
 * @template PathOrData - Action path or response data type used for inference.
 */
export type FaasDataWrapperRef<PathOrData extends FaasActionUnionType = any> =
  FaasDataInjection<PathOrData>

type FixedForwardRef = <T, P = Record<string, unknown>>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null

const fixedForwardRef = forwardRef as FixedForwardRef

/**
 * Fetch FaasJS data and inject the result into a render prop or child element.
 *
 * The wrapper defers rendering `children` or `render` until the first request
 * completes, then keeps passing the latest request state to the rendered output.
 *
 * @param {FaasDataWrapperProps<PathOrData>} props - Wrapper props controlling the request and rendered fallback.
 * @param {(args: FaasDataInjection<PathOrData>) => JSX.Element | JSX.Element[]} [props.render] - Render prop that receives the resolved Faas request state.
 * @param {React.ReactElement<Partial<FaasDataInjection<PathOrData>>>} [props.children] - Child element cloned with injected Faas request state.
 * @param {JSX.Element | false} [props.fallback] - Element rendered before the first successful load.
 * @param {FaasAction<PathOrData>} props.action - Action path to request.
 * @param {FaasParams<PathOrData>} [props.params] - Params sent to the action.
 * @param {(args: FaasDataInjection<PathOrData>) => void} [props.onDataChange] - Callback invoked when the resolved data value changes.
 * @param {FaasData<PathOrData>} [props.data] - Controlled data value used instead of internal state.
 * @param {React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>} [props.setData] - Controlled setter used instead of internal state.
 * @param {BaseUrl} [props.baseUrl] - Base URL override used for this wrapper instance.
 *
 * @example
 * ```tsx
 * import { FaasDataWrapper } from '@faasjs/react'
 *
 * type User = {
 *   name: string
 * }
 *
 * function UserView(props: {
 *   data?: User
 *   error?: Error
 *   reload?: () => void
 * }) {
 *   if (props.error) {
 *     return (
 *       <div>
 *         <p>Failed to load user: {props.error.message}</p>
 *         <button type="button" onClick={() => props.reload?.()}>
 *           Retry
 *         </button>
 *       </div>
 *     )
 *   }
 *
 *   return <div>Hello, {props.data?.name}</div>
 * }
 *
 * // Render-prop mode
 * export function UserProfile(props: { id: number }) {
 *   return (
 *     <FaasDataWrapper<User>
 *       action="/pages/users/get"
 *       params={{ id: props.id }}
 *       fallback={<div>Loading user...</div>}
 *       render={({ data, error, reload }) => {
 *         if (error) {
 *           return (
 *             <div>
 *               <p>Failed to load user: {error.message}</p>
 *               <button type="button" onClick={() => reload()}>
 *                 Retry
 *               </button>
 *             </div>
 *           )
 *         }
 *
 *         return <div>Hello, {data.name}</div>
 *       }}
 *     />
 *   )
 * }
 *
 * // Children injection mode
 * export function UserProfileWithChildren(props: { id: number }) {
 *   return (
 *     <FaasDataWrapper<User>
 *       action="/pages/users/get"
 *       params={{ id: props.id }}
 *       fallback={<div>Loading user...</div>}
 *     >
 *       <UserView />
 *     </FaasDataWrapper>
 *   )
 * }
 * ```
 *
 * When a ref is provided, it exposes the current Faas request state imperatively.
 */
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
 * Wrap a component with {@link FaasDataWrapper} and inject Faas request state as props.
 *
 * `withFaasData` is most useful for wrapper-style exports or when you want to
 * preserve an existing component boundary. For new code, prefer `useFaas` or
 * `FaasDataWrapper` when they express the request ownership more directly.
 *
 * @template PathOrData - Action path or response data type used for inference.
 * @template TComponentProps - Component props including injected Faas data fields.
 * @param {React.FC<TComponentProps>} Component - Component that consumes injected Faas data props.
 * @param {FaasDataWrapperProps<PathOrData>} faasProps - Request configuration forwarded to `FaasDataWrapper`.
 * @returns {React.FC<Omit<TComponentProps, keyof FaasDataInjection<PathOrData>> & Record<string, any>>} Component that accepts the original props minus the injected Faas data fields.
 *
 * @example
 * ```tsx
 * import { withFaasData } from '@faasjs/react'
 *
 * const MyComponent = withFaasData(
 *   ({ data, error, reload }) => {
 *     if (error) {
 *       return (
 *         <button type="button" onClick={() => reload()}>
 *           Retry
 *         </button>
 *       )
 *     }
 *
 *     return <div>{data.name}</div>
 *   },
 *   { action: '/pages/users/get', params: { id: 1 } },
 * )
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
