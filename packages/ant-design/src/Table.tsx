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

export type TableItemProps<T = any> = FaasItemProps & AntdTableColumnProps<T>

export type ExtendTableItemProps = {
  [type: string]: {
    children: JSX.Element | null
  }
}

export type TableProps<T = any, ExtendTypes = any> = AntdTableProps<T> & {
  items: (TableItemProps | ExtendTypes)[]
  extendTypes?: ExtendTableItemProps
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
        item.render = (value: any, values: any) => cloneElement(
          props.extendTypes[item.type].children,
          {
            value,
            values 
          }
        )
        continue
      }

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

    setColumns(props.items as TableItemProps[])
  }, [props.items])

  if (!columns) return null

  return <AntdTable
    { ...props }
    rowKey={ props.rowKey || 'id' }
    columns={ columns }
  />
}
