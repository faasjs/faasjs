import { Input, Select } from 'antd'

import { Blank } from '../Blank'
import { renderDisplayValue, transferOptions, transferValue } from '../data'
import type { TableItemProps } from './types'

/**
 * Normalized option shape used by table filter and render helpers.
 */
export type NormalizedTableOption = {
  /** Display label for the option. */
  label: string
  /** Underlying value associated with the option. */
  value: any
}

/**
 * Transfer and render a display value for a table cell.
 *
 * @param item - Column definition being rendered.
 * @param value - Raw cell value.
 * @returns Formatted React node.
 */
export function processValue(item: TableItemProps, value: any) {
  const itemType = item.type ?? 'string'
  const transferred = transferValue(itemType, value)

  return renderDisplayValue(itemType, transferred, item.options as any)
}

/**
 * Convert normalized options into Ant Design table filter entries.
 *
 * @param options - Normalized column options.
 * @param includeBlank - Whether to append a blank/null filter option.
 * @returns Array of filter entries compatible with Ant Design column `filters`.
 */
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

/**
 * Generate filter dropdown UI for a table column based on its options.
 *
 * Mutates the column item in place. Options with fewer than 11 entries use simple filters;
 * larger option sets use a searchable multi-select dropdown.
 *
 * @param item - Column definition to populate with filter UI.
 * @param search - Localized search placeholder text.
 */
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

/**
 * Create a text-search filter dropdown for a table column.
 *
 * @param item - Column definition providing the column title.
 * @param search - Localized search placeholder text.
 * @param transformValue - Optional value transformer applied to the search input before setting the filter key.
 * @returns An Ant Design filter dropdown render function.
 */
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

/**
 * Apply server-supplied options to table columns when using `faasData`.
 *
 * When the response includes an `options` map, matching columns receive option-driven
 * filters and renders automatically.
 *
 * @param columns - Current column definitions.
 * @param data - FaasJS response data object that may contain an `options` map.
 * @returns Updated column definitions, or the original array when no options are present.
 */
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
