import { useState } from 'react'
import { TableProvider } from './context'
import { mergeElements, type TableElements } from './elements'
import { Table } from './Table'
import type { TableColumn } from './columns'

export type createTableOptions = {
  elements?: Partial<TableElements>
  columns: TableColumn[]
  rows?: any[]
  /** @default 'id' */
  rowKey?: string
}

export function createTable(options: createTableOptions) {
  const [elements, setElements] = useState<TableElements>(
    mergeElements(options.elements)
  )
  const [columns, setColumns] = useState(options.columns)
  const [rows, setRows] = useState(options.rows)

  const TableHolder = (
    <TableProvider
      value={{
        elements,
        setElements,
        columns,
        setColumns,
        rows,
        setRows,
        rowKey: options.rowKey ?? 'id',
      }}
    >
      <Table />
    </TableProvider>
  )

  return {
    TableHolder,
  }
}
