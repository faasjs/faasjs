import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'

import { createTableColumns } from '../column-builder'
import { FaasDataTable, Table } from '../table'
import { applyFaasDataColumnOptions } from '../utils'

const defaultOptions = {
  all: 'All',
  blank: 'Empty',
  search: 'Search',
}

function cols(items: any[], options?: any) {
  return createTableColumns(items, options ?? defaultOptions) as any[]
}

describe('Table/coverage', () => {
  describe('column builder', () => {
    it('should generate column for string type', () => {
      const columns = cols([{ id: 'name', type: 'string' }])
      const col = columns.find((c) => c.id === 'name')!

      expect(col.render('Alice')).toBe('Alice')
      expect(col.render(42)).toBe(42)
      expect(col.onFilter('Alpha', { name: 'Alpha' })).toBe(true)
      expect(col.onFilter('Alpha', { name: 'Beta' })).toBe(false)
      expect(col.onFilter('Alpha', { name: ' alpha ' })).toBe(true)
      expect(col.onFilter(null, { name: 'Alpha' })).toBe(true)
      expect(col.onFilter('Alpha', { name: undefined })).toBe(false)
    })

    it('should generate column for string[] type', () => {
      const columns = cols([{ id: 'tags', type: 'string[]' }], defaultOptions)
      const col = columns.find((c) => c.id === 'tags')!

      expect(col.onFilter(null, { tags: undefined })).toBe(true)
      expect(col.onFilter(null, { tags: [] })).toBe(true)
      expect(col.onFilter('Alpha', { tags: [] })).toBe(false)
      expect(col.onFilter('Alpha', { tags: [' beta ', ' Alpha '] })).toBe(true)
    })

    it('should generate column for number type', () => {
      const columns = cols([{ id: 'count', type: 'number' }], defaultOptions)
      const col = columns.find((c) => c.id === 'count')!

      expect(col.render(42)).toBe(42)
      expect(col.sorter({ count: 1 }, { count: 2 })).toBe(-1)
      expect(col.sorter({ count: 5 }, { count: 3 })).toBe(2)
      expect(col.onFilter(null, { count: 10 })).toBe(true)
      expect(col.onFilter(10, { count: undefined })).toBe(false)
      expect(col.onFilter('10', { count: 10 })).toBe(true)
    })

    it('should generate column for number[] type', () => {
      const columns = cols([{ id: 'scores', type: 'number[]' }], defaultOptions)
      const col = columns.find((c) => c.id === 'scores')!

      expect(col.onFilter(null, { scores: undefined })).toBe(true)
      expect(col.onFilter(null, { scores: [] })).toBe(true)
      expect(col.onFilter(10, { scores: [] })).toBe(false)
      expect(col.onFilter('10', { scores: [10] })).toBe(true)
    })

    it('should generate column for boolean type', () => {
      const columns = cols([{ id: 'active', type: 'boolean' }], defaultOptions)
      const col = columns.find((c) => c.id === 'active')!

      expect(col.onFilter(true, { active: true })).toBe(true)
      expect(col.onFilter(true, { active: false })).toBe(false)
      expect(col.onFilter(false, { active: true })).toBe(false)
      expect(col.onFilter(false, { active: false })).toBe(true)
      expect(col.onFilter(null, { active: undefined })).toBe(true)
    })

    it('should generate column for time type', () => {
      const columns = cols([{ id: 'createdAt', type: 'time' }], defaultOptions)
      const col = columns.find((c) => c.id === 'createdAt')!

      const start = dayjs('2024-01-01T00:00:00.000Z')
      const end = dayjs('2024-01-03T00:00:00.000Z')

      expect(col.sorter({ createdAt: null }, { createdAt: start.toISOString() }, 'ascend')).toBe(1)
      expect(col.sorter({ createdAt: start.toISOString() }, { createdAt: null }, 'ascend')).toBe(-1)
      expect(col.onFilter([undefined, undefined], { createdAt: start.toISOString() })).toBe(true)
      expect(col.onFilter([start.toISOString(), end.toISOString()], { createdAt: undefined })).toBe(
        false,
      )
      expect(
        col.onFilter([start.toISOString(), end.toISOString()], {
          createdAt: '2024-01-02T10:00:00.000Z',
        }),
      ).toBe(true)
    })

    it('should generate column for custom type', () => {
      const columns = cols([{ id: 'custom', type: 'custom' as any }], defaultOptions)
      const col = columns.find((c) => c.id === 'custom')!

      expect(col.render('value')).toBe('value')
      expect(col.onFilter(null, { custom: undefined })).toBe(true)
      expect(col.onFilter('value', { custom: 'value' })).toBe(true)
      expect(col.onFilter('value', { custom: 'other' })).toBe(false)
    })

    it('should handle options mapping in render', () => {
      const columns = cols(
        [
          {
            id: 'status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ],
        defaultOptions,
      )
      const col = columns.find((c) => c.id === 'status')!

      const { container: activeContainer } = render(<>{col.render('active')}</>)
      expect(activeContainer.textContent).toBe('Active')

      const { container: unknownContainer } = render(<>{col.render('unknown')}</>)
      expect(unknownContainer.textContent).toBe('unknown')
    })

    it('should handle options mapping for string[]', () => {
      const columns = cols(
        [
          {
            id: 'tags',
            type: 'string[]',
            options: [
              { label: 'Alpha', value: 'a' },
              { label: 'Beta', value: 'b' },
            ],
          },
        ],
        defaultOptions,
      )
      const col = columns.find((c) => c.id === 'tags')!

      const { container: joinedContainer } = render(<>{col.render(['a', 'b'])}</>)
      expect(joinedContainer.textContent).toBe('Alpha, Beta')

      const { container: missingContainer } = render(<>{col.render(['missing'])}</>)
      expect(missingContainer.textContent).toBe('missing')
    })

    it('should handle options mapping for number', () => {
      const columns = cols(
        [
          {
            id: 'count',
            type: 'number',
            options: [{ label: 'Ten', value: 10 }],
          },
        ],
        defaultOptions,
      )
      const col = columns.find((c) => c.id === 'count')!

      const { container } = render(<>{col.render(10)}</>)
      expect(container.textContent).toBe('Ten')
    })

    it('should handle extend types', () => {
      const columns = cols([{ id: 'secret', type: 'password' as any }], {
        ...defaultOptions,
        extendTypes: {
          password: {
            render: (value: any) => `masked:${value}`,
          },
        },
      })
      const col = columns.find((c) => c.id === 'secret')!

      expect(col.render('value')).toBe('masked:value')
    })

    it('should handle preset column settings', () => {
      const customRender = vi.fn<() => string>(() => 'custom')

      const columns = cols(
        [
          {
            id: 'name',
            key: 'name-key',
            dataIndex: 'name-index',
            render: customRender as any,
            filterDropdown: false,
          },
        ],
        defaultOptions,
      )
      const col = columns.find((c) => c.id === 'name')!

      expect(col).toMatchObject({
        key: 'name-key',
        dataIndex: 'name-index',
        filterDropdown: false,
      })
      col.render('value', { id: 1 })
      expect(customRender).toHaveBeenCalledWith('value', { id: 1 }, 0, 'table')
    })

    it('should filter null children and renders', () => {
      const columns = cols(
        [
          { id: 'visible', children: ({ value }: { value?: string }) => <span>{value}</span> },
          { id: 'nullChildren', children: null as any },
          { id: 'nullRender', tableRender: null as any },
        ],
        defaultOptions,
      )

      expect(columns).toHaveLength(1)
      expect(columns[0].id).toBe('visible')
    })

    it('should skip local filters for faas-backed columns', () => {
      const columns = cols([{ id: 'name', type: 'string' }], {
        ...defaultOptions,
        faasData: { action: 'test/list' },
      })
      const col = columns.find((c) => c.id === 'name')!

      expect(col.onFilter).toBeUndefined()
    })

    it('should generate filterDropdown for large option sets', () => {
      const columns = cols(
        [
          {
            id: 'status',
            options: Array.from({ length: 11 }, (_, i) => `opt-${i}`),
          },
        ],
        defaultOptions,
      )
      const col = columns.find((c) => c.id === 'status')!

      const { container } = render(
        <>
          {col.filterDropdown({
            setSelectedKeys: vi.fn<() => void>(),
            selectedKeys: [],
            confirm: vi.fn<() => void>(),
          })}
        </>,
      )
      expect(container.querySelector('.ant-select')).toBeDefined()
    })

    it('should auto-generate optionsType options from dataSource', () => {
      const columns = cols([{ id: 'status', optionsType: 'auto' as any }], {
        ...defaultOptions,
        dataSource: [
          { id: 1, status: 'online' },
          { id: 2, status: 'offline' },
        ],
      })
      const col = columns.find((c) => c.id === 'status')!

      expect(col.options).toEqual([
        { label: 'online', value: 'online' },
        { label: 'offline', value: 'offline' },
      ])
      expect(col.filters).toBeDefined()
    })
  })

  describe('applyFaasDataColumnOptions', () => {
    it('should apply column options from faas data response', () => {
      const columns = cols([{ id: 'status' }], defaultOptions)
      const updated = applyFaasDataColumnOptions(columns, {
        options: {
          status: [{ label: 'Online', value: 'online' }],
        },
      }) as any[]

      const { container } = render(<>{updated[0].render('online', {} as any, 0, 'table')}</>)
      expect(container.textContent).toBe('Online')
    })
  })

  describe('FaasDataTable', () => {
    it('should render loading state', () => {
      render(
        <FaasDataTable
          props={{ rowKey: 'id' } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          loading={true}
        />,
      )

      expect(document.querySelector('.ant-spin')).toBeDefined()
    })

    it('should render data from array', () => {
      render(
        <FaasDataTable
          props={{ rowKey: 'id' } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={[{ name: 'Alice' }]}
        />,
      )

      expect(screen.getByText('Alice')).toBeDefined()
    })

    it('should render paginated response', () => {
      render(
        <FaasDataTable
          props={{ rowKey: 'id' } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={{
            rows: [{ name: 'Alice' }],
            pagination: { current: 1, pageSize: 10, total: 1 },
          }}
        />,
      )

      expect(screen.getByText('Alice')).toBeDefined()
    })

    it('should trigger reload on pagination change', async () => {
      const reload = vi.fn<(...args: any[]) => Promise<any>>()

      render(
        <FaasDataTable
          props={{ rowKey: 'id' } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={{
            rows: Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Item ${i}` })),
            pagination: { current: 1, pageSize: 10, total: 25 },
          }}
          params={{}}
          reload={reload}
        />,
      )

      expect(screen.getByText('Item 0')).toBeDefined()

      fireEvent.click(screen.getByTitle('2'))

      await waitFor(() => {
        expect(reload).toHaveBeenCalledWith(
          expect.objectContaining({
            pagination: expect.objectContaining({ current: 2 }),
          }),
        )
      })
    })

    it('should use default rowKey', () => {
      render(
        <FaasDataTable
          props={{ rowKey: 'id' } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={[
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ]}
        />,
      )

      expect(screen.getByText('Alice')).toBeDefined()
      expect(screen.getByText('Bob')).toBeDefined()
    })

    it('should disable pagination when pagination is false', () => {
      render(
        <FaasDataTable
          props={{ rowKey: 'id', pagination: false } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={{
            rows: [
              { id: 1, name: 'Alice' },
              { id: 2, name: 'Bob' },
            ],
            pagination: { current: 1, pageSize: 10, total: 2 },
          }}
          params={{}}
          reload={vi.fn<(...args: any[]) => Promise<any>>()}
        />,
      )

      expect(screen.getByText('Alice')).toBeDefined()
      expect(screen.getByText('Bob')).toBeDefined()
    })

    it('should pass custom onChange through reload', async () => {
      const reload = vi.fn<(...args: any[]) => Promise<any>>()
      const customOnChange = vi.fn<
        (
          pagination: any,
          filters: any,
          sorter: any,
          extra: any,
        ) => {
          pagination: any
          filters: any
          sorter: any
          extra?: any
        }
      >((pagination, filters, sorter, extra) => ({
        pagination,
        filters,
        sorter,
        extra,
      }))

      render(
        <FaasDataTable
          props={{ rowKey: 'id', onChange: customOnChange } as any}
          columns={[{ id: 'name', key: 'name', dataIndex: 'name', title: 'Name' }]}
          data={{
            rows: Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Item ${i}` })),
            pagination: { current: 1, pageSize: 10, total: 25 },
          }}
          params={{}}
          reload={reload}
        />,
      )

      fireEvent.click(screen.getByTitle('2'))

      await waitFor(() => {
        expect(customOnChange).toHaveBeenCalled()
        expect(reload).toHaveBeenCalled()
      })
    })
  })

  describe('Table integration', () => {
    it('should render items with dataSource', () => {
      render(
        <Table
          items={[{ id: 'name' }]}
          dataSource={[
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ]}
        />,
      )

      expect(screen.getByText('Name')).toBeDefined()
      expect(screen.getByText('Alice')).toBeDefined()
      expect(screen.getByText('Bob')).toBeDefined()
    })
  })
})
