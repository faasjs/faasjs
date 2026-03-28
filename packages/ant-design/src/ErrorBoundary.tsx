import {
  type ErrorBoundaryProps,
  type ErrorChildrenProps,
  ErrorBoundary as Origin,
} from '@faasjs/react'
import { Alert } from 'antd'

export type { ErrorBoundaryProps }

function ErrorChildren(props: ErrorChildrenProps) {
  return (
    <Alert
      type="error"
      message={props.errorMessage}
      description={
        <pre
          style={{
            fontSize: '0.9em',
            overflowX: 'auto',
          }}
        >
          {props.errorDescription}
        </pre>
      }
    />
  )
}

/**
 * Styled error boundary.
 *
 * When `errorChildren` is not provided, the fallback UI renders an Ant Design `Alert` containing
 * the captured error message and description.
 *
 * @param {ErrorBoundaryProps} props - Error boundary props forwarded to the underlying React implementation.
 *
 * @example
 * ```tsx
 * import { ErrorBoundary } from '@faasjs/ant-design'
 *
 * export function Page() {
 *   return (
 *     <ErrorBoundary>
 *       <DangerousWidget />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <Origin errorChildren={<ErrorChildren />} {...props} />
}
