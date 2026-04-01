import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useEqualEffect } from '@faasjs/react'
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
import { useCallback, useState } from 'react'

import { Blank } from './Blank'
import { useConfigContext } from './Config'
import type {
  BaseItemProps,
  FaasItemProps,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from './data'
import { transferOptions, transferValue } from './data'
import { Description } from './Description'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperProps,
} from './FaasDataWrapper'
import {
  getSceneChildren,
  getSceneRender,
  normalizeSceneItem,
  renderSceneNode,
  shouldRenderSceneItem,
  transferOptionLabels,
} from './itemHelpers'

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
  const transferred = transferOptionLabels(
    itemType,
    item.options as {
      label: string
      value: any
    }[],
    transferValue(itemType, value),
  )

  if (transferred === null || (Array.isArray(transferred) && transferred.length === 0))
    return <Blank />

  if (itemType.endsWith('[]')) return (transferred as any[]).join(', ')

  if (['date', 'time'].includes(itemType))
    return (transferred as dayjs.Dayjs).format(
      itemType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
    )

  return transferred
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
  const [columns, setColumns] = useState<TableItemProps[]>()
  const { theme } = useConfigContext()
  const { all, blank, search } = theme.common

  const generateFilterDropdown = useCallback(
    (item: TableItemProps) => {
      if (item.filterDropdown && item.filterDropdown !== true) return
      if (!item.options?.length) return

      if (item.options.length < 11) {
        if (!item.filters)
          item.filters = (
            item.options as {
              label: string
              value: any
            }[]
          ).map((o) => ({
            text: o.label,
            value: o.value,
          }))
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
            options={
              item.options as {
                label: string
                value: string
              }[]
            }
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

              return (
                option.value === input || option.label.toLowerCase().includes(input.toLowerCase())
              )
            }}
          />
        </div>
      )

      return item
    },
    [search],
  )

  useEqualEffect(() => {
    const items = (cloneDeep(props.items) as TableItemProps[]).filter((item) =>
      shouldRenderSceneItem(item, 'table'),
    )

    const createTextSearchFilterDropdown =
      (item: TableItemProps, transformValue?: (v: string) => any) =>
      ({
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

    for (const item of items) {
      if (!item.key) item.key = item.id
      if (!item.dataIndex) item.dataIndex = item.id
      normalizeSceneItem(item)

      const itemType = item.type ?? 'string'

      if (item.options?.length) {
        item.filters = (
          item.options as {
            label: string
            value: any
          }[]
        )
          .map((o) => ({
            text: o.label,
            value: o.value,
          }))
          .concat({
            text: (<Blank />) as any,
            value: null,
          })

        generateFilterDropdown(item)
      }

      const children = getSceneChildren(item, 'table')

      if (children) {
        const sceneItem = { ...item }

        item.render = (value: any, values: any) =>
          renderSceneNode({
            scene: 'table',
            item: sceneItem,
            value,
            values,
            index: 0,
          }).node

        delete item.children
        delete item.tableChildren

        continue
      }

      const render = getSceneRender(item, 'table')

      if (render) {
        item.render = (value: any, values: any) => render(value, values, 0, 'table')

        delete item.tableRender

        continue
      }

      const extendType = props.extendTypes?.[itemType]

      if (extendType) {
        const extendChildren = extendType.children

        if (extendChildren) {
          const sceneItem = { ...item }

          item.render = (value: any, values: any) =>
            renderSceneNode({
              scene: 'table',
              item: sceneItem,
              value,
              values,
              index: 0,
              extendType,
            }).node
        } else {
          const extendRender = extendType.render

          if (extendRender)
            item.render = (value: any, values: any) => extendRender(value, values, 0, 'table')
          else throw Error(`${itemType} requires children or render`)
        }
        continue
      }

      switch (itemType) {
        case 'string':
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
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
              item.filterDropdown = createTextSearchFilterDropdown(item)
          }
          break
        case 'string[]':
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
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
              item.filterDropdown = createTextSearchFilterDropdown(item)
          }
          break
        case 'number':
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // sorter
          if (typeof item.sorter === 'undefined')
            item.sorter = (a: any, b: any) => a[item.id] - b[item.id]

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
              item.onFilter = (value: any, row) => {
                if (value === null) return true
                if (isNil(row[item.id])) return false

                // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
                return value == row[item.id]
              }

            if (typeof item.filterDropdown === 'undefined' && !item.filters)
              item.filterDropdown = createTextSearchFilterDropdown(item, Number)
          }
          break
        case 'number[]':
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
              item.onFilter = (value: any, row) => {
                if (value === null && (!row[item.id] || !row[item.id].length)) return true

                if (!row[item.id] || !row[item.id].length) return false

                return row[item.id].includes(Number(value))
              }

            if (typeof item.filterDropdown === 'undefined' && !item.filters)
              item.filterDropdown = createTextSearchFilterDropdown(item, Number)
          }
          break
        case 'boolean':
          // render
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

          // filter
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
                    const Values: Record<string, any> = {
                      true: true,
                      false: false,
                      null: null,
                    }
                    setSelectedKeys(e.target.value ? [Values[e.target.value]] : [])
                    confirmFilter()
                  }}
                >
                  <Radio.Button>{all}</Radio.Button>
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
                  <Radio.Button value={'null'}>{blank}</Radio.Button>
                </Radio.Group>
              )

            if (!item.onFilter && !props.faasData)
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
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // sorter
          if (typeof item.sorter === 'undefined')
            item.sorter = (a, b, order) => {
              if (isNil(a[item.id])) return order === 'ascend' ? 1 : -1
              if (isNil(b[item.id])) return order === 'ascend' ? -1 : 1
              return new Date(a[item.id]).getTime() < new Date(b[item.id]).getTime() ? -1 : 1
            }

          // filter
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

            if (!item.onFilter && !props.faasData)
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
          // render
          if (!item.render)
            item.render = (value) => (
              <Description items={item.object || []} dataSource={value || {}} column={1} />
            )
          break
        case 'object[]':
          // render
          if (!item.render)
            item.render = (value: Record<string, any>[]) => (
              <>
                {value.map((v, i) => (
                  <Description
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
          // render
          if (!item.render) item.render = (value) => processValue(item, value)

          // filter
          if (item.filterDropdown !== false && !item.onFilter && !props.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null && isNil(row[item.id])) return true

              return value === row[item.id]
            }
          break
      }
    }

    setColumns(items as TableItemProps[])
  }, [all, blank, generateFilterDropdown, props.extendTypes, props.faasData, props.items, search])

  useEqualEffect(() => {
    if (!props.dataSource || !columns) return

    for (const column of columns) {
      if (column.optionsType === 'auto' && !column.options && !column.filters) {
        const options = uniqBy(props.dataSource, column.id).map((v: Record<string, any>) => ({
          label: v[column.id],
          value: v[column.id],
        }))
        if (options.length)
          setColumns((prev) => {
            const newColumns = [...(prev || [])]
            const index = newColumns.findIndex((item) => item.id === column.id)
            if (index < 0) return newColumns
            newColumns[index].options = options
            generateFilterDropdown(newColumns[index])
            return newColumns
          })
      }
    }
  }, [props.dataSource, columns, generateFilterDropdown])

  if (!columns) return null

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
  const [currentColumns, setCurrentColumns] = useState<TableItemProps[]>(columns)

  useEqualEffect(() => {
    if (!data || Array.isArray(data)) return

    setCurrentColumns((prev) => {
      const newColumns = [...prev]
      for (const column of newColumns) {
        if (data.options?.[column.id]) {
          column.options = transferOptions(data.options[column.id])
          column.filters = column.options
            .map((v: any) => ({
              text: v.label,
              value: v.value,
            }))
            .concat({
              text: <Blank />,
              value: null,
            })
          column.render = (value: any) => processValue(column, value)
          if (column.filterDropdown) delete column.filterDropdown
          continue
        }

        if (column.optionsType === 'auto' && !column.options && !column.filters) {
          const filters = uniqBy(props.dataSource, column.id).map((v: Record<string, any>) => ({
            text: v[column.id],
            value: v[column.id],
          }))
          if (filters.length)
            column.filters = filters.concat({
              text: <Blank />,
              value: null,
            })
        }
      }
      return newColumns
    })
  }, [data, props.dataSource])

  if (!data)
    return (
      <AntdTable
        {...props}
        {...(typeof loading === 'undefined' ? {} : { loading })}
        rowKey={props.rowKey || 'id'}
        columns={currentColumns as any[]}
        dataSource={[]}
      />
    )

  if (Array.isArray(data))
    return (
      <AntdTable
        {...props}
        {...(typeof loading === 'undefined' ? {} : { loading })}
        rowKey={props.rowKey || 'id'}
        columns={currentColumns as any[]}
        dataSource={data as any}
      />
    )

  return (
    <AntdTable
      {...props}
      {...(typeof loading === 'undefined' ? {} : { loading })}
      rowKey={props.rowKey || 'id'}
      columns={currentColumns as any[]}
      dataSource={(data as any).rows}
      pagination={
        props.pagination === false
          ? false
          : {
              ...(props.pagination || Object.create(null)),
              ...((data as any).pagination || Object.create(null)),
            }
      }
      onChange={(pagination, filters, sorter, extra) => {
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
      }}
    />
  )
}
