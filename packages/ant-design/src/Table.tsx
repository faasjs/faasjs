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
  TablePaginationConfig
} from 'antd'
import dayjs from 'dayjs'
import {
  FaasItemProps, transferOptions, BaseItemProps
} from './data'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { isNil, upperFirst } from 'lodash'
import { FaasDataWrapper, FaasDataWrapperProps } from '@faasjs/react'
import { Blank } from './Blank'
import { useConfigContext } from './Config'
import {
  FilterValue, SorterResult, TableCurrentDataSource
} from 'antd/lib/table/interface'

export type TableItemProps<T = any> = {
  /** @deprecated use render */
  children?: JSX.Element | null
} & FaasItemProps & Omit<AntdTableColumnProps<T>, 'children'>

export type ExtendTableTypeProps = {
  children?: JSX.Element | null
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
  };
} & AntdTableProps<T>

function processValue (item: TableItemProps, value: any) {
  if (typeof value !== 'undefined' && value !== null ) {
    if (item.options ) {
      if (item.type.endsWith('[]'))
        return (value as any[]).map((v: any) => (item.options as {
          label: string
          value: any
        }[])
          .find(option => option.value === v)?.label
        || v)
      else if ([
        'string',
        'number',
        'boolean'
      ].includes(item.type))
        return (item.options as {
          label: string
          value: any
        }[])
          .find(option => option.value === value)?.label
        || value
    }

    let dayjsFormat = ''
    if (item.type === 'date') dayjsFormat = 'YYYY-MM-DD'
    else if (item.type === 'time') dayjsFormat = 'YYYY-MM-DD HH:mm:ss'

    // check unix timestamp
    if (['date', 'time'].includes(item.type)) {
      if (typeof value === 'number' && value.toString().length === 10)
        value = value * 1000
      value = dayjs(value).format(dayjsFormat)
    }
  }
  return value
}

export function Table<T = any, ExtendTypes = any> (props: TableProps<T, ExtendTypes>) {
  const [columns, setColumns] = useState<TableItemProps[]>()
  const config = useConfigContext()

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
        }))
      }

      if (item.render) continue
      if (item.children) delete item.children

      if (props.extendTypes && props.extendTypes[item.type]) {
        if (props.extendTypes[item.type].children) {
          item.render = (value: any, values: any) => cloneElement(
            props.extendTypes[item.type].children,
            {
              value,
              values
            }
          )
        } else if (props.extendTypes[item.type].render)
          item.render = props.extendTypes[item.type].render
        else
          throw Error(item.type + ' requires children or render')
        continue
      }

      switch (item.type) {
        case 'string[]':
          item.render = value => processValue(item, value).join(', ')
          if (!item.onFilter)
            item.onFilter = (value: any, row) => row[item.id].includes(value)
          break
        case 'number':
          item.render = value => processValue(item, value)
          if (!item.sorter)
            item.sorter = (a: any, b: any) => a[item.id] - b[item.id]
          if (!item.onFilter)
            item.onFilter = (value: any, row) => value === row[item.id]
          break
        case 'number[]':
          item.render = value => processValue(item, value).join(', ')
          if (!item.onFilter)
            item.onFilter = (value: any, row) => row[item.id].includes(value)
          break
        case 'boolean':
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
              <Radio.Button>{config.common.all}</Radio.Button>
              <Radio.Button value={ 'true' }><CheckOutlined style={ {
                color: '#52c41a',
                verticalAlign: 'middle'
              } } /></Radio.Button>
              <Radio.Button value={ 'false' }><CloseOutlined style={ {
                verticalAlign: 'middle',
                color: '#ff4d4f'
              } } /></Radio.Button>
              <Radio.Button value={ 'empty' }>{config.common.blank}</Radio.Button>
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
          item.render = value => processValue(item, value)
          if (!item.onFilter)
            item.onFilter = (value:any, row) => dayjs(row[item.id]).isSame(dayjs(value))
          break
        case 'time':
          item.render = value => processValue(item, value)
          if (!item.onFilter)
            item.onFilter = (value:any, row) => dayjs(row[item.id]).isSame(dayjs(value))
          break
        default:
          item.render = value => processValue(item, value)
          if (!item.onFilter)
            item.onFilter = (value: any, row) => value === row[item.id]
          break
      }
    }

    setColumns(props.items as TableItemProps[])
  }, [props.items])

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
    render= { ({
      data, params, reload
    }) => {
      if (!data)
        return <AntdTable
          { ...props }
          rowKey={ props.rowKey || 'id' }
          columns={ columns }
          dataSource={ [] }
        />

      if (Array.isArray(data))
        return <AntdTable
          { ...props }
          rowKey={ props.rowKey || 'id' }
          columns={ columns }
          dataSource={ data as any }
        />

      return <AntdTable
        { ...props }
        rowKey={ props.rowKey || 'id' }
        columns={ columns }
        dataSource={ (data as any).rows }
        pagination={ {
          ...props.pagination,
          ...(data as any).pagination
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
    } }
    { ...props.faasData }
  />
}
