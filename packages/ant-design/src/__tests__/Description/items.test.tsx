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
          render: (value) => <>{ value + ' value' }</>
        }
      ] }
      dataSource={ { test: 'value' } }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value value')).toBeInTheDocument()
  })
})
