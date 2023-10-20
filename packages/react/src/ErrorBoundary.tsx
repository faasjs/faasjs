import { Component, ReactElement, ReactNode, cloneElement } from 'react'

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
    error?: Error
    info?: {
      componentStack?: string
    }
  }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: undefined,
      info: { componentStack: '' },
    }
  }

  componentDidCatch(error: Error | null, info: any) {
    this.setState({
      error,
      info,
    })
  }

  render() {
    const errorMessage = (this.state.error || '').toString()
    const errorDescription = this.state.info?.componentStack
      ? this.state.info.componentStack
      : null

    if (this.state.error) {
      if (this.props.onError)
        this.props.onError(this.state.error, this.state.info)

      if (this.props.errorChildren)
        return cloneElement(this.props.errorChildren, {
          error: this.state.error,
          info: this.state.info,
          errorMessage,
          errorDescription,
        })

      return (
        <div>
          <p>{errorMessage}</p>
          <pre>{errorDescription}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
