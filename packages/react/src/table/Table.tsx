import { useTable } from "./context"

export function Table() {
  const { elements, columns, rows, rowKey } = useTable()

  return (
    <elements.table>
      <elements.thead>
        <elements.tr>
          {columns.map((column) => <elements.th key={column.name}>{column.header ? <column.header column={column} /> : (column.label ?? column.name)}</elements.th>)}
        </elements.tr>
      </elements.thead>
      <elements.tbody>
        {rows?.map((row) => (
          <elements.tr key={row[rowKey]}>
            {columns.map((column) => <elements.td key={column.name}>{column.cell ? <column.cell column={column} /> : row[column.name]}</elements.td>)}
          </elements.tr>
        ))}
      </elements.tbody>
    </elements.table>
  )
}
