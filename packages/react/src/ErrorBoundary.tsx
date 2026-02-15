import {
  Component,
  cloneElement,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from 'react'

export interface ErrorBoundaryProps {
  children?: ReactNode
  onError?: (error: Error | null, info: any) => void
  errorChildren?: ReactElement<ErrorChildrenProps>
}

export type ErrorChildrenProps = {
  error?: Error
  info?: any
  errorMessage?: string
  errorDescription?: string
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    error: Error | null
    info: ErrorInfo
  }
> {
  static displayName = 'ErrorBoundary'

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      info: { componentStack: '' },
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      error,
      info,
    })
  }

  override render() {
    const { error, info } = this.state
    const errorMessage = String(error ?? '')
    const errorDescription = info.componentStack || undefined

    if (error) {
      if (this.props.onError) this.props.onError(error, info)

      if (this.props.errorChildren)
        return cloneElement(this.props.errorChildren, {
          error,
          info,
          errorMessage,
          ...(errorDescription ? { errorDescription } : {}),
        })

      return (
        <div>
          <p>{errorMessage}</p>
          <pre>{errorDescription}</pre>
        </div>
      )
    }
    return this.props.children ?? null
  }
}
