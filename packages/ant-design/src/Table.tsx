import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
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
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/es/table/interface'
import dayjs from 'dayjs'
import { cloneDeep, isNil, uniqBy } from 'lodash-es'
import { useEffect, useState } from 'react'
import { Blank } from './Blank'
import { useConfigContext } from './Config'
import { Description } from './Description'
import {
  type FaasDataInjection,
  FaasDataWrapper,
  type FaasDataWrapperProps,
} from './FaasDataWrapper'
import type {
  BaseItemProps,
  FaasItemProps,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from './data'
import {
  cloneUnionFaasItemElement,
  transferOptions,
  transferValue,
  upperFirst,
} from './data'

export interface TableItemProps<T = any>
  extends FaasItemProps,
    Omit<AntdTableColumnProps<T>, 'title' | 'children' | 'render'> {
  optionsType?: 'auto'
  children?: UnionFaasItemElement<T> | null
  tableChildren?: UnionFaasItemElement<T> | null
  render?: UnionFaasItemRender<T> | null
  tableRender?: UnionFaasItemRender<T> | null
  object?: TableItemProps<T>[]
}

export type ExtendTableTypeProps<T = any> = {
  children?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
}

export type ExtendTableItemProps<T = any> = BaseItemProps &
  Omit<AntdTableColumnProps<T>, 'children'>

export type TableProps<T = any, ExtendTypes = any> = {
  items: (TableItemProps | (ExtendTypes & ExtendTableItemProps))[]
  extendTypes?: {
    [key: string]: ExtendTableTypeProps
  }
  faasData?: FaasDataWrapperProps<T>
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>
  ) => {
    pagination: TablePaginationConfig
    filters: Record<string, FilterValue | null>
    sorter: SorterResult<T> | SorterResult<T>[]
    extra: TableCurrentDataSource<T>
  }
} & AntdTableProps<T>

function processValue(item: TableItemProps, value: any) {
  const transferred = transferValue(item.type, value)

  if (
    transferred === null ||
    (Array.isArray(transferred) && transferred.length === 0)
  )
    return <Blank />

  if (item.options) {
    if (item.type.endsWith('[]'))
      return (transferred as any[])
        .map(
          (v: any) =>
            (
              item.options as {
                label: string
                value: any
              }[]
            ).find(option => option.value === v)?.label || v
        )
        .join(', ')

    if (['string', 'number', 'boolean'].includes(item.type))
      return (
        (
          item.options as {
            label: string
            value: any
          }[]
        ).find(option => option.value === transferred)?.label || transferred
      )
  }

  if (item.type.endsWith('[]')) return transferred.join(', ')

  if (['date', 'time'].includes(item.type))
    return transferred.format(
      item.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
    )

  return value
}

/**
 * Table component with Ant Design & FaasJS
 *
 * - Based on [Ant Design Table](https://ant.design/components/table/).
 * - Support FaasJS injection.
 * - Auto generate filter dropdown (disable with `filterDropdown: false`).
 * - Auto generate sorter (disable with `sorter: false`).
 */
