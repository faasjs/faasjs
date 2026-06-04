import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'
import { cloneElement, forwardRef, type JSX, useImperativeHandle, useState } from 'react'

import type { BaseUrl, Response } from '../browser'
import { getClient } from '../client'
import { useEqualEffect, useEqualMemo } from '../equal'

/**
 * Request state injected by {@link useFaas}, {@link FaasDataWrapper}, and {@link withFaasData}.
 *
 * @template Path - Action path or response data type used for inference.
 */
export type FaasDataInjection<Path extends FaasActionPaths> = {
  /** Action path associated with the current request state. */
  action: Path
  /** Params used for the most recent request attempt. */
  params: FaasParams<Path>
  /** Whether the request is currently in flight and should block the main UI. */
  loading: boolean
  /** Whether a background refresh request is currently in flight. */
  refreshing: boolean
  /** Number of times `reload()` or polling has triggered a new request. */
  reloadTimes: number
  /** Current resolved data value. */
  data: FaasData<Path>
  /** Last request error, if one occurred. */
  error: any
  /** Promise representing the latest request. */
  promise: Promise<Response<FaasData<Path>>>
  /**
   * Reloads data with new or existing parameters.
   *
   * When the source hook is currently skipped, calling `reload` clears the skip
   * flag before starting the next request.
   */
  reload(
    this: void,
    params?: FaasParams<Path>,
    options?: { silent?: boolean },
  ): Promise<FaasData<Path>>
  /** Controlled or internal setter for the resolved data value. */
  setData: React.Dispatch<React.SetStateAction<FaasData<Path>>>
  /** Setter for the loading flag. */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  /** Setter for the latest request promise. */
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<FaasData<Path>>>>>
  /** Setter for the last request error. */
  setError: React.Dispatch<React.SetStateAction<any>>
}

/**
 * Props for the {@link FaasDataWrapper} render-prop component.
 *
 * @template Path - Action path or response data type used for inference.
 */
export type FaasDataWrapperProps<Path extends FaasActionPaths> = {
  /** Render prop invoked with the resolved request state after the first load completes. */
  render?(args: FaasDataInjection<Path>): JSX.Element | JSX.Element[]
  /** Child element cloned with injected request state after the first load completes. */
  children?: React.ReactElement<Partial<FaasDataInjection<Path>>>
  /** Element rendered before the first successful load. */
  fallback?: JSX.Element | false
  /** Action path to request. */
  action: Path
  /** Params sent to the action. */
  params?: FaasParams<Path>
  /** Milliseconds to wait after each completed request before refreshing data in the background. */
  polling?: number | false
  /** Callback invoked whenever the resolved data value changes. */
  onDataChange?(args: FaasDataInjection<Path>): void
  /** Controlled data value used instead of internal state. */
  data?: FaasData<Path>
  /** Controlled setter used instead of internal state. */
  setData?: React.Dispatch<React.SetStateAction<FaasData<Path>>>
  /** Base URL override used for this wrapper instance. */
  baseUrl?: BaseUrl
  /** Imperative ref exposing the current injected request state. */
  ref?: React.Ref<FaasDataWrapperRef<Path>>
}

/**
 * Imperative ref shape exposed by {@link FaasDataWrapper}.
 *
 * @template Path - Action path or response data type used for inference.
 */
export type FaasDataWrapperRef<Path extends FaasActionPaths> = FaasDataInjection<Path>

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
 * @param {FaasDataWrapperProps<Path>} props - Wrapper props controlling the request and rendered fallback.
 * @param {(args: FaasDataInjection<Path>) => JSX.Element | JSX.Element[]} [props.render] - Render prop that receives the resolved Faas request state.
 * @param {React.ReactElement<Partial<FaasDataInjection<Path>>>} [props.children] - Child element cloned with injected Faas request state.
 * @param {JSX.Element | false} [props.fallback] - Element rendered before the first successful load.
 * @param {Path} props.action - Action path to request.
 * @param {FaasParams<Path>} [props.params] - Params sent to the action.
 * @param {number | false} [props.polling] - Milliseconds to wait after each completed request before refreshing data in the background.
 * @param {(args: FaasDataInjection<Path>) => void} [props.onDataChange] - Callback invoked when the resolved data value changes.
 * @param {FaasData<Path>} [props.data] - Controlled data value used instead of internal state.
 * @param {React.Dispatch<React.SetStateAction<FaasData<Path>>>} [props.setData] - Controlled setter used instead of internal state.
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
 *       action="features/users/api/get"
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
 *       action="features/users/api/get"
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
  <Path extends FaasActionPaths>(
    props: FaasDataWrapperProps<Path>,
    ref: React.ForwardedRef<FaasDataWrapperRef<Path>>,
  ): JSX.Element | null => {
    const requestOptions = {
      ...(props.data !== undefined ? { data: props.data } : {}),
      ...(props.setData ? { setData: props.setData } : {}),
      ...(props.polling !== undefined ? { polling: props.polling } : {}),
    }

    const request = getClient(props.baseUrl).useFaas<Path>(
      props.action,
      props.params ?? ({} as FaasParams<Path>),
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
    }, [
      loaded,
      request.action,
      request.params,
      request.data,
      request.error,
      request.loading,
      request.refreshing,
    ])

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
 * @template Path - Action path or response data type used for inference.
 * @template TComponentProps - Component props including injected Faas data fields.
 * @param {React.FC<TComponentProps>} Component - Component that consumes injected Faas data props.
 * @param {FaasDataWrapperProps<Path>} faasProps - Request configuration forwarded to `FaasDataWrapper`.
 * @returns {React.FC<Omit<TComponentProps, keyof FaasDataInjection<Path>> & Record<string, any>>} Component that accepts the original props minus the injected Faas data fields.
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
 *   { action: 'features/users/api/get', params: { id: 1 } },
 * )
 * ```
 */
export function withFaasData<
  Path extends FaasActionPaths,
  TComponentProps extends Required<FaasDataInjection<Path>> = Required<FaasDataInjection<Path>>,
>(
  Component: React.FC<TComponentProps>,
  faasProps: FaasDataWrapperProps<Path>,
): React.FC<Omit<TComponentProps, keyof FaasDataInjection<Path>> & Record<string, any>> {
  return (props: Omit<TComponentProps, keyof FaasDataInjection<Path>>) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as TComponentProps)} />
    </FaasDataWrapper>
  )
}
