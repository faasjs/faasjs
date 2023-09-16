import { FaasDataWrapper as Origin } from '@faasjs/react'
import type {
  FaasDataWrapperProps as OriginProps,
  FaasDataInjection as OriginFaasDataInjection,
} from '@faasjs/react'
import { Loading } from './Loading'
import type { LoadingProps } from './Loading'

export type FaasDataInjection<T = any> = Partial<OriginFaasDataInjection<T>>

export interface FaasDataWrapperProps<T = any> extends OriginProps<T> {
  loadingProps?: LoadingProps
  loading?: JSX.Element
}

/**
 * FaasDataWrapper component with Loading
 *
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
    <Origin
      fallback={props.loading || <Loading {...props.loadingProps} />}
      {...props}
    />
  )
}
