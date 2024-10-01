import type { Dispatch, SetStateAction } from 'react'
import { createSplittingContext } from '../splittingContext'
import type { TableElements } from './elements'
import type { TableColumn } from './columns'

const context = createSplittingContext<{
  elements: TableElements
  setElements: Dispatch<SetStateAction<TableElements>>
  columns: TableColumn[]
  setColumns: Dispatch<SetStateAction<TableColumn[]>>
  rows: any[]
  setRows: Dispatch<SetStateAction<any[]>>
  rowKey: string
}>({
  elements: null,
  setElements: null,
  columns: null,
  setColumns: null,
  rows: null,
  setRows: null,
  rowKey: null,
})

export const TableProvider = context.Provider
export const useTable = context.use
