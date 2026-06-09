import {
  FaasReactClient as OriginFaasReactClient,
  type FaasReactClientOptions,
  faas as originFaas,
  FaasDataWrapper as Origin,
  type FaasDataInjection,
  type FaasDataWrapperProps as OriginProps,
  type Options,
  type Response,
  withFaasData as OriginWithFaasData,
  useFaas as originUseFaas,
  type UseFaasOptions,
  useFaasStream as originUseFaasStream,
  type UseFaasStreamOptions,
  type UseFaasStreamResult,
} from '@faasjs/react'
import type { FaasActionPaths, FaasData, FaasParams } from '@faasjs/types'
import type { JSX } from 'react'

import type { LoadingProps } from '../Loading'
import { Loading } from '../Loading'

export type { FaasReactClientOptions, UseFaasOptions, UseFaasStreamOptions, UseFaasStreamResult }

/**
 * Create and register a FaasReactClient for an Ant Design app.
 *
 * Use this entrypoint in apps that also use {@link App} so `faas`, `useFaas`, and
 * `useFaasStream` share the same configured client and error feedback behavior.
 *
 * @param {FaasReactClientOptions} [options] - Client configuration including base URL, default request options, and error hooks.
 * @returns Registered FaasReactClient instance.
 *
 * @example
 * ```ts
 * import { FaasReactClient } from '@faasjs/ant-design'
 *
 * FaasReactClient({ baseUrl: '/api/' })
 * ```
 */
export function FaasReactClient(options?: FaasReactClientOptions) {
  return OriginFaasReactClient(options)
}

/**
 * Call the currently configured FaasReactClient.
 *
 * In Ant Design apps, import this helper from `@faasjs/ant-design` so failed requests use the
 * same configured feedback behavior as the rest of the UI.
 *
 * @template Path - Registered action path used to infer params and response data.
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} params - Parameters sent to the action.
 * @param {Options} [options] - Optional per-request overrides such as headers or base URL.
 * @returns Response returned by the active browser client.
 *
 * @example
 * ```ts
 * import { faas } from '@faasjs/ant-design'
 *
 * const response = await faas('features/users/api/get', { id: 1 })
 * ```
 */
export function faas<Path extends FaasActionPaths>(
  action: Path,
  params: FaasParams<Path>,
  options?: Options,
): Promise<Response<FaasData<Path>>> {
  return originFaas(action, params, options)
}

/**
 * Request FaasJS data and keep request state in React state.
 *
 * In Ant Design apps, import this hook from `@faasjs/ant-design` so failed requests use the same
 * configured feedback behavior as `App`, `Form`, `Table`, and `Description`.
 *
 * @template Path - Registered action path used to infer params and response data.
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} defaultParams - Params used for the initial request and future reloads.
 * @param {UseFaasOptions<Path>} [options] - Optional hook configuration such as skip, debounce, polling, controlled data, or base URL overrides.
 * @returns Request state and helper methods.
 *
 * @example
 * ```tsx
 * import { useFaas } from '@faasjs/ant-design'
 *
 * export function Profile(props: { id: number }) {
 *   const { data, loading, reload } = useFaas('features/users/api/get', { id: props.id })
 *
 *   if (loading) return <div>Loading...</div>
 *
 *   return <button onClick={() => reload()}>{data?.name}</button>
 * }
 * ```
 */
export function useFaas<Path extends FaasActionPaths>(
  action: Path,
  defaultParams: FaasParams<Path>,
  options: UseFaasOptions<Path> = {},
): FaasDataInjection<Path> {
  return originUseFaas(action, defaultParams, options)
}

/**
 * Stream a FaasJS response into React state.
 *
 * In Ant Design apps, import this hook from `@faasjs/ant-design` so streaming failures use the
 * same configured feedback behavior as other FaasJS requests.
 *
 * @template Path - Registered action path used to infer params and response data.
 * @param {Path} action - Action path to invoke.
 * @param {FaasParams<Path>} defaultParams - Params used for the initial request and future reloads.
 * @param {UseFaasStreamOptions} [options] - Optional stream lifecycle configuration such as skip, debounce, polling, controlled text, or base URL overrides.
 * @returns Streaming request state and helper methods.
 *
 * @example
 * ```tsx
 * import { useFaasStream } from '@faasjs/ant-design'
 *
 * export function Chat(props: { prompt: string }) {
 *   const { data, loading, reload } = useFaasStream('features/chat/api/stream', {
 *     prompt: props.prompt,
 *   })
 *
 *   if (loading) return <div>Streaming...</div>
 *
 *   return <pre onClick={() => reload()}>{data}</pre>
 * }
 * ```
 */
export function useFaasStream<Path extends FaasActionPaths>(
  action: Path,
  defaultParams: FaasParams<Path>,
  options: UseFaasStreamOptions = {},
): UseFaasStreamResult<Path> {
  return originUseFaasStream(action, defaultParams, options)
}

