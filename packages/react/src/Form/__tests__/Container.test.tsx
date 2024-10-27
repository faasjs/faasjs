/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { FormContainer } from '../Container'

describe('FormContainer', () => {
  const defaultProps = {
    items: [{ name: 'test' }],
    onSubmit: jest.fn(),
  }

  it('should render FormBody', () => {
    render(<FormContainer {...defaultProps} />)
    expect(screen.getByText('test')).not.toBeNull()
  })

  it('should call onSubmit with correct values', async () => {
    const onSubmit = jest.fn().mockResolvedValueOnce(Promise.resolve())
    render(<FormContainer {...defaultProps} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onSubmit).toHaveBeenCalledWith({ test: '' })
  })

  it('should merge default values correctly', () => {
    const defaultValues = { test: 'default' }

    render(<FormContainer {...defaultProps} defaultValues={defaultValues} />)

    expect(screen.getByDisplayValue('default')).not.toBeNull()
  })
})
