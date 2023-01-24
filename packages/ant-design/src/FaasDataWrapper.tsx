import { FaasDataWrapper as Origin } from '@faasjs/react'
import type { FaasDataWrapperProps as OriginProps } from '@faasjs/react'
import { Loading } from './Loading'
import type { LoadingProps } from './Loading'

export type { FaasDataInjection } from '@faasjs/react'

export interface FaasDataWrapperProps<T = any> extends OriginProps<T> {
  loadingProps?: LoadingProps
  loading?: JSX.Element
}

/**
 * FaasDataWrapper component with Loading and ErrorBoundary
 */
export function FaasDataWrapper<T = any> (props: FaasDataWrapperProps<T>): JSX.Element {
  return <Origin
    fallback={ props.loading || <Loading { ...props.loadingProps } /> }
    { ...props }
  />
}
