/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Table } from '../../Table'

describe('Table/items', () => {
  it('should work', () => {
    render(<Table
      items={ [{ id: 'test' }] }
      dataSource={ [
        {
          id: 1,
          test: 'value'
        }
      ] }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