/**
 * Ant Design wrapper props for the underlying `@faasjs/react` data wrapper.
 *
 * @template T - Registered action path used to infer params and response data.
 */
export interface FaasDataWrapperProps<T extends FaasActionPaths = any> extends OriginProps<T> {
  /** Props forwarded to the built-in {@link Loading} fallback. */
  loadingProps?: LoadingProps
  /** Explicit loading element that overrides the built-in {@link Loading} fallback. */
  loading?: JSX.Element
}

export type { FaasDataInjection, FaasDataWrapperRef } from '@faasjs/react'

/**
 * Render the `@faasjs/react` data wrapper with an Ant Design loading fallback.
 *
 * When `loading` is not provided, the component renders {@link Loading} with `loadingProps` while
 * the wrapped FaasJS request is pending.
 *
 * @template T - Registered action path used to infer params and response data.
 * @param {FaasDataWrapperProps<T>} props - Wrapper props including loading fallbacks and request configuration.
 *
 * @example
 * ```tsx
 * import { Alert, Button } from 'antd'
 * import { FaasDataWrapper } from '@faasjs/ant-design'
 * import type { FaasDataInjection } from '@faasjs/ant-design'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'user/get': {
 *       Params: { id: number }
 *       Data: { name: string }
 *     }
 *   }
 * }
 *
 * type GetUserAction = 'user/get'
 *
 * function UserView(props: {
 *   data?: FaasDataInjection<GetUserAction>['data']
 *   error?: Error
 *   reload?: () => void
 * }) {
 *   if (props.error) {
 *     return (
 *       <Alert
 *         type="error"
 *         message={props.error.message}
 *         action={
 *           <Button size="small" onClick={() => props.reload?.()}>
 *             Retry
 *           </Button>
 *         }
 *       />
 *     )
 *   }
 *
 *   return <div>Hello, {props.data?.name}</div>
 * }
 *
 * // Render-prop mode
 * export function UserProfile(props: { id: number }) {
 *   return (
 *     <FaasDataWrapper<GetUserAction>
 *       action="user/get"
 *       params={{ id: props.id }}
 *       loading={<div>Loading user...</div>}
 *       render={({ data, error, reload }) => {
 *         if (error) {
 *           return (
 *             <Alert
 *               type="error"
 *               message={error.message}
 *               action={
 *                 <Button size="small" onClick={() => reload()}>
 *                   Retry
 *                 </Button>
 *               }
 *             />
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
 *     <FaasDataWrapper<GetUserAction>
 *       action="user/get"
 *       params={{ id: props.id }}
 *       loading={<div>Loading user...</div>}
 *     >
 *       <UserView />
 *     </FaasDataWrapper>
 *   )
 * }
 * ```
 */
export function FaasDataWrapper<T extends FaasActionPaths = any>(
  props: FaasDataWrapperProps<T>,
): JSX.Element {
  return <Origin<T> fallback={props.loading || <Loading {...props.loadingProps} />} {...props} />
}

/**
 * Wrap a component with {@link FaasDataWrapper} and its Ant Design loading fallback.
 *
 * @template Path - Registered action path used to infer params and response data.
 * @template TComponentProps - Component props including every field from {@link FaasDataInjection}.
 * @param {React.FC<TComponentProps & Record<string, any>>} Component - Component that consumes injected Faas data props.
 * @param {FaasDataWrapperProps<Path>} faasProps - Request configuration forwarded to {@link FaasDataWrapper}; this is the second argument.
 * @returns Higher-order component that accepts caller-owned props while `withFaasData` supplies the Faas data props.
 *
 * @example
 * ```tsx
 * import { type FaasDataInjection, withFaasData } from '@faasjs/ant-design'
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'user/get': {
 *       Params: { id: number }
 *       Data: { name: string }
 *     }
 *   }
 * }
 *
 * type GetUserAction = 'user/get'
 * type UserCardProps = FaasDataInjection<GetUserAction> & {
 *   compact?: boolean
 * }
 *
 * const UserCard = ({ data, error, reload, compact }: UserCardProps) =>
 *   error ? (
 *     <a onClick={() => reload()}>Retry</a>
 *   ) : (
 *     <div>{compact ? data.name : `User: ${data.name}`}</div>
 *   )
 *
 * const UserCardWithData = withFaasData<GetUserAction, UserCardProps>(
 *   UserCard,
 *   { action: 'user/get', params: { id: 1 } },
 * )
 * ```
 */
export function withFaasData<
  Path extends FaasActionPaths,
  TComponentProps extends Required<FaasDataInjection<Path>> = Required<FaasDataInjection<Path>>,
>(
  Component: React.FC<TComponentProps & Record<string, any>>,
  faasProps: FaasDataWrapperProps<Path>,
): React.FC<Omit<TComponentProps, keyof FaasDataInjection<Path>>> {
  return OriginWithFaasData<Path, any>(Component, {
    fallback: faasProps.loading || <Loading {...faasProps.loadingProps} />,
    ...faasProps,
  })
}
