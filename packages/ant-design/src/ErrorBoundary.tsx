import { Component, ReactNode } from 'react'
import { Alert } from 'antd'

export interface ErrorBoundaryProps {
  message?: ReactNode
  description?: ReactNode
  children?: ReactNode
  onError?: (error: Error | null, info: any) => ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, {
  error?: Error | null
  info?: {
    componentStack?: string
  }
}> {
  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: undefined,
      info: { componentStack: '' },
    }
  }

  componentDidCatch (error: Error | null, info: any) {
    this.setState({
      error,
      info,
    })
  }

  render () {
    const {
      message, description, children
    } = this.props
    const { error, info } = this.state
    const componentStack = info && info.componentStack ? info.componentStack : null
    const errorMessage = typeof message === 'undefined' ? (error || '').toString() : message
    const errorDescription = typeof description === 'undefined' ? componentStack : description

    if (error) {
      if (this.props.onError)
        return this.props.onError(error, info)

      return <Alert
        type="error"
        message={ errorMessage }
        description={
          <pre style={ {
            fontSize: '0.9em',
            overflowX: 'auto',
          } }>{errorDescription}</pre>
        }
      />
    }
    return children
  }
}
