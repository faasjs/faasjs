import { FaasDataWrapper as Origin } from '@faasjs/react'
import type { FaasDataWrapperProps as OriginProps } from '@faasjs/react'
import { Loading } from './Loading'
import type { LoadingProps } from './Loading'
import { Alert } from 'antd'

export type { FaasDataInjection } from '@faasjs/react'

export type FaasDataWrapperProps<T = any> = OriginProps<T> & {
  loadingProps?: LoadingProps
  loading?: JSX.Element
}

/**
 * FaasDataWrapper component with Loading and ErrorBoundary
 */
export function FaasDataWrapper<T = any> (props: FaasDataWrapperProps<T>): JSX.Element {
  return <Alert.ErrorBoundary>
    <Origin
      fallback={ props.loading || <Loading { ...props.loadingProps } /> }
      { ...props }
    />
  </Alert.ErrorBoundary>
}
