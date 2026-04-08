import { fireEvent, render, waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let lastTableProps: any
let lastSelectProps: any
let lastInputSearchProps: any
let lastRangePickerProps: any

vi.mock('antd', async () => {
  const React = await import('react')

  return {
    DatePicker: {
      RangePicker(props: any) {
        lastRangePickerProps = props
        return React.createElement('div', { 'data-testid': 'range-picker' })
      },
    },
    Input: {
      Search(props: any) {
        lastInputSearchProps = props
        return React.createElement('div', { 'data-testid': 'input-search' })
      },
    },
    Radio: {
      Group(props: any) {
        return React.createElement('div', { 'data-testid': 'radio-group' }, props.children)
      },
      Button(props: any) {
        return React.createElement('button', props, props.children)
      },
    },
    Select(props: any) {
      lastSelectProps = props
      return React.createElement('div', { 'data-testid': 'select' })
    },
    Table(props: any) {
      lastTableProps = props
      return React.createElement('div', { 'data-testid': 'table' })
    },
  }
})

import { Table } from '../../Table'

async function getColumns() {
  await waitFor(() => {
    expect(lastTableProps?.columns?.length).toBeGreaterThan(0)
  })

  return lastTableProps.columns as any[]
}

function getColumn(columns: any[], id: string) {
  const column = columns.find((item) => item.id === id)

  if (!column) throw Error(`column ${id} not found`)

  return column
}

describe('Table/coverage', () => {
  beforeEach(() => {
    lastTableProps = undefined
    lastSelectProps = undefined
    lastInputSearchProps = undefined
    lastRangePickerProps = undefined
  })

  it('should exercise generated select dropdowns and union children renders', async () => {
    render(
      <Table
        items={[
          {
            id: 'name',
            children: ({ scene, value, values, index }: any) => (
              <span>{`${scene}:${value}:${values.extra}:${index}`}</span>
            ),
          },
          {
            id: 'status',
            options: Array.from({ length: 12 }).map((_, index) => `opt-${index}`),
          },
        ]}
        dataSource={[
          {
            id: 1,
            name: 'Alice',
            extra: 'row',
            status: 'opt-1',
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const nameColumn = getColumn(columns, 'name')
    const statusColumn = getColumn(columns, 'status')

    const renderedChild = nameColumn.render('Alice', { extra: 'row' })
    const childView = render(renderedChild)

    expect(childView.getByText('table:Alice:row:0')).toBeDefined()

    const setSelectedKeys = vi.fn()
    const confirm = vi.fn()
    const dropdown = render(
      statusColumn.filterDropdown({
        setSelectedKeys,
        selectedKeys: ['opt-0'],
        confirm,
      }),
    )

    fireEvent.keyDown(dropdown.container.firstChild as Element)

    lastSelectProps.onChange(['opt-1'])
    lastSelectProps.onChange([])

    expect(setSelectedKeys).toHaveBeenNthCalledWith(1, ['opt-1'])
    expect(setSelectedKeys).toHaveBeenNthCalledWith(2, [])
    expect(confirm).toHaveBeenCalledTimes(2)

    expect(lastSelectProps.filterOption('', undefined)).toBe(true)
    expect(lastSelectProps.filterOption('opt-1', { label: 1, value: 'opt-1' })).toBe(true)
    expect(lastSelectProps.filterOption('  opt-1 ', { label: 'Option 1', value: 'opt-1' })).toBe(
      true,
    )
    expect(lastSelectProps.filterOption('option', { label: 'Option 1', value: 'opt-1' })).toBe(true)
    expect(lastSelectProps.filterOption('missing', { label: 'Option 1', value: 'opt-1' })).toBe(
      false,
    )
  })

  it('should exercise generated text and scalar filter helpers', async () => {
    render(
      <Table
        items={[
          { id: 'name', type: 'string' },
          { id: 'tags', type: 'string[]' },
          { id: 'count', type: 'number' },
          { id: 'scores', type: 'number[]' },
          { id: 'custom', type: 'custom' as any },
        ]}
        dataSource={[
          {
            id: 1,
            name: 'Alpha',
            tags: ['Alpha'],
            count: 10,
            scores: [10],
            custom: 'match',
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const nameColumn = getColumn(columns, 'name')
    const tagsColumn = getColumn(columns, 'tags')
    const countColumn = getColumn(columns, 'count')
    const scoresColumn = getColumn(columns, 'scores')
    const customColumn = getColumn(columns, 'custom')

    const setSelectedKeys = vi.fn()
    const clearFilters = vi.fn()
    const confirm = vi.fn()

    render(
      nameColumn.filterDropdown({
        setSelectedKeys,
        confirm,
        clearFilters,
      }),
    )

    lastInputSearchProps.onSearch('')

    expect(setSelectedKeys).toHaveBeenCalledWith([])
    expect(clearFilters).toHaveBeenCalledTimes(1)
    expect(confirm).toHaveBeenCalledTimes(1)

    expect(nameColumn.onFilter('Alpha', { name: ' alpha beta ' })).toBe(true)
    expect(tagsColumn.onFilter(null, { tags: undefined })).toBe(true)
    expect(tagsColumn.onFilter('Alpha', { tags: [] })).toBe(false)
    expect(tagsColumn.onFilter('Alpha', { tags: [' beta ', ' Alpha '] })).toBe(true)
    expect(countColumn.onFilter(null, { count: 10 })).toBe(true)
    expect(countColumn.onFilter(10, { count: undefined })).toBe(false)
    expect(countColumn.onFilter('10', { count: 10 })).toBe(true)
    expect(scoresColumn.onFilter(null, { scores: undefined })).toBe(true)
    expect(scoresColumn.onFilter(10, { scores: [] })).toBe(false)
    expect(scoresColumn.onFilter('10', { scores: [10] })).toBe(true)
    expect(customColumn.onFilter(null, { custom: undefined })).toBe(true)
    expect(customColumn.onFilter('match', { custom: 'match' })).toBe(true)
  })

  it('should exercise generated date filters and sorters', async () => {
    render(
      <Table
        items={[{ id: 'createdAt', type: 'time' }]}
        dataSource={[
          {
            id: 1,
            createdAt: '2024-01-02T10:00:00.000Z',
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const createdAtColumn = getColumn(columns, 'createdAt')
    const start = dayjs('2024-01-01T00:00:00.000Z')
    const end = dayjs('2024-01-03T00:00:00.000Z')
    const setSelectedKeys = vi.fn()
    const confirm = vi.fn()

    expect(
      createdAtColumn.sorter({ createdAt: null }, { createdAt: start.toISOString() }, 'ascend'),
    ).toBe(1)
    expect(
      createdAtColumn.sorter({ createdAt: start.toISOString() }, { createdAt: null }, 'ascend'),
    ).toBe(-1)
    expect(
      createdAtColumn.sorter(
        { createdAt: start.toISOString() },
        { createdAt: end.toISOString() },
        'ascend',
      ),
    ).toBe(-1)

    render(
      createdAtColumn.filterDropdown({
        setSelectedKeys,
        confirm,
      }),
    )

    lastRangePickerProps.onChange([start, end])
    lastRangePickerProps.onChange(undefined)

    expect(setSelectedKeys).toHaveBeenNthCalledWith(1, [
      [start.startOf('day').toISOString(), end.endOf('day').toISOString()],
    ])
    expect(setSelectedKeys).toHaveBeenNthCalledWith(2, [])
    expect(confirm).toHaveBeenCalledTimes(2)

    expect(
      createdAtColumn.onFilter([undefined, undefined], { createdAt: start.toISOString() }),
    ).toBe(true)
    expect(
      createdAtColumn.onFilter([start.toISOString(), end.toISOString()], { createdAt: undefined }),
    ).toBe(false)
    expect(
      createdAtColumn.onFilter([start.toISOString(), end.toISOString()], {
        createdAt: '2024-01-02T10:00:00.000Z',
      }),
    ).toBe(true)
  })

  it('should throw when an extend type omits children and render', () => {
    expect(() =>
      render(
        <Table
          items={[{ id: 'secret', type: 'password' as any }]}
          extendTypes={{ password: {} }}
          dataSource={[{ id: 1, secret: 'hidden' }]}
        />,
      ),
    ).toThrow('password requires children or render')
  })
})
