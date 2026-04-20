import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useEqualMemo } from '@faasjs/react'
import {
  Table as AntdTable,
  type TableColumnProps as AntdTableColumnProps,
  type TableProps as AntdTableProps,
  DatePicker,
  Input,
  Radio,
  Select,
  type TablePaginationConfig,
} from 'antd'
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import { cloneDeep, isNil, uniqBy } from 'lodash-es'

import { Blank } from './Blank'
import { type ResolvedTheme, useConfigContext } from './Config'
import type {
  BaseItemProps,
  FaasItemProps,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from './data'
import { cloneUnionFaasItemElement, idToTitle, transferOptions, transferValue } from './data'
import { Description } from './Description'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperProps,
} from './FaasDataWrapper'

/**
 * Column definition used by the FaasJS Ant Design {@link Table} component.
 *
 * @template T - Row record type rendered by the table.
 */
export interface TableItemProps<T = any>
  extends FaasItemProps, Omit<AntdTableColumnProps<T>, 'title' | 'children' | 'render'> {
  /** Use built-in option inference for filters when supported. */
  optionsType?: 'auto'
  /** Generic custom element rendered when no table-specific child overrides it. */
  children?: UnionFaasItemElement<T> | null
  /** Table-specific custom element. */
  tableChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Table-specific custom render callback. */
  tableRender?: UnionFaasItemRender<T> | null
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: TableItemProps<T>[]
}

/**
 * Custom renderer registration for a table item type.
 *
 * @template T - Row record type rendered by the custom table item type.
 */
export type ExtendTableTypeProps<T = any> = {
  /** Custom element used to render the registered table item type. */
  children?: UnionFaasItemElement<T>
  /** Custom render callback used when `children` is not provided. */
  render?: UnionFaasItemRender<T>
}

/**
 * Shared fields for extending table item unions.
 *
 * @template T - Row record type rendered by the table.
 */
export type ExtendTableItemProps<T = any> = BaseItemProps &
  Omit<AntdTableColumnProps<T>, 'children'>

/**
 * Props for the FaasJS Ant Design {@link Table} component.
 *
 * @template T - Row record type rendered by the table.
 * @template ExtendTypes - Additional item prop shape accepted by `items`.
 */
export type TableProps<T = any, ExtendTypes = any> = {
  /** Column definitions rendered by the table. */
  items: (TableItemProps | (ExtendTypes & ExtendTableItemProps))[]
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendTableTypeProps
  }
  /** Request config used to fetch table data before rendering. */
  faasData?: FaasDataWrapperProps<any>
  /** Change handler that can return rewritten pagination, filter, and sorter state. */
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => {
    pagination: TablePaginationConfig
    filters: Record<string, FilterValue | null>
    sorter: SorterResult<T> | SorterResult<T>[]
    extra: TableCurrentDataSource<T>
  }
} & AntdTableProps<T>

/**
 * Query params shape expected by table-backed FaasJS endpoints.
 */
export type TableFaasDataParams = {
  /** Active filter values keyed by column field. */
  filters?: Record<string, any[]>
  /** Pagination state sent to the endpoint. */
  pagination?: {
    /** Current page number. */
    current?: number
    /** Requested page size. */
    pageSize?: number
  }
  /** Sorter state sent to the endpoint. */
  sorter?:
    | {
        /** Column field being sorted. */
        field: string
        /** Sort direction. */
        order: 'ascend' | 'descend'
      }
    | {
        /** Column field being sorted. */
        field: string
        /** Sort direction when active. */
        order?: 'ascend' | 'descend'
      }[]
}

/**
 * Paginated response shape expected by {@link Table} when using `faasData`.
 *
 * @template T - Row record type contained in `rows`.
 */
export type TableFaasDataResponse<T = any> = {
  /** Rows rendered by the table. */
  rows: T[]
  /** Pagination state returned by the endpoint. */
  pagination: {
    /** Current page number. */
    current: number
    /** Page size used for the result set. */
    pageSize: number
    /** Total number of available rows. */
    total: number
  }
}

