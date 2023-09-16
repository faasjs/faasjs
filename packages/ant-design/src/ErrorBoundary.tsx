import { Alert } from 'antd'
import {
  ErrorBoundary as Origin,
  ErrorBoundaryProps,
  ErrorChildrenProps,
} from '@faasjs/react'

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

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <Origin errorChildren={<ErrorChildren />} {...props} />
}
