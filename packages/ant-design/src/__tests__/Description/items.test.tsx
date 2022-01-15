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

  it('children', () => {
    render(<Description
      items={ [
        {
          id: 'test',
          children: <>Children</>
        }
      ] }
      dataSource={ { test: 'value' } }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.queryByText('value')).toBeNull()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('render', () => {
    render(<Description
      items={ [
        {
          id: 'test',
          render: (value: string) => <>{ value + ' value' }</>
        }
      ] }
      dataSource={ { test: 'value' } }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value value')).toBeInTheDocument()
  })

  describe('options', () => {
    it('string', () => {
      render(<Description
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
        dataSource={ { test: 'value' } }
      />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label')).toBeInTheDocument()
    })

    it('string[]', () => {
      render(<Description
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
        dataSource={ { test: ['value', 'value'] } }
      />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label, label')).toBeInTheDocument()
    })
  })
})