export function Table<T extends Record<string, any>, ExtendTypes = any>(
  props: TableProps<T, ExtendTypes>
) {
  const [columns, setColumns] = useState<TableItemProps[]>()
  const { theme } = useConfigContext()

  const generateFilterDropdown = (item: TableItemProps) => {
    if (item.filterDropdown && item.filterDropdown !== true) return

    if (item.options.length < 11) {
      if (!item.filters)
        item.filters = (
          item.options as {
            label: string
            value: any
          }[]
        ).map(o => ({
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
        onKeyDown={e => e.stopPropagation()}
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
          placeholder={`${theme.common.search} ${item.title}`}
          value={selectedKeys}
          onChange={v => {
            setSelectedKeys(v?.length ? v : [])
            confirm()
          }}
          mode='multiple'
          filterOption={(input, option) => {
            if (!input || !option || !option.label) return true

            input = input.trim()

            return (
              option.value === input ||
              option.label
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            )
          }}
        />
      </div>
    )

    return item
  }

  useEffect(() => {
    const items = (cloneDeep(props.items) as TableItemProps[]).filter(
      item =>
        !(
          item.tableChildren === null ||
          item.children === null ||
          item.tableRender === null ||
          item.render === null
        )
    )

    for (const item of items) {
      if (!item.key) item.key = item.id
      if (!item.dataIndex) item.dataIndex = item.id
      if (!item.title) item.title = upperFirst(item.id)
      if (!item.type) item.type = 'string'
      if (item.options?.length) {
        item.options = transferOptions(item.options)
        item.filters = (
          item.options as {
            label: string
            value: any
          }[]
        )
          .map(o => ({
            text: o.label,
            value: o.value,
          }))
          .concat({
            text: (<Blank />) as any,
            value: null,
          })

        generateFilterDropdown(item)
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
        item.render = (value: any, values: any) =>
          render(value, values, 0, 'table')

        delete item.tableRender

        continue
      }

      if (props.extendTypes?.[item.type]) {
        if (props.extendTypes[item.type].children) {
          item.render = (value: any, values: any) =>
            cloneUnionFaasItemElement(props.extendTypes[item.type].children, {
              scene: 'table',
              value,
              values,
              index: 0,
            })
        } else if (props.extendTypes[item.type].render)
          item.render = (value: any, values: any) =>
            props.extendTypes[item.type].render(value, values, 0, 'table')
        else throw Error(`${item.type} requires children or render`)
        continue
      }

      switch (item.type) {
        case 'string':
          // render
          if (!item.render) item.render = value => processValue(item, value)

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
              item.filterDropdown = ({
                setSelectedKeys,
                confirm,
                clearFilters,
              }) => (
                <Input.Search
                  placeholder={`${theme.common.search} ${item.title}`}
                  allowClear
                  onSearch={v => {
                    if (v) {
                      setSelectedKeys([v])
                    } else {
                      setSelectedKeys([])
                      clearFilters()
                    }
                    confirm()
                  }}
                />
              )
          }
          break
        case 'string[]':
          // render
          if (!item.render) item.render = value => processValue(item, value)

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
              item.onFilter = (value: any, row) => {
                if (value === null && (!row[item.id] || !row[item.id].length))
                  return true

                if (!row[item.id] || !row[item.id].length || !value)
                  return false

                return (row[item.id] as string[]).some(v =>
                  v.trim().toLowerCase().includes(value.trim().toLowerCase())
                )
              }

            if (
              typeof item.filterDropdown === 'undefined' &&
              !item.filters &&
              item.optionsType !== 'auto'
            )
              item.filterDropdown = ({
                setSelectedKeys,
                confirm,
                clearFilters,
              }) => (
                <Input.Search
                  placeholder={`${theme.common.search} ${item.title}`}
                  allowClear
                  onSearch={v => {
                    if (v) {
                      setSelectedKeys([v])
                    } else {
                      setSelectedKeys([])
                      clearFilters()
                    }
                    confirm()
                  }}
                />
              )
          }
          break
        case 'number':
          // render
          if (!item.render) item.render = value => processValue(item, value)

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
              item.filterDropdown = ({
                setSelectedKeys,
                confirm,
                clearFilters,
              }) => (
                <Input.Search
                  placeholder={`${theme.common.search} ${item.title}`}
                  allowClear
                  onSearch={v => {
                    if (v) {
                      setSelectedKeys([Number(v)])
                    } else {
                      setSelectedKeys([])
                      clearFilters()
                    }
                    confirm()
                  }}
                />
              )
          }
          break
        case 'number[]':
          // render
          if (!item.render)
            item.render = value => processValue(item, value).join(', ')

          // filter
          if (item.filterDropdown !== false) {
            if (!item.onFilter && !props.faasData)
              item.onFilter = (value: any, row) => {
                if (value === null && (!row[item.id] || !row[item.id].length))
                  return true

                if (!row[item.id] || !row[item.id].length) return false

                return row[item.id].includes(Number(value))
              }

            if (typeof item.filterDropdown === 'undefined' && !item.filters)
              item.filterDropdown = ({
                setSelectedKeys,
                confirm,
                clearFilters,
              }) => (
                <Input.Search
                  placeholder={`${theme.common.search} ${item.title}`}
                  allowClear
                  onSearch={v => {
                    if (v) {
                      setSelectedKeys([Number(v)])
                    } else {
                      setSelectedKeys([])
                      clearFilters()
                    }
                    confirm()
                  }}
                />
              )
          }
          break
        case 'boolean':
          // render
          if (!item.render)
            item.render = value =>
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
                confirm,
              }: {
                setSelectedKeys: (selectedKeys: React.Key[]) => void
                selectedKeys: React.Key[]
                confirm(): void
              }) => (
                <Radio.Group
                  style={{ padding: 8 }}
                  buttonStyle='solid'
                  value={JSON.stringify(selectedKeys[0])}
                  onChange={e => {
                    const Values: Record<string, any> = {
                      true: true,
                      false: false,
                      null: null,
                    }
                    setSelectedKeys(
                      e.target.value ? [Values[e.target.value]] : []
                    )
                    confirm()
                  }}
                >
                  <Radio.Button>{theme.common.all}</Radio.Button>
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
                  <Radio.Button value={'null'}>
                    {theme.common.blank}
                  </Radio.Button>
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
          // render
          if (!item.render) item.render = value => processValue(item, value)

          // sorter
          if (typeof item.sorter === 'undefined')
            item.sorter = (a, b, order) => {
              if (isNil(a[item.id])) return order === 'ascend' ? 1 : -1
              if (isNil(b[item.id])) return order === 'ascend' ? -1 : 1
              return new Date(a[item.id]).getTime() <
                new Date(b[item.id]).getTime()
                ? -1
                : 1
            }

          // filter
          if (item.filterDropdown !== false) {
            if (typeof item.filterDropdown === 'undefined')
              item.filterDropdown = ({ setSelectedKeys, confirm }) => (
                <DatePicker.RangePicker
                  onChange={dates => {
                    setSelectedKeys(
                      dates?.[0] && dates[1]
                        ? ([
                            [
                              dates[0].startOf('day').toISOString(),
                              dates[1].endOf('day').toISOString(),
                            ],
                          ] as any)
                        : []
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
                  dayjs(row[item.id]) >= dayjs(value[0]) &&
                  dayjs(row[item.id]) <= dayjs(value[1])
                )
              }
          }
          break
        case 'time':
          item.width = item.width ?? 200
          // render
          if (!item.render) item.render = value => processValue(item, value)

          // sorter
          if (typeof item.sorter === 'undefined')
            item.sorter = (a, b, order) => {
              if (isNil(a[item.id])) return order === 'ascend' ? 1 : -1
              if (isNil(b[item.id])) return order === 'ascend' ? -1 : 1
              return new Date(a[item.id]).getTime() <
                new Date(b[item.id]).getTime()
                ? -1
                : 1
            }

          // filter
          if (item.filterDropdown !== false) {
            if (typeof item.filterDropdown === 'undefined')
              item.filterDropdown = ({ setSelectedKeys, confirm }) => (
                <DatePicker.RangePicker
                  onChange={dates => {
                    setSelectedKeys(
                      dates?.[0] && dates[1]
                        ? ([
                            [
                              dates[0].startOf('day').toISOString(),
                              dates[1].endOf('day').toISOString(),
                            ],
                          ] as any)
                        : []
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
                  dayjs(row[item.id]) >= dayjs(value[0]) &&
                  dayjs(row[item.id]) <= dayjs(value[1])
                )
              }
          }
          break
        case 'object':
          // render
          if (!item.render)
            item.render = value => (
              <Description
                items={item.object}
                dataSource={value || {}}
                column={1}
              />
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
                    items={item.object}
                    dataSource={v || []}
                    column={1}
                  />
                ))}
              </>
            )
          break
        default:
          // render
          if (!item.render) item.render = value => processValue(item, value)

          // filter
          if (
            item.filterDropdown !== false &&
            !item.onFilter &&
            !props.faasData
          )
            item.onFilter = (value: any, row) => {
              if (value === null && isNil(row[item.id])) return true

              return value === row[item.id]
            }
          break
      }
    }

    setColumns(items as TableItemProps[])
  }, [props.items])

  useEffect(() => {
    if (!props.dataSource || !columns) return

    for (const column of columns) {
      if (column.optionsType === 'auto' && !column.options && !column.filters) {
        const options = uniqBy<any>(props.dataSource, column.id).map(v => ({
          label: v[column.id],
          value: v[column.id],
        }))
        if (options.length)
          setColumns(prev => {
            const newColumns = [...prev]
            const index = newColumns.findIndex(item => item.id === column.id)
            newColumns[index].options = options
            generateFilterDropdown(newColumns[index])
            return newColumns
          })
      }
    }
  }, [props.dataSource, columns])

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

  return (
    <FaasDataWrapper<T> {...props.faasData}>
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
  const [currentColumns, setCurrentColumns] =
    useState<TableItemProps[]>(columns)

  useEffect(() => {
    if (!data || Array.isArray(data)) return

    setCurrentColumns(prev => {
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

        if (
          column.optionsType === 'auto' &&
          !column.options &&
          !column.filters
        ) {
          const filters = uniqBy<any>(props.dataSource, column.id).map(v => ({
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
        loading={loading}
        rowKey={props.rowKey || 'id'}
        columns={currentColumns as any[]}
        dataSource={[]}
      />
    )

  if (Array.isArray(data))
    return (
      <AntdTable
        {...props}
        loading={loading}
        rowKey={props.rowKey || 'id'}
        columns={currentColumns as any[]}
        dataSource={data as any}
      />
    )

  return (
    <AntdTable
      {...props}
      loading={loading}
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
        if (props.onChange) {
          const processed = props.onChange(pagination, filters, sorter, extra)
          reload({
            ...(params || Object.create(null)),
            pagination: processed.pagination,
            filters: processed.filters,
            sorter: processed.sorter,
            extra: processed.extra,
          })
          return
        }
        reload({
          ...(params || Object.create(null)),
          pagination,
          filters,
          sorter,
        })
      }}
    />
  )
}

Table.whyDidYouRender = true
