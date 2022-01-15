/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  describe('boolean', () => {
    it('filter', async () => {
      render(<Table
        items={ [
          { id: 'id', },
          {
            id: 'test',
            type: 'boolean',
          }
        ] }
        dataSource={ [
          {
            id: 'undefined',
            test: undefined
          },
          {
            id: 'true',
            test: true
          },
          {
            id: 'false',
            test: false
          }
        ] }
      />)

      expect(screen.getAllByRole('cell').length).toBe(6)

      userEvent.click(screen.getByRole('img', { name: 'filter' }))
      userEvent.click(screen.getByRole('radio', { name: 'check' }), {}, { skipPointerEventsCheck: true })

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('true')).toBeInTheDocument()

      userEvent.click(screen.getByRole('img', { name: 'filter' }))
      userEvent.click(screen.getByRole('radio', { name: 'close' }), {}, { skipPointerEventsCheck: true })

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('false')).toBeInTheDocument()

      userEvent.click(screen.getByRole('img', { name: 'filter' }))
      userEvent.click(screen.getByRole('radio', { name: 'Empty' }), {}, { skipPointerEventsCheck: true })

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('undefined')).toBeInTheDocument()

      userEvent.click(screen.getByRole('img', { name: 'filter' }))
      userEvent.click(screen.getByRole('radio', { name: 'All' }), {}, { skipPointerEventsCheck: true })

      expect(screen.getAllByRole('cell').length).toBe(6)
    })
  })
})
