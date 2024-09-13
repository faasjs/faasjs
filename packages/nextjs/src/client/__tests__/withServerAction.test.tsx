/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { withServerAction } from '../withServerAction'
import { useServerAction } from '../useServerAction'

jest.mock('../useServerAction')

const MockComponent: React.FC<{ data?: any }> = ({ data }) => (
  <div>Data: {data}</div>
)

describe('withServerAction', () => {
  it('should render loading state', () => {
    ;(useServerAction as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      loading: true,
    })

    const WrappedComponent = withServerAction(
      MockComponent,
      jest.fn(),
      undefined,
      {
        loading: <div>Loading...</div>,
      }
    )
    render(<WrappedComponent />)

    expect(screen.queryByText('Data:')).toBeNull()
    expect(screen.getByText('Loading...')).toBeDefined()
  })

  it('should render error state', () => {
    ;(useServerAction as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('Test error'),
      loading: false,
    })

    const WrappedComponent = withServerAction(
      MockComponent,
      jest.fn(),
      undefined,
      {
        error: <div>Error occurred</div>,
      }
    )
    render(<WrappedComponent />)

    expect(screen.getByText('Error occurred')).toBeDefined()
  })

  it('should render data when loaded', () => {
    ;(useServerAction as jest.Mock).mockReturnValue({
      data: 'Test data',
      error: null,
      loading: false,
    })

    const WrappedComponent = withServerAction(MockComponent, jest.fn())
    render(<WrappedComponent />)

    expect(screen.getByText('Data: Test data')).toBeDefined()
  })
})
