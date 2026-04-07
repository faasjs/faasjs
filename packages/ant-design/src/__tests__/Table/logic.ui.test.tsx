import { setMock } from '@faasjs/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Table } from '../../Table'

const createUser = () => userEvent.setup({ pointerEventsCheck: 0, delay: 0 })

describe('Table/logic', () => {
  it('should render built-in item types and generated controls', async () => {
    const user = createUser()
    const { container } = render(
      <Table
        items={[
          { id: 'stringValue', type: 'string' },
          { id: 'stringList', type: 'string[]' },
          { id: 'numberValue', type: 'number' },
          { id: 'numberList', type: 'number[]' },
          { id: 'booleanValue', type: 'boolean' },
          { id: 'dateValue', type: 'date' },
          { id: 'timeValue', type: 'time' },
          { id: 'customValue', type: 'custom' as any },
        ]}
        dataSource={[
          {
            id: 1,
            stringValue: 'Alpha',
            stringList: ['Alpha', 'Beta'],
            numberValue: 22,
            numberList: [22, 23],
            booleanValue: true,
            dateValue: '2024-01-01T00:00:00.000Z',
            timeValue: '2024-01-01 12:00:00',
            customValue: 'custom',
          },
          {
            id: 2,
            stringValue: 'Gamma',
            stringList: ['Gamma'],
            numberValue: 11,
            numberList: [11],
            booleanValue: false,
            dateValue: '2024-01-02T00:00:00.000Z',
            timeValue: '2024-01-02 12:00:00',
            customValue: 'other',
          },
        ]}
      />,
    )

    expect(await screen.findByText('Alpha')).toBeDefined()
    expect(screen.getByText('Alpha, Beta')).toBeDefined()
    expect(screen.getByText('22')).toBeDefined()
    expect(screen.getByText('22, 23')).toBeDefined()
    expect(screen.getByText('2024-01-01')).toBeDefined()
    expect(screen.getByText('2024-01-01 12:00:00')).toBeDefined()
    expect(screen.getByText('custom')).toBeDefined()
    expect(screen.getAllByRole('img', { name: 'filter' })).toHaveLength(7)
    expect(container.querySelectorAll('.ant-table-column-sorters')).toHaveLength(3)

    await user.click(screen.getAllByRole('img', { name: 'filter' })[0])
    const filterInput = await screen.findByPlaceholderText('Search StringValue')
    await user.type(filterInput, 'Alpha{enter}')

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeDefined()
      expect(screen.queryByText('Gamma')).toBeNull()
    })
  })

  it('should use select dropdown for large option list', async () => {
    const user = createUser()

    render(
      <Table
        items={[
          {
            id: 'status',
            options: Array.from({ length: 12 }).map((_, index) => `opt-${index}`),
          },
        ]}
        dataSource={[{ id: 1, status: 'opt-1' }]}
      />,
    )

    await user.click(screen.getByRole('img', { name: 'filter' }))

    expect(await screen.findByText('Search Status')).toBeDefined()
  })

  it('should keep custom filterDropdown when provided', async () => {
    const user = createUser()
    const customFilterDropdown = vi.fn<(...args: any[]) => any>(() => (
      <div>Custom Status Filter</div>
    ))

    render(
      <Table
        items={[
          {
            id: 'status',
            options: ['enabled', 'disabled'],
            filterDropdown: customFilterDropdown,
          },
        ]}
        dataSource={[{ id: 1, status: 'enabled' }]}
      />,
    )

    await user.click(screen.getByRole('img', { name: 'filter' }))

    expect(await screen.findByText('Custom Status Filter')).toBeDefined()
    expect(customFilterDropdown).toHaveBeenCalled()
  })

  it('should render empty table when no data source and no faasData', async () => {
    const { container } = render(<Table items={[{ id: 'status' }]} />)

    await waitFor(() => {
      expect(container.querySelector('.ant-empty-description')?.textContent).toMatch(/No data/i)
    })
  })

  it('should consume faas data options and reload with transformed params', async () => {
    const user = createUser()
    const requests: any[] = []

    setMock(async (_action, params) => {
      requests.push(params)

      return {
        data: {
          rows: [{ id: 1, status: 'online' }],
          options: {
            status: [
              {
                label: 'Online',
                value: 'online',
              },
            ],
          },
          pagination: {
            current: 1,
            pageSize: 10,
            total: 20,
          },
        },
      }
    })

    const onChange = vi.fn<(...args: any[]) => any>((pagination, filters, sorter, extra) => ({
      pagination: {
        ...pagination,
        current: 2,
      },
      filters: {
        ...filters,
        status: ['offline'],
      },
      sorter: Array.isArray(sorter)
        ? sorter
        : {
            field: sorter.field || 'status',
            order: sorter.order || 'descend',
          },
      extra,
    }))

    const { container } = render(
      <Table
        rowKey="id"
        items={[{ id: 'status' }]}
        faasData={{ action: 'table/list' }}
        onChange={onChange}
      />,
    )

    expect(await screen.findByText('Online')).toBeDefined()

    await waitFor(() => {
      expect(screen.getAllByRole('img', { name: 'filter' })).toHaveLength(1)
    })

    const page2 = container.querySelector('.ant-pagination-item-2')

    if (!(page2 instanceof HTMLElement)) throw Error('page 2 not found')

    await user.click(page2)

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(requests.length > 1).toBe(true)
    })

    expect(requests.at(-1)).toMatchObject({
      pagination: {
        current: 2,
      },
      filters: {
        status: ['offline'],
      },
      sorter: {
        field: 'status',
        order: 'descend',
      },
      extra: {
        action: 'paginate',
      },
    })
  })
})
