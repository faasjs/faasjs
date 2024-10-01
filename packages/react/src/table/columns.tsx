import type { FC } from 'react'

export type TableColumn = {
  name: string
  label?: string
  header?: FC<{
    column: TableColumn
  }>
  cell?: FC<{
    column: TableColumn
  }>
}
