/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import type { TableElements } from '../elements'
import userEvent from '@testing-library/user-event'
import { forwardRef, useState } from 'react'
import { createTable } from '../create'

describe('table/elements', () => {
  it('should render', async () => {
    const CustomTable: TableElements['table'] = forwardRef((props, ref) => {
      return (
        <div ref={ref}>
          <table>{props.children}</table>
        </div>
      )
    })

    function Test() {
      const [customTable, setCustomTable] = useState<TableElements['table']>()
      const { TableHolder } = createTable({
        elements: {
          table: customTable,
        },
        columns: [],
      })

      return (
        <>
          {TableHolder}
          <button type='button' onClick={() => setCustomTable(CustomTable)}>
            Change
          </button>
        </>
      )
    }

    const { container } = render(<Test />)

    expect(container.querySelector('table').tagName).toBe('TABLE')
    expect(container.querySelector('tbody').tagName).toBe('TBODY')
    expect(container.querySelector('thead').tagName).toBe('THEAD')
    expect(container.querySelector('div')).toBeNull()

    await userEvent.click(screen.getByRole('button'))

    expect(container.querySelector('div').tagName).toBe('DIV')
  })

  it('should forward refs correctly', () => {
    const CustomTable: TableElements['table'] = forwardRef((props, ref) => {
      return <table {...props} ref={ref} />
    })

    const ref = { current: null } as React.RefObject<HTMLTableElement>

    render(<CustomTable ref={ref} />)

    expect(ref.current.tagName).toBe('TABLE')
  })

  it('should pass props correctly', () => {
    const CustomTable: TableElements['table'] = forwardRef((props, ref) => {
      return <table {...props} ref={ref} />
    })

    render(<CustomTable data-testid='custom-table' />)

    expect(screen.getByTestId('custom-table')).not.toBeNull()
  })

  it('multiple tables', async () => {
    const CustomTable1: TableElements['table'] = forwardRef((props, ref) => {
      return <div><p>Table 1</p><table {...props} ref={ref} /></div>
    })

    const CustomTable2: TableElements['table'] = forwardRef((props, ref) => {
      return <div><p>Table 2</p><table {...props} ref={ref} /></div>
    })

    function Test() {
      const [customTable, setCustomTable] = useState<TableElements['table']>()
      const [customTable2, setCustomTable2] = useState<TableElements['table']>()
      const { TableHolder } = createTable({
        elements: {
          table: customTable,
        },
        columns: [],
      })
      const { TableHolder: TableHolder2 } = createTable({
        elements: {
          table: customTable2,
        },
        columns: [],
      })

      return (
        <>
          {TableHolder}
          {TableHolder2}
          <button type='button' onClick={() => setCustomTable(CustomTable1)}>
            Change
          </button>
          <button type='button' onClick={() => setCustomTable2(CustomTable2)}>
            Change 2
          </button>
        </>
      )
    }

    const { container } = render(<Test />)

    expect(container.querySelectorAll('table')).toHaveLength(2)

    await userEvent.click(screen.getByRole('button', { name: 'Change' }))

    expect(screen.findByText('Table 1')).not.toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Change 2' }))

    expect(screen.findByText('Table 1')).not.toBeNull()
    expect(screen.findByText('Table 2')).not.toBeNull()
  })
})
