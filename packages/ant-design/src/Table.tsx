/* eslint-disable react/prop-types */
import {
  useState, useEffect, cloneElement
} from 'react'
import {
  Table as AntdTable,
  TableProps as AntdTableProps,
  TableColumnProps as AntdTableColumnProps,
  Radio,
  Skeleton,
  TablePaginationConfig,
  Input,
} from 'antd'
import dayjs from 'dayjs'
import {
  FaasItemProps, transferOptions, BaseItemProps, transferValue
} from './data'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {
  isNil, uniqBy, upperFirst,
} from 'lodash-es'
import {
  FaasDataInjection, FaasDataWrapper, FaasDataWrapperProps
} from '@faasjs/react'
import { Blank } from './Blank'
import { useConfigContext } from './Config'
import {
  FilterValue, SorterResult, TableCurrentDataSource
} from 'antd/es/table/interface'
import { Description } from './Description'

export interface TableItemProps<T = any> extends FaasItemProps, Omit<AntdTableColumnProps<T>, 'title' | 'children'> {
  optionsType?: 'auto'
  children?: JSX.Element
  object?: TableItemProps[]
}

export type ExtendTableTypeProps = {
  children?: JSX.Element
  render?: (value: any, values: any, index: number) => JSX.Element | string | number | boolean | null
}

export type ExtendTableItemProps<T = any> = BaseItemProps & Omit<AntdTableColumnProps<T>, 'children'>

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
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>
  }
} & AntdTableProps<T>

