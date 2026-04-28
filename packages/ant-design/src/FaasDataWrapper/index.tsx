import {
  FaasReactClient,
  type FaasReactClientOptions,
  faas,
  FaasDataWrapper as Origin,
  type FaasDataInjection as OriginFaasDataInjection,
  type FaasDataWrapperProps as OriginProps,
  withFaasData as OriginWithFaasData,
  useFaas,
} from '@faasjs/react'
import type { FaasActionUnionType } from '@faasjs/types'
import type { JSX } from 'react'

import type { LoadingProps } from '../Loading'
import { Loading } from '../Loading'

export { faas, useFaas, FaasReactClient, type FaasReactClientOptions }

/**
 * Partial data injection exposed to wrapped Ant Design components.
 *
 * @template T - Action path or response data type used for inference.
 */
export type FaasDataInjection<T extends FaasActionUnionType = any> = Partial<
  OriginFaasDataInjection<T>
>

/**
 * Ant Design wrapper props for the underlying `@faasjs/react` data wrapper.
 *
 * @template T - Action path or response data type used for inference.
 */
export interface FaasDataWrapperProps<T extends FaasActionUnionType = any> extends OriginProps<T> {
  /** Props forwarded to the built-in {@link Loading} fallback. */
  loadingProps?: LoadingProps
  /** Explicit loading element that overrides the built-in {@link Loading} fallback. */
  loading?: JSX.Element
}

export type { FaasDataWrapperRef } from '@faasjs/react'

/**
 * Render the `@faasjs/react` data wrapper with an Ant Design loading fallback.
 *
 * When `loading` is not provided, the component renders {@link Loading} with `loadingProps` while
 * the wrapped FaasJS request is pending.
 *
 * @template T - Action path or response data type used for inference.
 * @param {FaasDataWrapperProps<T>} props - Wrapper props including loading fallbacks and request configuration.
 *
 * @example
 * ```tsx
 * import { Alert, Button } from 'antd'
 * import { FaasDataWrapper } from '@faasjs/ant-design'
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
 *     <FaasDataWrapper<User>
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
 *     <FaasDataWrapper<User>
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
export function FaasDataWrapper<T extends FaasActionUnionType = any>(
  props: FaasDataWrapperProps<T>,
): JSX.Element {
  return <Origin<T> fallback={props.loading || <Loading {...props.loadingProps} />} {...props} />
}

/**
 * Wrap a component with {@link FaasDataWrapper} and its Ant Design loading fallback.
 *
 * @template PathOrData - Action path or response data type used for inference.
 * @template TComponentProps - Component props including injected Faas data fields.
 * @param {React.FC<TComponentProps & Record<string, any>>} Component - Component that consumes injected Faas data props.
 * @param {FaasDataWrapperProps<PathOrData>} faasProps - Request configuration forwarded to {@link FaasDataWrapper}.
 * @returns Higher-order component that injects Faas data props.
 *
 * @example
 * ```tsx
 * import { withFaasData } from '@faasjs/ant-design'
 *
 * const UserCard = withFaasData(
 *   ({ data, error, reload }) =>
 *     error ? (
 *       <a onClick={() => reload()}>Retry</a>
 *     ) : (
 *       <div>{data.name}</div>
 *     ),
 *   { action: 'user/get', params: { id: 1 } },
 * )
 * ```
 */
export function withFaasData<
  PathOrData extends FaasActionUnionType,
  TComponentProps extends Required<FaasDataInjection<PathOrData>> = Required<
    FaasDataInjection<PathOrData>
  >,
>(
  Component: React.FC<TComponentProps & Record<string, any>>,
  faasProps: FaasDataWrapperProps<PathOrData>,
): React.FC<Omit<TComponentProps, keyof FaasDataInjection<PathOrData>>> {
  return OriginWithFaasData<PathOrData, any>(Component, {
    fallback: faasProps.loading || <Loading {...faasProps.loadingProps} />,
    ...faasProps,
  })
}
