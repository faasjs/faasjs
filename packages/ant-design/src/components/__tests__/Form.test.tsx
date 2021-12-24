/**
 * @jest-environment jsdom
 */
import './jest.setup'
import { render, screen } from '@testing-library/react'
import { Form } from '../Form'

describe('FormItem', () => {
  it('should work', function () {
    render(<Form
      items={ [{ id: 'test' }] } />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
