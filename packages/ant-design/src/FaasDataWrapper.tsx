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
import type { LoadingProps } from './Loading'
import { Loading } from './Loading'

export { faas, useFaas, FaasReactClient, type FaasReactClientOptions }

export type FaasDataInjection<T = any> = Partial<OriginFaasDataInjection<T>>

export interface FaasDataWrapperProps<T = any> extends OriginProps<T> {
  loadingProps?: LoadingProps
  loading?: JSX.Element
}

export type { FaasDataWrapperRef } from '@faasjs/react'

/**
 * FaasDataWrapper component with Loading
 *
 * @example
 * ```tsx
 * function MyComponent (props: FaasDataInjection) {
 *   return <div>{ props.data }</div>
 * }
 *
 * function MyPage () {
 *   return <FaasDataWrapper action="test" params={{ a: 1 }}>
 *     <MyComponent />
 *   </FaasDataWrapper>
 * }
 * ```
 */
export function FaasDataWrapper<T = any>(
  props: FaasDataWrapperProps<T>
): JSX.Element {
  return (
    <Origin<T>
      fallback={props.loading || <Loading {...props.loadingProps} />}
      {...props}
    />
  )
}

/**
 * HOC to wrap a component with FaasDataWrapper and Loading
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
  Component: React.FC<TComponentProps & Record<string, any>>,
  faasProps: FaasDataWrapperProps<PathOrData>
): React.FC<Omit<TComponentProps, keyof FaasDataInjection<PathOrData>>> {
  return OriginWithFaasData<PathOrData, any>(Component, {
    fallback: faasProps.loading || <Loading {...faasProps.loadingProps} />,
    ...faasProps,
  })
}
