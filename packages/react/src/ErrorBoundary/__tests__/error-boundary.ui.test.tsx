import { describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from '../../ErrorBoundary'

describe('react ErrorBoundary coverage', () => {
  it('should clone custom error children and call onError', () => {
    const error = Error('boom')
    const onError = vi.fn<() => void>()
    const boundary = new ErrorBoundary({
      onError,
      errorChildren: <div />,
    })

    boundary.state = {
      error,
      info: {
        componentStack: '',
      },
    }

    const result = boundary.render() as any

    expect(onError).toHaveBeenCalledWith(error, {
      componentStack: '',
    })
    expect(result.props.error).toBe(error)
    expect(result.props.errorMessage).toBe('Error: boom')
    expect(result.props.errorDescription).toBeUndefined()
  })

  it('should include the component stack in the default fallback', () => {
    const boundary = new ErrorBoundary({})

    boundary.state = {
      error: Error('boom'),
      info: {
        componentStack: 'at Component',
      },
    }

    const result = boundary.render() as any

    expect(result.props.children[0].props.children).toBe('Error: boom')
    expect(result.props.children[1].props.children).toBe('at Component')
  })

  it('should return null when there is no error and no children', () => {
    const boundary = new ErrorBoundary({})

    boundary.state = {
      error: null,
      info: {
        componentStack: '',
      },
    }

    expect(boundary.render()).toBeNull()
  })
})