function processValue(item: TableItemProps, value: any) {
  const itemType = item.type ?? 'string'
  const transferred = transferValue(itemType, value)

  if (transferred === null || (Array.isArray(transferred) && transferred.length === 0))
    return <Blank />

  if (item.options) {
    if (itemType.endsWith('[]'))
      return (transferred as any[])
        .map(
          (v: any) =>
            (
              item.options as {
                label: string
                value: any
              }[]
            ).find((option) => option.value === v)?.label || v,
        )
        .join(', ')

    if (['string', 'number', 'boolean'].includes(itemType))
      return (
        (
          item.options as {
            label: string
            value: any
          }[]
        ).find((option) => option.value === transferred)?.label || transferred
      )
  }

  if (itemType.endsWith('[]')) return (transferred as any[]).join(', ')

  if (['date', 'time'].includes(itemType))
    return (transferred as dayjs.Dayjs).format(
      itemType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
    )

  return transferred
}

type NormalizedTableOption = {
  label: string
  value: any
}

function toTableFilters(
  options: NormalizedTableOption[],
  includeBlank = false,
): {
  text: React.ReactNode
  value: any
}[] {
  const filters: {
    text: React.ReactNode
    value: any
  }[] = options.map((option) => ({
    text: option.label,
    value: option.value,
  }))

  if (includeBlank) {
    filters.push({
      text: <Blank />,
      value: null,
    })
  }

  return filters
}

