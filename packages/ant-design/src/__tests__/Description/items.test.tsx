/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Description } from '../../Description'

describe('Description/items', () => {
  it('should work', function () {
    render(<Description
      items={ [{ id: 'test' }] }
      dataSource={ { test: 'value' } }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
