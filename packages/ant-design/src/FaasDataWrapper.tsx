import { FaasDataWrapper as Origin } from '@faasjs/react'
import type { FaasAction } from '@faasjs/types'
import type {
  FaasDataWrapperProps as OriginProps,
  FaasDataInjection as OriginFaasDataInjection,
} from '@faasjs/react'
import { Loading } from './Loading'
import type { LoadingProps } from './Loading'
import type { ComponentProps } from 'react'

export type FaasDataInjection<T = any> = Partial<OriginFaasDataInjection<T>>

export interface FaasDataWrapperProps<T = any> extends OriginProps<T> {
  loadingProps?: LoadingProps
  loading?: JSX.Element
}

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

FaasDataWrapper.whyDidYouRender = true

/**
 * HOC to wrap a component with FaasDataWrapper and Loading
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
  return (props: ComponentProps<TComponent> & {}) => (
    <FaasDataWrapper {...faasProps}>
      <Component {...(props as ComponentProps<TComponent>)} />
    </FaasDataWrapper>
  )
}