function generateFilterDropdown(item: TableItemProps, search: string): void {
  if (item.filterDropdown && item.filterDropdown !== true) return
  if (!item.options?.length) return

  if (item.options.length < 11) {
    if (!item.filters) item.filters = toTableFilters(item.options as NormalizedTableOption[])
    return
  }

  item.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm }) => (
    <div
      style={{
        padding: 8,
        width: '200px',
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Select<React.Key[]>
        options={item.options as { label: string; value: string }[]}
        allowClear
        showSearch
        style={{ width: '100%' }}
        placeholder={`${search} ${item.title}`}
        value={selectedKeys}
        onChange={(v) => {
          setSelectedKeys(v?.length ? v : [])
          confirm()
        }}
        mode="multiple"
        filterOption={(input, option) => {
          if (!input || !option) return true
          if (typeof option.label !== 'string') return option.value === input

          input = input.trim()

          return option.value === input || option.label.toLowerCase().includes(input.toLowerCase())
        }}
      />
    </div>
  )
}

function createTextSearchFilterDropdown(
  item: TableItemProps,
  search: string,
  transformValue?: (v: string) => any,
) {
  return ({
    setSelectedKeys,
    confirm,
    clearFilters,
  }: {
    setSelectedKeys: (selectedKeys: React.Key[]) => void
    confirm: () => void
    clearFilters?: () => void
  }) => (
    <Input.Search
      placeholder={`${search} ${item.title}`}
      allowClear
      onSearch={(v) => {
        if (v) {
          setSelectedKeys(transformValue ? [transformValue(v)] : [v])
        } else {
          setSelectedKeys([])
          clearFilters?.()
        }
        confirm()
      }}
    />
  )
}

function createTableColumns(
  items: TableItemProps[],
  options: {
    all: ResolvedTheme['common']['all']
    blank: ResolvedTheme['common']['blank']
    search: ResolvedTheme['common']['search']
    extendTypes?: Record<string, ExtendTableTypeProps>
    faasData?: FaasDataWrapperProps<any>
    dataSource?: Record<string, any>[]
  },
): TableItemProps[] {
  const columns = cloneDeep(items).filter(
    (item) =>
      !(
        item.tableChildren === null ||
        item.children === null ||
        item.tableRender === null ||
        item.render === null
      ),
  )

  for (const item of columns) {
    if (!item.key) item.key = item.id
    if (!item.dataIndex) item.dataIndex = item.id
    const itemType = item.type ?? 'string'

    item.title = item.title ?? idToTitle(item.id)
    item.type = itemType

    if (item.options?.length) {
      item.options = transferOptions(item.options)
      item.filters = toTableFilters(item.options as NormalizedTableOption[], true)
      generateFilterDropdown(item, options.search)
    }

    const children = item.tableChildren || item.children

    if (children) {
      item.render = (value: any, values: any) =>
        cloneUnionFaasItemElement(children, {
          scene: 'table',
          value,
          values,
          index: 0,
        })

      delete item.children
      delete item.tableChildren

      continue
    }

    const render = item.tableRender || item.render

    if (render) {
      item.render = (value: any, values: any) => render(value, values, 0, 'table')

      delete item.tableRender

      continue
    }

    const extendType = options.extendTypes?.[itemType]

    if (extendType) {
      const extendChildren = extendType.children

      if (extendChildren) {
        item.render = (value: any, values: any) =>
          cloneUnionFaasItemElement(extendChildren, {
            scene: 'table',
            value,
            values,
            index: 0,
          })
      } else {
        const extendRender = extendType.render

        if (extendRender) {
          item.render = (value: any, values: any) => extendRender(value, values, 0, 'table')
        } else throw Error(`${itemType} requires children or render`)
      }

      continue
    }

    switch (itemType) {
      case 'string':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (!value || isNil(value)) return true

              if (isNil(row[item.id])) return false

              return (row[item.id] as string)
                .trim()
                .toLowerCase()
                .includes(value.trim().toLowerCase())
            }

          if (
            typeof item.filterDropdown === 'undefined' &&
            !item.filters &&
            item.optionsType !== 'auto'
          )
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search)
        }
        break
      case 'string[]':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length || !value) return false

              return (row[item.id] as string[]).some((v) =>
                v.trim().toLowerCase().includes(value.trim().toLowerCase()),
              )
            }

          if (
            typeof item.filterDropdown === 'undefined' &&
            !item.filters &&
            item.optionsType !== 'auto'
          )
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search)
        }
        break
      case 'number':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (typeof item.sorter === 'undefined')
          item.sorter = (a: any, b: any) => a[item.id] - b[item.id]

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null) return true
              if (isNil(row[item.id])) return false

              // biome-ignore lint/suspicious/noDoubleEquals: Ant Design may pass numeric filter values as strings.
              return value == row[item.id]
            }

          if (typeof item.filterDropdown === 'undefined' && !item.filters)
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search, Number)
        }
        break
      case 'number[]':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length) return false

              return row[item.id].includes(Number(value))
            }

          if (typeof item.filterDropdown === 'undefined' && !item.filters)
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search, Number)
        }
        break
      case 'boolean':
        if (!item.render)
          item.render = (value) =>
            isNil(value) ? (
              <Blank />
            ) : value ? (
              <CheckOutlined
                style={{
                  marginTop: '4px',
                  color: '#52c41a',
                }}
              />
            ) : (
              <CloseOutlined
                style={{
                  marginTop: '4px',
                  color: '#ff4d4f',
                }}
              />
            )

        if (item.filterDropdown !== false) {
          if (typeof item.filterDropdown === 'undefined')
            item.filterDropdown = ({
              setSelectedKeys,
              selectedKeys,
              confirm: confirmFilter,
            }: {
              setSelectedKeys: (selectedKeys: React.Key[]) => void
              selectedKeys: React.Key[]
              confirm: () => void
            }) => (
              <Radio.Group
                style={{ padding: 8 }}
                buttonStyle="solid"
                value={JSON.stringify(selectedKeys[0])}
                onChange={(e) => {
                  const values: Record<string, any> = {
                    true: true,
                    false: false,
                    null: null,
                  }
                  setSelectedKeys(e.target.value ? [values[e.target.value]] : [])
                  confirmFilter()
                }}
              >
                <Radio.Button>{options.all}</Radio.Button>
                <Radio.Button value={'true'}>
                  <CheckOutlined
                    style={{
                      color: '#52c41a',
                      verticalAlign: 'middle',
                    }}
                  />
                </Radio.Button>
                <Radio.Button value={'false'}>
                  <CloseOutlined
                    style={{
                      verticalAlign: 'middle',
                      color: '#ff4d4f',
                    }}
                  />
                </Radio.Button>
                <Radio.Button value={'null'}>{options.blank}</Radio.Button>
              </Radio.Group>
            )

          if (!item.onFilter && !options.faasData)
            item.onFilter = (value, row) => {
              switch (value) {
                case true:
                  return !isNil(row[item.id]) && row[item.id] !== false
                case false:
                  return !isNil(row[item.id]) && !row[item.id]
                default:
                  return isNil(row[item.id])
              }
            }
        }
        break
      case 'date':
      case 'time':
        if (itemType === 'time') item.width = item.width ?? 200
        if (!item.render) item.render = (value) => processValue(item, value)

        if (typeof item.sorter === 'undefined')
          item.sorter = (a, b, order) => {
            if (isNil(a[item.id])) return order === 'ascend' ? 1 : -1
            if (isNil(b[item.id])) return order === 'ascend' ? -1 : 1
            return new Date(a[item.id]).getTime() < new Date(b[item.id]).getTime() ? -1 : 1
          }

        if (item.filterDropdown !== false) {
          if (typeof item.filterDropdown === 'undefined')
            item.filterDropdown = ({ setSelectedKeys, confirm }) => (
              <DatePicker.RangePicker
                onChange={(dates) => {
                  const start = dates?.[0]
                  const end = dates?.[1]

                  setSelectedKeys(
                    start && end
                      ? ([
                          [start.startOf('day').toISOString(), end.endOf('day').toISOString()],
                        ] as any)
                      : [],
                  )
                  confirm()
                }}
              />
            )

          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (isNil(value[0])) return true
              if (isNil(row[item.id])) return false

              return (
                dayjs(row[item.id]) >= dayjs(value[0]) && dayjs(row[item.id]) <= dayjs(value[1])
              )
            }
        }
        break
      case 'object':
        if (!item.render)
          item.render = (value) => (
            <Description items={item.object || []} dataSource={value || {}} column={1} />
          )
        break
      case 'object[]':
        if (!item.render)
          item.render = (value: Record<string, any>[]) => (
            <>
              {value.map((v, i) => (
                <Description
                  // biome-ignore lint/suspicious/noArrayIndexKey: Nested records do not expose stable ids for these read-only rows.
                  key={i}
                  items={item.object || []}
                  dataSource={v || []}
                  column={1}
                />
              ))}
            </>
          )
        break
      default:
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false && !item.onFilter && !options.faasData)
          item.onFilter = (value: any, row) => {
            if (value === null && isNil(row[item.id])) return true

            return value === row[item.id]
          }
        break
    }
  }

  if (options.dataSource) {
    for (const column of columns) {
      if (column.optionsType === 'auto' && !column.options && !column.filters) {
        const normalizedOptions = uniqBy(options.dataSource, column.id).map(
          (value: Record<string, any>) => ({
            label: value[column.id],
            value: value[column.id],
          }),
        )

        if (!normalizedOptions.length) continue

        column.options = normalizedOptions
        generateFilterDropdown(column, options.search)
      }
    }
  }

  return columns
}

