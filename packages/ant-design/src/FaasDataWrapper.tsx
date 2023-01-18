import { FaasDataWrapper as Origin } from '@faasjs/react'
import type { FaasDataWrapperProps } from '@faasjs/react'
import { Loading } from './Loading'
import { Alert } from 'antd'

export type { FaasDataWrapperProps, FaasDataInjection } from '@faasjs/react'

/**
 * FaasDataWrapper component with Loading and ErrorBoundary
 */
export function FaasDataWrapper<T = any> (props: FaasDataWrapperProps<T>): JSX.Element {
  return <Alert.ErrorBoundary>
    <Origin
      fallback={ <Loading /> }
      { ...props }
    />
  </Alert.ErrorBoundary>
}
