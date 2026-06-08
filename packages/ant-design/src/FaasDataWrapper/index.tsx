import {
  FaasReactClient,
  type FaasReactClientOptions,
  faas,
  FaasDataWrapper as Origin,
  type FaasDataInjection,
  type FaasDataWrapperProps as OriginProps,
  withFaasData as OriginWithFaasData,
  useFaas,
} from '@faasjs/react'
import type { FaasActionPaths } from '@faasjs/types'
import type { JSX } from 'react'

import type { LoadingProps } from '../Loading'
import { Loading } from '../Loading'

export { FaasReactClient, type FaasReactClientOptions, faas, useFaas }

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
