import { Input, Select } from 'antd'

import { Blank } from '../Blank'
import { renderDisplayValue, transferOptions, transferValue } from '../data'
import type { TableItemProps } from './types'

export type NormalizedTableOption = {
  label: string
  value: any
}

export function processValue(item: TableItemProps, value: any) {
  const itemType = item.type ?? 'string'
  const transferred = transferValue(itemType, value)

  return renderDisplayValue(itemType, transferred, item.options as any)
}

export function toTableFilters(
  options: NormalizedTableOption[],
  includeBlank = false,
): {
  text: React.ReactNode
  value: any
}[] {
  const filters: {
    text: React.ReactNode
    value: any
  }[] = options.map((option) => ({
    text: option.label,
    value: option.value,
  }))

  if (includeBlank) {
    filters.push({
      text: <Blank />,
      value: null,
    })
  }

  return filters
}

export function generateFilterDropdown(item: TableItemProps, search: string): void {
  if (item.filterDropdown && item.filterDropdown !== true) return
  if (!item.options?.length) return

  if (item.options.length < 11) {
    if (!item.filters) item.filters = toTableFilters(item.options as NormalizedTableOption[])
    return
  }

  item.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm }) => (
    <div
      style={{
        padding: 8,
        width: '200px',
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Select<React.Key[]>
        options={item.options as { label: string; value: string }[]}
        allowClear
        showSearch
        style={{ width: '100%' }}
        placeholder={`${search} ${item.title}`}
        value={selectedKeys}
        onChange={(v) => {
          setSelectedKeys(v?.length ? v : [])
          confirm()
        }}
        mode="multiple"
        filterOption={(input, option) => {
          if (!input || !option) return true
          if (typeof option.label !== 'string') return option.value === input

          input = input.trim()

          return option.value === input || option.label.toLowerCase().includes(input.toLowerCase())
        }}
      />
    </div>
  )
}

export function createTextSearchFilterDropdown(
  item: TableItemProps,
  search: string,
  transformValue?: (v: string) => any,
) {
  return ({
    setSelectedKeys,
    confirm,
    clearFilters,
  }: {
    setSelectedKeys: (selectedKeys: React.Key[]) => void
    confirm: () => void
    clearFilters?: () => void
  }) => (
    <Input.Search
      placeholder={`${search} ${item.title}`}
      allowClear
      onSearch={(v) => {
        if (v) {
          setSelectedKeys(transformValue ? [transformValue(v)] : [v])
        } else {
          setSelectedKeys([])
          clearFilters?.()
        }
        confirm()
      }}
    />
  )
}

export function applyFaasDataColumnOptions(
  columns: TableItemProps[],
  data: Record<string, any> | undefined,
): TableItemProps[] {
  if (!data?.options) return columns

  let updated = false

  const nextColumns = columns.map((column) => {
    if (!data.options?.[column.id]) return column

    updated = true

    const nextColumn = {
      ...column,
    } as TableItemProps

    nextColumn.options = transferOptions(data.options[column.id])
    nextColumn.filters = toTableFilters(nextColumn.options as NormalizedTableOption[], true)
    nextColumn.render = (value: any) => processValue(nextColumn, value)

    if (nextColumn.filterDropdown) delete nextColumn.filterDropdown

    return nextColumn
  })

  return updated ? nextColumns : columns
}
