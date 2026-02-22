import { render, screen } from '@testing-library/react'
import type { JSX } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../../ErrorBoundary'

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Safe content')).toBeDefined()
  })

  it('should render error alert when child throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    function Thrower(): JSX.Element {
      throw Error('Boom message')
    }

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    )

    expect(await screen.findByText(/Boom message/)).toBeDefined()

    spy.mockRestore()
  })
})