function applyFaasDataColumnOptions(
  columns: TableItemProps[],
  data: Record<string, any> | undefined,
): TableItemProps[] {
  if (!data?.options) return columns

  let updated = false

  const nextColumns = columns.map((column) => {
    if (!data.options?.[column.id]) return column

    updated = true

    const nextColumn = {
      ...column,
    } as TableItemProps

    nextColumn.options = transferOptions(data.options[column.id])
    nextColumn.filters = toTableFilters(nextColumn.options as NormalizedTableOption[], true)
    nextColumn.render = (value: any) => processValue(nextColumn, value)

    if (nextColumn.filterDropdown) delete nextColumn.filterDropdown

    return nextColumn
  })

  return updated ? nextColumns : columns
}

/**
 * Render an Ant Design table from FaasJS item metadata.
 *
 * The component can render local `dataSource` rows or resolve remote rows through `faasData`. It
 * also generates default filters and sorters for built-in item types unless you disable them with
 * the corresponding Ant Design column props.
 *
 * @template T - Row record type rendered by the table.
 * @template ExtendTypes - Additional item prop shape accepted by `items`.
 * @param {TableProps<T, ExtendTypes>} props - Table props including columns, data source, and optional Faas data config.
 * @throws {Error} When an entry in `extendTypes` omits both `children` and `render`.
 *
 * @example
 * ```tsx
 * import { Table } from '@faasjs/ant-design'
 *
 * const rows = [
 *   { id: 1, name: 'Alice', active: true },
 *   { id: 2, name: 'Bob', active: false },
 * ]
 *
 * export function UserTable() {
 *   return (
 *     <Table
 *       rowKey="id"
 *       dataSource={rows}
 *       items={[
 *         { id: 'name', title: 'Name' },
 *         { id: 'active', type: 'boolean', title: 'Active' },
 *       ]}
 *     />
 *   )
 * }
 * ```
 */