function processValue (item: TableItemProps, value: any) {
  const transferred = transferValue(item.type, value)

  if (transferred === null || (Array.isArray(transferred) && transferred.length === 0))
    return <Blank />

  if (item.options) {
    if (item.type.endsWith('[]'))
      return (transferred as any[]).map((v: any) => (item.options as {
        label: string
        value: any
      }[])
        .find(option => option.value === v)?.label
        || v).join(', ')

    if ([
      'string',
      'number',
      'boolean'
    ].includes(item.type))
      return (item.options as {
        label: string
        value: any
      }[])
        .find(option => option.value === transferred)?.label
        || transferred
  }

  if (item.type.endsWith('[]'))
    return transferred.join(', ')

  if (['date', 'time'].includes(item.type))
    return transferred.format(item.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')

  return value
}

/**
 * Table component with Ant Design & FaasJS
 *
 * @ref https://ant.design/components/table/
 */
export function Table<T = any, ExtendTypes = any> (props: TableProps<T, ExtendTypes>) {
  const [columns, setColumns] = useState<TableItemProps[]>()
  const { common } = useConfigContext()

  useEffect(() => {
    for (const item of props.items as TableItemProps[]) {
      if (!item.key) item.key = item.id
      if (!item.dataIndex) item.dataIndex = item.id
      if (!item.title) item.title = upperFirst(item.id)
      if (!item.type) item.type = 'string'
      if (item.options?.length) {
        item.options = transferOptions(item.options)
        item.filters = (item.options as {
          label: string
          value: any
        }[]).map(o => ({
          text: o.label,
          value: o.value
        })).concat({
          text: <Blank /> as any,
          value: null,
        })
      }

      if (item.children)
        item.render = (value: any, values: any) => cloneElement(
          item.children,
          {
            value,
            values,
          }
        )

      if (props.extendTypes && props.extendTypes[item.type]) {
        if (props.extendTypes[item.type].children)
          item.render = (value: any, values: any) => cloneElement(
            props.extendTypes[item.type].children,
            {
              value,
              values
            }
          )
        else if (props.extendTypes[item.type].render)
          item.render = props.extendTypes[item.type].render
        else
          throw Error(item.type + ' requires children or render')
        continue
      }

      switch (item.type) {
        case 'string':
          if (!item.render)
            item.render = value => processValue(item, value)

          if (!item.onFilter)
            item.onFilter = (value: any, row) => {
              if (value === null && isNil(row[item.id])) return true

              if (!row[item.id]) return false

              return (row[item.id] as string).toLowerCase().includes(value.toLowerCase())
            }

          if (!item.filters && item.filterDropdown !== false && item.optionsType !== 'auto')
            item.filterDropdown = ({
              setSelectedKeys, confirm, clearFilters
            }) => <Input.Search
              placeholder={ `${common.search} ${item.title}` }
              allowClear
              onSearch={ v => {
                if (v) {
                  setSelectedKeys([v])
                } else {
                  setSelectedKeys([])
                  clearFilters()
                }
                confirm()
              } }
            />
          break
        case 'string[]':
          if (!item.render)
            item.render = value => processValue(item, value)
          if (!item.onFilter)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length) return false

              return (row[item.id] as string[]).some(v => v.toLowerCase().includes(value.toLowerCase()))
            }
          if (!item.filters && item.filterDropdown !== false)
            item.filterDropdown = ({
              setSelectedKeys, confirm, clearFilters
            }) => <Input.Search
              placeholder={ `${common.search} ${item.title}` }
              allowClear
              onSearch={ v => {
                if (v) {
                  setSelectedKeys([v])
                } else {
                  setSelectedKeys([])
                  clearFilters()
                }
                confirm()
              } }
            />
          break
        case 'number':
          if (!item.render)
            item.render = value => processValue(item, value)

          if (!item.sorter)
            item.sorter = (a: any, b: any) => a[item.id] - b[item.id]

          if (!item.onFilter)
            item.onFilter = (value: any, row) => {
              if (value === null && isNil(row[item.id])) return true

              return value == row[item.id]
            }

          if (!item.filters && item.filterDropdown !== false)
            item.filterDropdown = ({
              setSelectedKeys, confirm, clearFilters
            }) => <Input.Search
              placeholder={ `${common.search} ${item.title}` }
              allowClear
              onSearch={ v => {
                if (v) {
                  setSelectedKeys([Number(v)])
                } else {
                  setSelectedKeys([])
                  clearFilters()
                }
                confirm()
              } }
            />
          break
        case 'number[]':
          if (!item.render)
            item.render = value => processValue(item, value).join(', ')

          if (!item.onFilter)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length) return false

              return row[item.id].includes(Number(value))
            }

          if (!item.filters && item.filterDropdown !== false)
            item.filterDropdown = ({
              setSelectedKeys, confirm, clearFilters
            }) => <Input.Search
              placeholder={ `${common.search} ${item.title}` }
              allowClear
              onSearch={ v => {
                if (v) {
                  setSelectedKeys([Number(v)])
                } else {
                  setSelectedKeys([])
                  clearFilters()
                }
                confirm()
              } }
            />
          break
        case 'boolean':
          if (!item.render)
            item.render = value => (typeof value === 'undefined' ? <Blank /> : (value ?
              <CheckOutlined style={ {
                marginTop: '4px',
                color: '#52c41a'
              } } /> : <CloseOutlined style={ {
                marginTop: '4px',
                color: '#ff4d4f'
              } } />))

          if (item.filterDropdown !== false)
            item.filterDropdown = ({
              setSelectedKeys,
              selectedKeys,
              confirm
            }: {
              setSelectedKeys: (selectedKeys: React.Key[]) => void
              selectedKeys: React.Key[]
              confirm(): void
            }) => <Radio.Group
              style={ { padding: 8 } }
              buttonStyle='solid'
              value={ selectedKeys[0] }
              onChange={ e => {
                setSelectedKeys(e.target.value ? [e.target.value] : [])
                confirm()
              } }
            >
              <Radio.Button>{common.all}</Radio.Button>
              <Radio.Button value={ 'true' }><CheckOutlined style={ {
                color: '#52c41a',
                verticalAlign: 'middle'
              } } /></Radio.Button>
              <Radio.Button value={ 'false' }><CloseOutlined style={ {
                verticalAlign: 'middle',
                color: '#ff4d4f'
              } } /></Radio.Button>
              <Radio.Button value={ 'empty' }>{common.blank}</Radio.Button>
            </Radio.Group>

          if (!item.onFilter)
            item.onFilter = (value: string | number | boolean, row: any) => {
              switch (value) {
                case 'true':
                  return !isNil(row[item.id]) && !!row[item.id]
                case 'false':
                  return !isNil(row[item.id]) && !row[item.id]
                case 'empty':
                  return isNil(row[item.id])
                default:
                  return true
              }
            }
          break
        case 'date':
          if (!item.render)
            item.render = value => processValue(item, value)

          if (!item.onFilter)
            item.onFilter = (value: any, row) => dayjs(row[item.id]).isSame(dayjs(value))

          if (!item.sorter)
            item.sorter = (a: any, b: any) => (dayjs(a[item.id]).isBefore(b[item.id]) ? -1 : 1)

          break
        case 'time':
          if (!item.render)
            item.render = value => processValue(item, value)

          if (!item.onFilter)
            item.onFilter = (value:any, row) => dayjs(row[item.id]).isSame(dayjs(value))

          if (!item.sorter)
            item.sorter = (a: any, b: any) => (dayjs(a[item.id]).isBefore(b[item.id]) ? -1 : 1)

          break
        case 'object':
          if (!item.render)
            item.render = value => <Description
              items={ item.object }
              dataSource={ value || {} }
              column={ 1 }
            />
          break
        case 'object[]':
          if (!item.render)
            item.render = (value: Record<string, any>[]) => value.map((v, i) => <Description
              key={ i }
              items={ item.object }
              dataSource={ v || [] }
              column={ 1 }
            />)
          break
        default:
          if (!item.render)
            item.render = value => processValue(item, value)

          if (!item.onFilter)
            item.onFilter = (value: any, row) => {
              if (value === null && isNil(row[item.id])) return true

              return value === row[item.id]
            }
          break
      }
    }

    setColumns(props.items as TableItemProps[])
  }, [props.items])

  useEffect(() => {
    if (!props.dataSource || !columns) return

    for (const column of columns) {
      if (column.optionsType === 'auto' && !column.options && !column.filters) {
        const filters = uniqBy<any>(props.dataSource, column.id).map(v => ({
          text: v[column.id],
          value: v[column.id],
        }))
        if (filters.length)
          setColumns(prev => {
            const newColumns = [...prev]
            const index = newColumns.findIndex(item => item.id === column.id)
            newColumns[index].filters = filters.concat({
              text: <Blank />,
              value: null,
            })
            return newColumns
          })
      }
    }
  }, [props.dataSource, columns])

  if (!columns) return null

  if (!props.faasData)
    return <AntdTable
      { ...props }
      rowKey={ props.rowKey || 'id' }
      columns={ columns }
      dataSource={ props.dataSource }
    />

  return <FaasDataWrapper<T>
    fallback={ props.faasData.fallback || <Skeleton active /> }
    { ...props.faasData }
  >
    <FaasDataTable
      props={ props }
      columns={ columns }
    />
  </FaasDataWrapper>
}

