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
 * @param props - Error boundary props forwarded to the underlying React implementation.
 * @param props.children - Descendant elements protected by the boundary.
 * @param props.onError - Callback invoked after a render error is captured.
 * @param props.errorChildren - Optional custom fallback element that overrides the default alert.
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
