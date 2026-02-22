import { setMock } from '@faasjs/react'
import { render, waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const tablePropsHistory: any[] = []

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')

  return {
    ...actual,
    Table: ((props: any) => {
      tablePropsHistory.push(props)

      return null
    }) as unknown as typeof actual.Table,
  }
})

import { Table } from '../../Table'

function getLatestTableProps() {
  const latest = tablePropsHistory.at(-1)

  if (!latest) throw Error('table props not captured')

  return latest
}

describe('Table/logic', () => {
  beforeEach(() => {
    tablePropsHistory.length = 0
    setMock(null)
  })

  afterEach(() => {
    setMock(null)
  })

  it('should build filters and sorters for built-in item types', async () => {
    render(
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
            numberValue: 2,
            numberList: [2, 3],
            booleanValue: true,
            dateValue: '2024-01-01T00:00:00.000Z',
            timeValue: '2024-01-01T12:00:00.000Z',
            customValue: 'custom',
          },
        ]}
      />,
    )

    await waitFor(() => {
      expect(tablePropsHistory.length > 0).toBe(true)
      expect(Array.isArray(getLatestTableProps().columns)).toBe(true)
    })

    const columns = getLatestTableProps().columns as any[]
    const stringColumn = columns.find((item) => item.id === 'stringValue')
    const stringListColumn = columns.find((item) => item.id === 'stringList')
    const numberColumn = columns.find((item) => item.id === 'numberValue')
    const numberListColumn = columns.find((item) => item.id === 'numberList')
    const dateColumn = columns.find((item) => item.id === 'dateValue')
    const timeColumn = columns.find((item) => item.id === 'timeValue')
    const customColumn = columns.find((item) => item.id === 'customValue')

    expect(stringColumn.onFilter('alp', { stringValue: 'Alpha' })).toBe(true)
    expect(stringColumn.onFilter('alp', { stringValue: null })).toBe(false)

    const setStringKeys = vi.fn()
    const clearStringFilters = vi.fn()
    const confirmStringFilter = vi.fn()
    const stringFilter = stringColumn.filterDropdown({
      setSelectedKeys: setStringKeys,
      confirm: confirmStringFilter,
      clearFilters: clearStringFilters,
    })
    stringFilter.props.onSearch('Alpha')
    stringFilter.props.onSearch('')

    expect(setStringKeys).toHaveBeenCalledWith(['Alpha'])
    expect(setStringKeys).toHaveBeenCalledWith([])
    expect(clearStringFilters).toHaveBeenCalledTimes(1)
    expect(confirmStringFilter).toHaveBeenCalledTimes(2)

    expect(stringListColumn.onFilter('alp', { stringList: ['Alpha'] })).toBe(true)
    expect(stringListColumn.onFilter(null, { stringList: [] })).toBe(true)
    expect(stringListColumn.onFilter('alp', { stringList: [] })).toBe(false)

    const setStringListKeys = vi.fn()
    const clearStringListFilters = vi.fn()
    const confirmStringListFilter = vi.fn()
    const stringListFilter = stringListColumn.filterDropdown({
      setSelectedKeys: setStringListKeys,
      confirm: confirmStringListFilter,
      clearFilters: clearStringListFilters,
    })
    stringListFilter.props.onSearch('Alpha')
    stringListFilter.props.onSearch('')

    expect(setStringListKeys).toHaveBeenCalledWith(['Alpha'])
    expect(setStringListKeys).toHaveBeenCalledWith([])
    expect(clearStringListFilters).toHaveBeenCalledTimes(1)
    expect(confirmStringListFilter).toHaveBeenCalledTimes(2)

    expect((numberColumn.sorter as any)({ numberValue: 1 }, { numberValue: 3 })).toBe(-2)
    expect(numberColumn.onFilter(2, { numberValue: 2 })).toBe(true)
    expect(numberColumn.onFilter(2, { numberValue: null })).toBe(false)
    expect(numberColumn.onFilter(null, { numberValue: 2 })).toBe(true)

    const setNumberKeys = vi.fn()
    const clearNumberFilters = vi.fn()
    const confirmNumberFilter = vi.fn()
    const numberFilter = numberColumn.filterDropdown({
      setSelectedKeys: setNumberKeys,
      confirm: confirmNumberFilter,
      clearFilters: clearNumberFilters,
    })
    numberFilter.props.onSearch('2')
    numberFilter.props.onSearch('')

    expect(setNumberKeys).toHaveBeenCalledWith([2])
    expect(setNumberKeys).toHaveBeenCalledWith([])
    expect(clearNumberFilters).toHaveBeenCalledTimes(1)
    expect(confirmNumberFilter).toHaveBeenCalledTimes(2)

    expect(numberListColumn.onFilter(null, { numberList: [] })).toBe(true)
    expect(numberListColumn.onFilter(2, { numberList: [2, 3] })).toBe(true)
    expect(numberListColumn.onFilter(2, { numberList: [] })).toBe(false)

    const setNumberListKeys = vi.fn()
    const clearNumberListFilters = vi.fn()
    const confirmNumberListFilter = vi.fn()
    const numberListFilter = numberListColumn.filterDropdown({
      setSelectedKeys: setNumberListKeys,
      confirm: confirmNumberListFilter,
      clearFilters: clearNumberListFilters,
    })
    numberListFilter.props.onSearch('2')
    numberListFilter.props.onSearch('')

    expect(setNumberListKeys).toHaveBeenCalledWith([2])
    expect(setNumberListKeys).toHaveBeenCalledWith([])
    expect(clearNumberListFilters).toHaveBeenCalledTimes(1)
    expect(confirmNumberListFilter).toHaveBeenCalledTimes(2)

    const start = dayjs('2024-01-01')
    const end = dayjs('2024-01-03')
    const dateRange = [start.toISOString(), end.endOf('day').toISOString()]

    expect((dateColumn.sorter as any)({ dateValue: null }, { dateValue: start }, 'ascend')).toBe(1)
    expect((dateColumn.sorter as any)({ dateValue: start }, { dateValue: null }, 'ascend')).toBe(-1)
    expect((dateColumn.sorter as any)({ dateValue: start }, { dateValue: end }, 'ascend')).toBe(-1)
    expect(dateColumn.onFilter(dateRange, { dateValue: '2024-01-02T00:00:00.000Z' })).toBe(true)
    expect(dateColumn.onFilter(dateRange, { dateValue: null })).toBe(false)

    const setDateKeys = vi.fn()
    const confirmDateFilter = vi.fn()
    const dateFilter = dateColumn.filterDropdown({
      setSelectedKeys: setDateKeys,
      confirm: confirmDateFilter,
    })
    dateFilter.props.onChange([start, end])
    dateFilter.props.onChange(null)

    expect(setDateKeys).toHaveBeenCalledWith([
      [start.startOf('day').toISOString(), end.endOf('day').toISOString()],
    ])
    expect(setDateKeys).toHaveBeenCalledWith([])
    expect(confirmDateFilter).toHaveBeenCalledTimes(2)

    expect((timeColumn.sorter as any)({ timeValue: null }, { timeValue: start }, 'ascend')).toBe(1)
    expect((timeColumn.sorter as any)({ timeValue: start }, { timeValue: null }, 'ascend')).toBe(-1)
    expect((timeColumn.sorter as any)({ timeValue: start }, { timeValue: end }, 'ascend')).toBe(-1)
    expect(timeColumn.onFilter(dateRange, { timeValue: '2024-01-02T00:00:00.000Z' })).toBe(true)
    expect(timeColumn.onFilter(dateRange, { timeValue: null })).toBe(false)

    const setTimeKeys = vi.fn()
    const confirmTimeFilter = vi.fn()
    const timeFilter = timeColumn.filterDropdown({
      setSelectedKeys: setTimeKeys,
      confirm: confirmTimeFilter,
    })
    timeFilter.props.onChange([start, end])
    timeFilter.props.onChange(null)

    expect(setTimeKeys).toHaveBeenCalledWith([
      [start.startOf('day').toISOString(), end.endOf('day').toISOString()],
    ])
    expect(setTimeKeys).toHaveBeenCalledWith([])
    expect(confirmTimeFilter).toHaveBeenCalledTimes(2)

    expect(customColumn.render('custom')).toBe('custom')
    expect(customColumn.onFilter('custom', { customValue: 'custom' })).toBe(true)
    expect(customColumn.onFilter(null, { customValue: null })).toBe(true)
  })

  it('should use select dropdown for large option list', async () => {
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

    await waitFor(() => {
      expect(tablePropsHistory.length > 0).toBe(true)
      expect(Array.isArray(getLatestTableProps().columns)).toBe(true)
    })

    const statusColumn = (getLatestTableProps().columns as any[]).find((item) => item.id === 'status')

    expect(typeof statusColumn.filterDropdown).toBe('function')

    const setSelectedKeys = vi.fn()
    const confirm = vi.fn()
    const dropdown = statusColumn.filterDropdown({
      setSelectedKeys,
      selectedKeys: ['opt-1'],
      confirm,
    })
    const select = dropdown.props.children

    select.props.onChange(['opt-2'])
    select.props.onChange([])

    expect(setSelectedKeys).toHaveBeenCalledWith(['opt-2'])
    expect(setSelectedKeys).toHaveBeenCalledWith([])
    expect(confirm).toHaveBeenCalledTimes(2)

    expect(select.props.filterOption('opt-2', { label: 'Opt 2', value: 'opt-2' })).toBe(true)
    expect(select.props.filterOption('missing', { label: 'Opt 2', value: 'opt-2' })).toBe(false)
    expect(select.props.filterOption('', undefined)).toBe(true)
  })

  it('should keep custom filterDropdown when provided', async () => {
    const customFilterDropdown = vi.fn(() => null)

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

    await waitFor(() => {
      expect(tablePropsHistory.length > 0).toBe(true)
      expect(Array.isArray(getLatestTableProps().columns)).toBe(true)
    })

    const statusColumn = (getLatestTableProps().columns as any[]).find((item) => item.id === 'status')

    expect(statusColumn.filterDropdown).toBe(customFilterDropdown)
  })

  it('should render empty table when no data source and no faasData', async () => {
    render(<Table items={[{ id: 'status' }]} />)

    await waitFor(() => {
      expect(tablePropsHistory.length > 0).toBe(true)
      expect(Array.isArray(getLatestTableProps().dataSource)).toBe(true)
    })

    expect(getLatestTableProps().dataSource).toEqual([])
  })

  it('should consume faas data options and reload with transformed params', async () => {
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

    const onChange = vi.fn((pagination, filters, sorter, extra) => ({
      pagination: {
        ...(pagination || {}),
        current: 2,
      },
      filters: {
        ...(filters || {}),
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

    render(
      <Table rowKey='id' items={[{ id: 'status' }]} faasData={{ action: 'table/list' }} onChange={onChange} />,
    )

    await waitFor(() => {
      expect(tablePropsHistory.length > 0).toBe(true)
      expect(Array.isArray(getLatestTableProps().dataSource)).toBe(true)
      expect(getLatestTableProps().dataSource[0]?.status).toBe('online')
    })

    const latestProps = getLatestTableProps()
    const statusColumn = (latestProps.columns as any[]).find((item) => item.id === 'status')

    expect(statusColumn.filters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'Online', value: 'online' }),
        expect.objectContaining({ value: null }),
      ]),
    )

    latestProps.onChange(
      { current: 1, pageSize: 10 },
      { status: ['online'] },
      { field: 'status', order: 'ascend' },
      { action: 'filter', currentDataSource: latestProps.dataSource },
    )

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
      },
      extra: {
        action: 'filter',
      },
    })
  })
})
