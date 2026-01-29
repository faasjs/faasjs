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
      type='error'
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
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <Origin errorChildren={<ErrorChildren />} {...props} />
}
