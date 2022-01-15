import {
  useState, useEffect, cloneElement
} from 'react'
import {
  Table as AntdTable,
  TableProps as AntdTableProps,
  TableColumnProps as AntdTableColumnProps
} from 'antd'
import { FaasItemProps } from './data'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { upperFirst } from 'lodash'
import { BaseItemType } from '.'
import { FaasDataWrapper } from './FaasWrapper'

export type TableItemProps<T = any> = {
  options?: {
    label: string
    value?: T
  }[]
} & FaasItemProps & AntdTableColumnProps<T>

export type ExtendTableTypeProps = {
  children?: JSX.Element | null
  render?: (value: any, values: any) => JSX.Element | string | number | boolean | null
}

export type ExtendTableItemProps<T = any> = BaseItemType & AntdTableColumnProps<T>

export type TableProps<T = any, ExtendTypes = any> = {
  items: (TableItemProps | (ExtendTypes & BaseItemType))[]
  extendTypes?: {
    [key: string]: ExtendTableTypeProps
  }
  faasData?: {
    action: string
    params?: Record<string, any>
  }
} & AntdTableProps<T>

function processValue (item: TableItemProps, value: any) {
  if (item.options && typeof value !== 'undefined' && value !== null) {
    if (item.type.endsWith('[]'))
      return (value as any[]).map((v: any) => item.options
        .find(option => option.value === v)?.label
        || v)
    else
      return item.options
        .find(option => option.value === value)?.label
        || value
  }
  return value
}

export function Table<T = any, ExtendTypes = any> (props: TableProps<T, ExtendTypes>) {
  const [columns, setColumns] = useState<TableItemProps[]>()

  useEffect(() => {
    for (const item of props.items as TableItemProps[]) {
      if (!item.key) item.key = item.id
      if (!item.dataIndex) item.dataIndex = item.id
      if (!item.title) item.title = upperFirst(item.id)
      if (!item.type) item.type = 'string'

      if (item.render) continue
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
          break
        case 'number[]':
          item.render = value => processValue(item, value).join(', ')
          break
        case 'boolean':
          item.render = value => (value ? <CheckOutlined style={ {
            marginTop: '4px',
            color: '#52c41a'
          } } /> : <CloseOutlined style={ {
            marginTop: '4px',
            color: '#ff4d4f'
          } } />)
          break
        default:
          item.render = value => processValue(item, value)
          break
      }
    }

    setColumns(props.items as TableItemProps[])
  }, [props.items])

  if (!columns) return null

  return <FaasDataWrapper
    dataSource={ props.dataSource }
    faasData={ props.faasData }
    render={ ({ data }) => <AntdTable
      { ...props }
      rowKey={ props.rowKey || 'id' }
      columns={ columns }
      dataSource={ data }
    /> }
  />
}
