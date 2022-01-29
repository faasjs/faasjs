/* eslint-disable react/prop-types */
import {
  useState, useEffect, cloneElement
} from 'react'
import {
  Table as AntdTable,
  TableProps as AntdTableProps,
  TableColumnProps as AntdTableColumnProps,
  Radio
} from 'antd'
import { FaasItemProps, transferOptions } from './data'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { isNil, upperFirst } from 'lodash'
import { BaseItemProps } from '.'
import { FaasDataWrapper, FaasDataWrapperProps } from './FaasDataWrapper'
import { Blank } from './Blank'

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
} & FaasDataWrapperProps<T> & AntdTableProps<T>

function processValue (item: TableItemProps, value: any) {
  if (item.options && typeof value !== 'undefined' && value !== null) {
    if (item.type.endsWith('[]'))
      return (value as any[]).map((v: any) => (item.options as {
        label: string
        value: any
      }[])
        .find(option => option.value === v)?.label
        || v)
    else
      return (item.options as {
        label: string
        value: any
      }[])
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
          if (!item.filterDropdown)
            item.filterDropdown = ({
              setSelectedKeys,
              selectedKeys,
              confirm
            }: {
              setSelectedKeys: (selectedKeys: React.Key[]) => void;
              selectedKeys: React.Key[];
              confirm(): void;
              clearFilters(): void;
            }) => <Radio.Group
              style={ { padding: 8 } }
              buttonStyle='solid'
              value={ selectedKeys[0] }
              onChange={ e => {
                setSelectedKeys(e.target.value ? [e.target.value] : [])
                confirm()
              } }
            >
              <Radio.Button>{navigator.language?.includes('CN') ? '全部' : 'All'}</Radio.Button>
              <Radio.Button value={ 'true' }><CheckOutlined style={ {
                color: '#52c41a',
                verticalAlign: 'middle'
              } } /></Radio.Button>
              <Radio.Button value={ 'false' }><CloseOutlined style={ {
                verticalAlign: 'middle',
                color: '#ff4d4f'
              } } /></Radio.Button>
              <Radio.Button value={ 'empty' }>{navigator.language?.includes('CN') ? '空' : 'Empty'}</Radio.Button>
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

  return <FaasDataWrapper<T>
    render={ ({ data }) => <AntdTable
      { ...props }
      rowKey={ props.rowKey || 'id' }
      columns={ columns }
      dataSource={ data as any }
    /> }
    { ...props }
  />
}
