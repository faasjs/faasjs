import { fireEvent, render, waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let lastTableProps: any
let lastSelectProps: any
let lastInputSearchProps: any
let lastRangePickerProps: any
let lastFaasDataWrapperProps: any
let mockedFaasDataInjection: any

vi.mock('antd', async () => {
  const React = await import('react')

  return {
    DatePicker: {
      RangePicker(props: any) {
        lastRangePickerProps = props
        return React.createElement('div', { 'data-testid': 'range-picker' })
      },
    },
    Descriptions(props: any) {
      return React.createElement(
        'div',
        { 'data-testid': 'descriptions' },
        (props.items || []).map((item: any) =>
          React.createElement('div', { key: item.key }, item.label, item.children),
        ),
      )
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
    Space(props: any) {
      return React.createElement('div', { 'data-testid': 'space' }, props.children)
    },
    Table(props: any) {
      lastTableProps = props
      return React.createElement('div', { 'data-testid': 'table' })
    },
    Typography: {
      Text(props: any) {
        return React.createElement('span', props, props.children)
      },
    },
  }
})

vi.mock('../../FaasDataWrapper', async () => {
  const React = await import('react')

  return {
    FaasDataWrapper(props: any) {
      lastFaasDataWrapperProps = props

      if (typeof props.render === 'function') return props.render(mockedFaasDataInjection)

      if (React.isValidElement(props.children))
        return React.cloneElement(props.children, mockedFaasDataInjection)

      return props.children ?? null
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
    lastFaasDataWrapperProps = undefined
    mockedFaasDataInjection = undefined
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
      createdAtColumn.sorter({ createdAt: null }, { createdAt: start.toISOString() }, 'descend'),
    ).toBe(-1)
    expect(
      createdAtColumn.sorter({ createdAt: start.toISOString() }, { createdAt: null }, 'ascend'),
    ).toBe(-1)
    expect(
      createdAtColumn.sorter({ createdAt: start.toISOString() }, { createdAt: null }, 'descend'),
    ).toBe(1)
    expect(
      createdAtColumn.sorter(
        { createdAt: start.toISOString() },
        { createdAt: end.toISOString() },
        'ascend',
      ),
    ).toBe(-1)
    expect(
      createdAtColumn.sorter(
        { createdAt: end.toISOString() },
        { createdAt: start.toISOString() },
        'ascend',
      ),
    ).toBe(1)

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

  it('should keep preset column settings and skip auto options for empty data', async () => {
    const customRender = vi.fn(() => 'custom-render')
    const customFilter = vi.fn(() => true)
    const customSorter = vi.fn(() => 0)

    render(
      <Table
        items={[
          {
            id: 'name',
            type: 'string',
            key: 'name-key',
            dataIndex: 'name-index',
            render: customRender,
            filterDropdown: false,
          },
          {
            id: 'tags',
            type: 'string[]',
            render: customRender,
            filterDropdown: true,
            onFilter: customFilter,
          },
          {
            id: 'count',
            type: 'number',
            render: customRender,
            filterDropdown: true,
            filters: [{ text: 'preset', value: 1 }],
            onFilter: customFilter,
            sorter: customSorter,
          },
          {
            id: 'scores',
            type: 'number[]',
            render: customRender,
            filterDropdown: true,
            filters: [{ text: 'preset', value: 1 }],
            onFilter: customFilter,
          },
          {
            id: 'active',
            type: 'boolean',
            filterDropdown: false,
            onFilter: customFilter,
          },
          {
            id: 'createdAt',
            type: 'time',
            render: customRender,
            filterDropdown: true,
            onFilter: customFilter,
            sorter: customSorter,
          },
          {
            id: 'meta',
            type: 'object',
            render: customRender,
          },
          {
            id: 'metaList',
            type: 'object[]',
            render: customRender,
          },
          {
            id: 'custom',
            type: 'custom' as any,
            render: customRender,
            filterDropdown: false,
            onFilter: customFilter,
          },
          {
            id: 'status',
            optionsType: 'auto',
          },
        ]}
        dataSource={[]}
      />,
    )

    const columns = await getColumns()
    const nameColumn = getColumn(columns, 'name')

    expect(nameColumn).toMatchObject({
      key: 'name-key',
      dataIndex: 'name-index',
      filterDropdown: false,
    })
    expect(nameColumn.render('value', { id: 1 })).toBe('custom-render')
    expect(customRender).toHaveBeenCalledWith('value', { id: 1 }, 0, 'table')
    expect(getColumn(columns, 'tags')).toMatchObject({
      filterDropdown: true,
      onFilter: customFilter,
    })
    expect(getColumn(columns, 'tags').render(['a'], { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'count')).toMatchObject({
      filterDropdown: true,
      onFilter: customFilter,
      sorter: customSorter,
    })
    expect(getColumn(columns, 'count').render(1, { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'scores')).toMatchObject({
      filterDropdown: true,
      onFilter: customFilter,
    })
    expect(getColumn(columns, 'scores').render([1], { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'active')).toMatchObject({
      filterDropdown: false,
      onFilter: customFilter,
    })
    expect(getColumn(columns, 'createdAt')).toMatchObject({
      filterDropdown: true,
      onFilter: customFilter,
      sorter: customSorter,
    })
    expect(getColumn(columns, 'createdAt').render('2024-01-01', { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'meta').render({}, { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'metaList').render([], { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'custom')).toMatchObject({
      filterDropdown: false,
      onFilter: customFilter,
    })
    expect(getColumn(columns, 'custom').render('value', { id: 1 })).toBe('custom-render')
    expect(getColumn(columns, 'status').options).toBeUndefined()
  })

  it('should exercise option mapping, truthy searches, and object render fallbacks', async () => {
    render(
      <Table
        items={[
          {
            id: 'plain',
          },
          {
            id: 'tags',
            type: 'string[]',
            options: [
              { label: 'Alpha', value: 'a' },
              { label: 'Beta', value: 'b' },
            ],
          },
          {
            id: 'count',
            type: 'number',
            options: [{ label: 'Twenty', value: 20 }],
          },
          {
            id: 'search',
            type: 'string',
            filterDropdown: undefined,
          },
          {
            id: 'meta',
            type: 'object',
            object: [{ id: 'key' }],
          },
          {
            id: 'metaList',
            type: 'object[]',
            object: [{ id: 'key' }],
          },
        ]}
        dataSource={[
          {
            id: 1,
            plain: 'raw',
            tags: ['a', 'b'],
            count: 20,
            search: 'Alpha',
            meta: undefined,
            metaList: [{ key: 'value' }],
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const searchColumn = getColumn(columns, 'search')

    expect(getColumn(columns, 'plain').render('raw')).toBe('raw')
    expect(getColumn(columns, 'tags').render(['a', 'b'])).toBe('Alpha, Beta')
    expect(getColumn(columns, 'count').render(20)).toBe('Twenty')

    render(
      searchColumn.filterDropdown({
        setSelectedKeys: vi.fn(),
        confirm: vi.fn(),
        clearFilters: vi.fn(),
      }),
    )

    lastInputSearchProps.onSearch('Alpha')
    expect(lastInputSearchProps).toMatchObject({
      placeholder: 'Search Search',
    })

    const objectFallback = render(getColumn(columns, 'meta').render(undefined))
    expect(objectFallback.getByText('Key')).toBeDefined()
    expect(objectFallback.getByText('Empty')).toBeDefined()

    const objectListFallback = render(getColumn(columns, 'metaList').render([{ key: 'value' }]))
    expect(objectListFallback.getByText('Key')).toBeDefined()
    expect(objectListFallback.getByText((content) => content.includes('value'))).toBeDefined()
  })

  it('should keep raw values when options do not match and search with truthy values', async () => {
    render(
      <Table
        items={[
          {
            id: 'tags',
            type: 'string[]',
            options: [{ label: 'Known', value: 'known' }],
          },
          {
            id: 'count',
            type: 'number',
            options: [{ label: 'One', value: 1 }],
          },
          {
            id: 'name',
            type: 'string',
          },
        ]}
        dataSource={[
          {
            id: 1,
            tags: ['missing'],
            count: 2,
            name: 'Alpha',
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const nameColumn = getColumn(columns, 'name')
    const setSelectedKeys = vi.fn()
    const confirm = vi.fn()

    expect(getColumn(columns, 'tags').render(['missing'])).toBe('missing')
    expect(getColumn(columns, 'count').render(2)).toBe(2)
    expect(nameColumn.onFilter('', { name: 'Alpha' })).toBe(true)
    expect(nameColumn.onFilter('Alpha', { name: undefined })).toBe(false)

    render(
      nameColumn.filterDropdown({
        setSelectedKeys,
        confirm,
        clearFilters: vi.fn(),
      }),
    )

    lastInputSearchProps.onSearch('Alpha')

    expect(setSelectedKeys).toHaveBeenCalledWith(['Alpha'])
    expect(confirm).toHaveBeenCalledTimes(1)
  })

  it('should exercise faas data branches for empty, array, and paginated payloads', async () => {
    mockedFaasDataInjection = {
      data: undefined,
      loading: true,
    }

    const { rerender } = render(
      <Table rowKey="id" items={[{ id: 'status' }]} faasData={{ action: 'table/list' }} />,
    )

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([])
    })

    expect(lastTableProps.loading).toBe(true)
    expect(lastFaasDataWrapperProps.action).toBe('table/list')

    mockedFaasDataInjection = {
      data: [{ id: 1, status: 'online' }],
      loading: false,
    }

    rerender(<Table rowKey="id" items={[{ id: 'status' }]} faasData={{ action: 'table/list' }} />)

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([{ id: 1, status: 'online' }])
    })

    expect(lastTableProps.loading).toBe(false)

    const reload = vi.fn()

    mockedFaasDataInjection = {
      data: {
        rows: [{ id: 1, status: 'online' }],
        options: {
          status: [{ label: 'Online', value: 'online' }],
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
        },
      },
      params: { base: 1 },
      reload,
      loading: false,
    }

    rerender(
      <Table
        rowKey="id"
        items={[{ id: 'status' }]}
        pagination={false}
        faasData={{ action: 'table/list' }}
      />,
    )

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([{ id: 1, status: 'online' }])
      expect(lastTableProps?.pagination).toBe(false)
    })

    const pagedColumns = lastTableProps.columns as any[]
    const statusColumn = getColumn(pagedColumns, 'status')

    expect(statusColumn.render('online')).toBe('Online')
    expect(statusColumn.filterDropdown).toBeUndefined()

    lastTableProps.onChange?.(
      { current: 2, pageSize: 10 },
      { status: ['offline'] },
      { field: 'status', order: 'descend' },
      { action: 'paginate' },
    )

    expect(reload).toHaveBeenCalledWith({
      base: 1,
      pagination: { current: 2, pageSize: 10 },
      filters: { status: ['offline'] },
      sorter: { field: 'status', order: 'descend' },
    })

    mockedFaasDataInjection = {
      data: {
        rows: [{ id: 2, status: 'offline' }],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
        },
      },
      loading: false,
      reload: vi.fn(),
    }

    const customOnChange = vi.fn((pagination, filters, sorter, extra) => ({
      pagination,
      filters,
      sorter,
      extra,
    }))

    rerender(
      <Table
        rowKey="id"
        items={[{ id: 'status', filterDropdown: false }]}
        faasData={{ action: 'table/list' }}
        onChange={customOnChange}
      />,
    )

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([{ id: 2, status: 'offline' }])
    })

    lastTableProps.onChange?.(
      { current: 3, pageSize: 10 },
      { status: ['offline'] },
      { field: 'status', order: 'ascend' },
      { action: 'paginate' },
    )

    expect(customOnChange).toHaveBeenCalledTimes(1)
  })

  it('should use default row keys and omit loading for array faas data', async () => {
    mockedFaasDataInjection = {
      data: [{ id: 3, status: 'idle' }],
    }

    render(<Table items={[{ id: 'status' }]} faasData={{ action: 'table/list' }} />)

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([{ id: 3, status: 'idle' }])
    })

    expect(lastTableProps.rowKey).toBe('id')
    expect(lastTableProps.loading).toBeUndefined()
  })

  it('should skip local filters for faas-backed columns and no-op when reload is missing', async () => {
    mockedFaasDataInjection = {
      data: {
        rows: [
          {
            id: 1,
            name: 'Alpha',
            tags: ['a'],
            count: 1,
            scores: [1],
            active: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            custom: 'x',
          },
        ],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
        },
      },
    }

    render(
      <Table
        rowKey="id"
        items={[
          { id: 'name', type: 'string' },
          { id: 'tags', type: 'string[]' },
          { id: 'count', type: 'number' },
          { id: 'scores', type: 'number[]' },
          { id: 'active', type: 'boolean', filterDropdown: true },
          { id: 'createdAt', type: 'time', filterDropdown: true },
          { id: 'custom', type: 'custom' as any },
        ]}
        faasData={{ action: 'table/list' }}
        pagination={{ pageSize: 5 }}
      />,
    )

    await waitFor(() => {
      expect(lastTableProps?.dataSource).toEqual([
        {
          id: 1,
          name: 'Alpha',
          tags: ['a'],
          count: 1,
          scores: [1],
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          custom: 'x',
        },
      ])
    })

    const columns = lastTableProps.columns as any[]

    expect(getColumn(columns, 'name').onFilter).toBeUndefined()
    expect(getColumn(columns, 'tags').onFilter).toBeUndefined()
    expect(getColumn(columns, 'count').onFilter).toBeUndefined()
    expect(getColumn(columns, 'scores').onFilter).toBeUndefined()
    expect(getColumn(columns, 'active').onFilter).toBeUndefined()
    expect(getColumn(columns, 'createdAt').onFilter).toBeUndefined()
    expect(getColumn(columns, 'custom').onFilter).toBeUndefined()
    expect(lastTableProps.pagination).toEqual({
      pageSize: 10,
      current: 1,
      total: 1,
    })
    expect(lastTableProps.loading).toBeUndefined()

    expect(() =>
      lastTableProps.onChange?.(
        { current: 2, pageSize: 10 },
        {},
        { field: 'name', order: 'ascend' },
        { action: 'paginate' },
      ),
    ).not.toThrow()
  })

  it('should cover numeric, time, object, and array edge branches', async () => {
    const customSorter = vi.fn(() => 0)

    render(
      <Table
        items={[
          { id: 'tags', type: 'string[]' },
          { id: 'count', type: 'number', sorter: customSorter, filterDropdown: false },
          {
            id: 'scores',
            type: 'number[]',
            filterDropdown: true,
          },
          {
            id: 'presetScores',
            type: 'number[]',
            filters: [{ text: 'preset', value: 1 }],
          },
          { id: 'createdAt', type: 'time', sorter: customSorter, filterDropdown: false },
          { id: 'meta', type: 'object', object: [{ id: 'key' }] },
          { id: 'metaList', type: 'object[]', object: [{ id: 'key' }] },
        ]}
        dataSource={[
          {
            id: 1,
            tags: [],
            count: 2,
            scores: [],
            presetScores: [1],
            createdAt: '2024-01-02T10:00:00.000Z',
            meta: { key: 'value' },
            metaList: [undefined],
          },
        ]}
      />,
    )

    const columns = await getColumns()
    const tagsColumn = getColumn(columns, 'tags')
    const scoresColumn = getColumn(columns, 'scores')
    const createdAtColumn = getColumn(columns, 'createdAt')

    expect(tagsColumn.onFilter(null, { tags: [] })).toBe(true)
    expect(scoresColumn.onFilter(null, { scores: [] })).toBe(true)
    expect(getColumn(columns, 'count').sorter).toBe(customSorter)
    expect(getColumn(columns, 'count').filterDropdown).toBe(false)
    expect(scoresColumn.filterDropdown).toBe(true)
    expect(getColumn(columns, 'presetScores').filters).toEqual([{ text: 'preset', value: 1 }])
    expect(createdAtColumn.sorter).toBe(customSorter)
    expect(createdAtColumn.filterDropdown).toBe(false)
    expect(getColumn(columns, 'meta').render({ key: 'value' })).toBeTruthy()
    expect(getColumn(columns, 'metaList').render([undefined])).toBeTruthy()
  })

  it('should reload paginated faas data without params and use default row keys', async () => {
    const reload = vi.fn()

    mockedFaasDataInjection = {
      data: {
        rows: [{ id: 1, status: 'online' }],
        options: {
          status: [{ label: 'Online', value: 'online' }],
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
        },
      },
      reload,
    }

    render(
      <Table
        items={[{ id: 'status', filterDropdown: false }]}
        faasData={{ action: 'table/list' }}
      />,
    )

    await waitFor(() => {
      expect(lastTableProps?.rowKey).toBe('id')
      expect(lastTableProps?.pagination).toEqual({
        current: 1,
        pageSize: 10,
        total: 1,
      })
    })

    lastTableProps.onChange?.(
      { current: 2, pageSize: 20 },
      { status: ['offline'] },
      { field: 'status', order: 'descend' },
      { action: 'paginate' },
    )

    expect(reload).toHaveBeenCalledWith({
      pagination: { current: 2, pageSize: 20 },
      filters: { status: ['offline'] },
      sorter: { field: 'status', order: 'descend' },
    })
    expect((lastTableProps.columns as any[])[0].filterDropdown).toBe(false)
  })
})
