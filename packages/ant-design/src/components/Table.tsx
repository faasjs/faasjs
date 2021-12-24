import { useState, useEffect } from 'react'
import {
  Table as AntdTable,
  TableProps as AntdTableProps,
  TableColumnProps as AntdTableColumnProps
} from 'antd'
import { FaasItemProps } from './data'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { upperFirst } from 'lodash'

export type TableItemProps<T = any> = FaasItemProps & AntdTableColumnProps<T>

export type TableProps<T = any> = AntdTableProps<T> & {
  items: TableItemProps[]
}

export function Table (props: TableProps) {
  const [columns, setColumns] = useState<TableItemProps[]>()

  useEffect(() => {
    for (const item of props.items) {
      if (!item.key) item.key = item.id
      if (!item.dataIndex) item.dataIndex = item.id
      if (!item.title) item.title = upperFirst(item.id)
      if (!item.type) item.type = 'string'

      if (item.render) continue

      switch (item.type) {
        case 'string[]':
          item.render = value => value.join(', ')
          break
        case 'number[]':
          item.render = value => value.join(', ')
          break
        case 'boolean':
          item.render = value => (value ? <CheckOutlined style={ { marginTop: '4px' } } /> : <CloseOutlined style={ { marginTop: '4px' } } />)
          break
      }
    }

    setColumns(props.items)
  }, [props.items])

  if (!columns) return null

  return <AntdTable
    { ...props }
    rowKey={ props.rowKey || 'id' }
    columns={ columns }
  />
}