export function Table<T extends Record<string, any>, ExtendTypes = any>(
  props: TableProps<T, ExtendTypes>,
) {
  const { theme } = useConfigContext()
  const { all, blank, search } = theme.common
  const columns = useEqualMemo(
    () =>
      createTableColumns(props.items as TableItemProps[], {
        all,
        blank,
        search,
        ...(props.extendTypes
          ? {
              extendTypes: props.extendTypes as Record<string, ExtendTableTypeProps>,
            }
          : {}),
        ...(props.faasData
          ? {
              faasData: props.faasData,
            }
          : {}),
        ...(props.dataSource
          ? {
              dataSource: props.dataSource as Record<string, any>[],
            }
          : {}),
      }),
    [all, blank, props.dataSource, props.extendTypes, props.faasData, props.items, search],
  )

  if (props.dataSource)
    return (
      <AntdTable
        {...props}
        rowKey={props.rowKey || 'id'}
        columns={columns as any[]}
        dataSource={props.dataSource}
      />
    )

  if (!props.faasData) return <FaasDataTable props={props} columns={columns} />

  return (
    <FaasDataWrapper<any> {...props.faasData}>
      <FaasDataTable props={props} columns={columns} />
    </FaasDataWrapper>
  )
}

function FaasDataTable({
  props,
  columns,
  data,
  params,
  reload,
  loading,
}: Partial<FaasDataInjection> & {
  props: TableProps
  columns: TableItemProps[]
}) {
  const currentColumns = useEqualMemo(
    () =>
      !data || Array.isArray(data)
        ? columns
        : applyFaasDataColumnOptions(columns, data as Record<string, any>),
    [columns, data],
  )

  const tableDataSource = !data ? [] : Array.isArray(data) ? (data as any) : (data as any).rows

  return (
    <AntdTable
      {...props}
      {...(typeof loading === 'undefined' ? {} : { loading })}
      {...(!data || Array.isArray(data)
        ? {}
        : {
            pagination:
              props.pagination === false
                ? false
                : {
                    ...(props.pagination || Object.create(null)),
                    ...((data as any).pagination || Object.create(null)),
                  },
            onChange: (
              pagination: TablePaginationConfig,
              filters: Record<string, FilterValue | null>,
              sorter: SorterResult<any> | SorterResult<any>[],
              extra: TableCurrentDataSource<any>,
            ) => {
              if (!reload) return

              if (props.onChange) {
                const processed = props.onChange(pagination, filters, sorter, extra)
                void reload({
                  ...(params || Object.create(null)),
                  pagination: processed.pagination,
                  filters: processed.filters,
                  sorter: processed.sorter,
                  extra: processed.extra,
                })
                return
              }

              void reload({
                ...(params || Object.create(null)),
                pagination,
                filters,
                sorter,
              })
            },
          })}
      rowKey={props.rowKey || 'id'}
      columns={currentColumns as any[]}
      dataSource={tableDataSource}
    />
  )
}
