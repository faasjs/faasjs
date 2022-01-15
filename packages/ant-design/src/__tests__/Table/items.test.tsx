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

  describe('options', () => {
    it('string', () => {
      render(<Table
        items={ [
          {
            id: 'test',
            options: [
              {
                label: 'label',
                value: 'value'
              }
            ]
          }
        ] }
        dataSource={ [
          {
            id: 1,
            test: 'value'
          }
        ] }
      />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label')).toBeInTheDocument()
    })

    it('string[]', () => {
      render(<Table
        items={ [
          {
            id: 'test',
            type: 'string[]',
            options: [
              {
                label: 'label',
                value: 'value'
              }
            ]
          }
        ] }
        dataSource={ [
          {
            id: 1,
            test: ['value', 'value']
          }
        ] }
      />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label, label')).toBeInTheDocument()
    })
  })
})
