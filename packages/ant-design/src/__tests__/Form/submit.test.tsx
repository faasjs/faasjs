/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Form } from '../../Form'

describe('Form/submit', () => {
  it('should work as default', () => {
    render(<Form />)

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('when custom submit text', () => {
    render(<Form submit={ { text: 'Save' } } />)

    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('when submit is false', () => {
    render(<Form submit={ false } />)

    expect(screen.queryByText('Submit')).toBeNull()
  })
})
