/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Form } from '../../Form'

describe('Form/items', () => {
  it('should work', function () {
    render(<Form
      items={ [{ id: 'test' }] } />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