function FaasDataTable ({
  props,
  columns,
  data,
  params,
  reload,
}: Partial<FaasDataInjection> & {
  props: TableProps
  columns: TableItemProps[]
}) {
  const [currentColumns, setCurrentColumns] = useState(columns)

  useEffect(() => {
    if (!data || Array.isArray(data)) return

    setCurrentColumns(prev => {
      const newColumns = [...prev]
      for (const column of newColumns) {
        if (data['options'] && data.options[column.id]) {
          column.options = data['options'][column.id]
          column.filters = data['options'][column.id].map((v: any) => ({
            text: v.label,
            value: v.value,
          })).concat({
            text: <Blank />,
            value: null,
          })
          column.render = (value: any) => processValue(column, value)
          if (column.filterDropdown)
            delete column.filterDropdown
          continue
        }

        if (column.optionsType === 'auto' && !column.options && !column.filters) {
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
  }, [columns, data])

  if (!data)
    return <AntdTable
      { ...props }
      rowKey={ props.rowKey || 'id' }
      columns={ currentColumns }
      dataSource={ [] }
    />

  if (Array.isArray(data))
    return <AntdTable
      { ...props }
      rowKey={ props.rowKey || 'id' }
      columns={ currentColumns }
      dataSource={ data as any }
    />

  return <AntdTable
    { ...props }
    rowKey={ props.rowKey || 'id' }
    columns={ currentColumns }
    dataSource={ (data as any).rows }
    pagination={ {
      ...props.pagination,
      ...(data as any).pagination,
    } }
    onChange={ (pagination, filters, sorter, extra) => {
      if (props.onChange) {
        const processed = props.onChange(pagination, filters, sorter, extra)
        reload({
          ...params,
          pagination: processed.pagination,
          filters: processed.filters,
          sorter: processed.sorter,
        })
        return
      }
      reload({
        ...params,
        pagination,
        filters,
        sorter,
      })
    } }
  />
}
