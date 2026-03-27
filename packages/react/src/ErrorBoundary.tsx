import { Component, cloneElement, type ErrorInfo, type ReactElement, type ReactNode } from 'react'

/**
 * Props for the {@link ErrorBoundary} component.
 */
export interface ErrorBoundaryProps {
  children?: ReactNode
  onError?: (error: Error | null, info: any) => void
  errorChildren?: ReactElement<ErrorChildrenProps>
}

/**
 * Props injected into a custom error fallback element.
 */
export type ErrorChildrenProps = {
  error?: Error
  info?: any
  errorMessage?: string
  errorDescription?: string
}

/**
 * React error boundary with an optional custom fallback element.
 *
 * @example
 * ```tsx
 * import { ErrorBoundary } from '@faasjs/react'
 *
 * function Fallback({ errorMessage }: { errorMessage?: string }) {
 *   return <div>{errorMessage}</div>
 * }
 *
 * <ErrorBoundary errorChildren={<Fallback />}>
 *   <DangerousWidget />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    error: Error | null
    info: ErrorInfo
  }
> {
  /**
   * Stable display name used by React DevTools.
   */
  static displayName = 'ErrorBoundary'

  /**
   * Create an error boundary with empty error state.
   *
   * @param props - Boundary props.
   * @param props.children - Descendant elements protected by the boundary.
   * @param props.onError - Callback invoked after a render error is captured.
   * @param props.errorChildren - Custom fallback element that receives error details.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      info: { componentStack: '' },
    }
  }

  /**
   * Capture rendering errors from descendant components.
   *
   * @param error - Caught render error.
   * @param info - React component stack metadata.
   */
  override componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      error,
      info,
    })
  }

  /**
   * Render children or the configured fallback for the captured error.
   */
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
