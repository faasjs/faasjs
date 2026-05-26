import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { DatePicker, Radio } from 'antd'
import dayjs from 'dayjs'
import { cloneDeep, isNil, uniqBy } from 'lodash-es'

import type { ResolvedTheme } from '../Config'
import { cloneUnionFaasItemElement, idToTitle, renderDisplayValue, transferOptions } from '../data'
import { Description } from '../Description'
import type { FaasDataWrapperProps } from '../FaasDataWrapper'
import type { ExtendTableTypeProps, TableItemProps } from './types'
import {
  processValue,
  toTableFilters,
  generateFilterDropdown,
  createTextSearchFilterDropdown,
  type NormalizedTableOption,
} from './utils'

/**
 * Build Ant Design table column definitions from FaasJS item metadata.
 *
 * The function applies default titles, data indices, renderers, sorters, and filter dropdowns
 * for each built-in item type. Custom types registered via `extendTypes` are resolved
 * through the configured children or render callbacks.
 *
 * @param items - Raw item metadata definitions.
 * @param options - Configuration including theme strings, custom type renderers, and optional FaasJS or local data.
 * @returns Fully populated column definitions ready for the Ant Design table.
 * @throws {Error} When a custom type in `extendTypes` omits both `children` and `render`.
 */
export function createTableColumns(
  items: TableItemProps[],
  options: {
    all: ResolvedTheme['common']['all']
    blank: ResolvedTheme['common']['blank']
    search: ResolvedTheme['common']['search']
    extendTypes?: Record<string, ExtendTableTypeProps>
    faasData?: FaasDataWrapperProps<any>
    dataSource?: Record<string, any>[]
  },
): TableItemProps[] {
  const columns = cloneDeep(items).filter(
    (item) =>
      !(
        item.tableChildren === null ||
        item.children === null ||
        item.tableRender === null ||
        item.render === null
      ),
  )

  for (const item of columns) {
    if (!item.key) item.key = item.id
    if (!item.dataIndex) item.dataIndex = item.id
    const itemType = item.type ?? 'string'

    item.title = item.title ?? idToTitle(item.id)
    item.type = itemType

    if (item.options?.length) {
      item.options = transferOptions(item.options)
      item.filters = toTableFilters(item.options as NormalizedTableOption[], true)
      generateFilterDropdown(item, options.search)
    }

    const children = item.tableChildren || item.children

    if (children) {
      item.render = (value: any, values: any) =>
        cloneUnionFaasItemElement(children, {
          scene: 'table',
          value,
          values,
          index: 0,
        })

      delete item.children
      delete item.tableChildren

      continue
    }

    const render = item.tableRender || item.render

    if (render) {
      item.render = (value: any, values: any) => render(value, values, 0, 'table')

      delete item.tableRender

      continue
    }

    const extendType = options.extendTypes?.[itemType]

    if (extendType) {
      const extendChildren = extendType.children

      if (extendChildren) {
        item.render = (value: any, values: any) =>
          cloneUnionFaasItemElement(extendChildren, {
            scene: 'table',
            value,
            values,
            index: 0,
          })
      } else {
        const extendRender = extendType.render

        if (extendRender) {
          item.render = (value: any, values: any) => extendRender(value, values, 0, 'table')
        } else throw Error(`${itemType} requires children or render`)
      }

      continue
    }

    switch (itemType) {
      case 'string':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (!value || isNil(value)) return true

              if (isNil(row[item.id])) return false

              return (row[item.id] as string)
                .trim()
                .toLowerCase()
                .includes(value.trim().toLowerCase())
            }

          if (
            typeof item.filterDropdown === 'undefined' &&
            !item.filters &&
            item.optionsType !== 'auto'
          )
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search)
        }
        break
      case 'string[]':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length || !value) return false

              return (row[item.id] as string[]).some((v) =>
                v.trim().toLowerCase().includes(value.trim().toLowerCase()),
              )
            }

          if (
            typeof item.filterDropdown === 'undefined' &&
            !item.filters &&
            item.optionsType !== 'auto'
          )
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search)
        }
        break
      case 'number':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (typeof item.sorter === 'undefined')
          item.sorter = (a: any, b: any) => a[item.id] - b[item.id]

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null) return true
              if (isNil(row[item.id])) return false

              return value == row[item.id]
            }

          if (typeof item.filterDropdown === 'undefined' && !item.filters)
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search, Number)
        }
        break
      case 'number[]':
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false) {
          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (value === null && (!row[item.id] || !row[item.id].length)) return true

              if (!row[item.id] || !row[item.id].length) return false

              return row[item.id].includes(Number(value))
            }

          if (typeof item.filterDropdown === 'undefined' && !item.filters)
            item.filterDropdown = createTextSearchFilterDropdown(item, options.search, Number)
        }
        break
      case 'boolean':
        if (!item.render) item.render = (value) => renderDisplayValue('boolean', value)

        if (item.filterDropdown !== false) {
          if (typeof item.filterDropdown === 'undefined')
            item.filterDropdown = ({
              setSelectedKeys,
              selectedKeys,
              confirm: confirmFilter,
            }: {
              setSelectedKeys: (selectedKeys: React.Key[]) => void
              selectedKeys: React.Key[]
              confirm: () => void
            }) => (
              <Radio.Group
                style={{ padding: 8 }}
                buttonStyle="solid"
                value={JSON.stringify(selectedKeys[0])}
                onChange={(e) => {
                  const values: Record<string, any> = {
                    true: true,
                    false: false,
                    null: null,
                  }
                  setSelectedKeys(e.target.value ? [values[e.target.value]] : [])
                  confirmFilter()
                }}
              >
                <Radio.Button>{options.all}</Radio.Button>
                <Radio.Button value={'true'}>
                  <CheckOutlined
                    style={{
                      color: '#52c41a',
                      verticalAlign: 'middle',
                    }}
                  />
                </Radio.Button>
                <Radio.Button value={'false'}>
                  <CloseOutlined
                    style={{
                      verticalAlign: 'middle',
                      color: '#ff4d4f',
                    }}
                  />
                </Radio.Button>
                <Radio.Button value={'null'}>{options.blank}</Radio.Button>
              </Radio.Group>
            )

          if (!item.onFilter && !options.faasData)
            item.onFilter = (value, row) => {
              switch (value) {
                case true:
                  return !isNil(row[item.id]) && row[item.id] !== false
                case false:
                  return !isNil(row[item.id]) && !row[item.id]
                default:
                  return isNil(row[item.id])
              }
            }
        }
        break
      case 'date':
      case 'time':
        if (itemType === 'time') item.width = item.width ?? 200
        if (!item.render) item.render = (value) => processValue(item, value)

        if (typeof item.sorter === 'undefined')
          item.sorter = (a, b, order) => {
            if (isNil(a[item.id])) return order === 'ascend' ? 1 : -1
            if (isNil(b[item.id])) return order === 'ascend' ? -1 : 1
            return new Date(a[item.id]).getTime() < new Date(b[item.id]).getTime() ? -1 : 1
          }

        if (item.filterDropdown !== false) {
          if (typeof item.filterDropdown === 'undefined')
            item.filterDropdown = ({ setSelectedKeys, confirm }) => (
              <DatePicker.RangePicker
                onChange={(dates) => {
                  const start = dates?.[0]
                  const end = dates?.[1]

                  setSelectedKeys(
                    start && end
                      ? ([
                          [start.startOf('day').toISOString(), end.endOf('day').toISOString()],
                        ] as any)
                      : [],
                  )
                  confirm()
                }}
              />
            )

          if (!item.onFilter && !options.faasData)
            item.onFilter = (value: any, row) => {
              if (isNil(value[0])) return true
              if (isNil(row[item.id])) return false

              return (
                dayjs(row[item.id]) >= dayjs(value[0]) && dayjs(row[item.id]) <= dayjs(value[1])
              )
            }
        }
        break
      case 'object':
        if (!item.render)
          item.render = (value) => (
            <Description items={item.object || []} dataSource={value || {}} column={1} />
          )
        break
      case 'object[]':
        if (!item.render)
          item.render = (value: Record<string, any>[]) => (
            <>
              {value.map((v, i) => (
                <Description key={i} items={item.object || []} dataSource={v || []} column={1} />
              ))}
            </>
          )
        break
      default:
        if (!item.render) item.render = (value) => processValue(item, value)

        if (item.filterDropdown !== false && !item.onFilter && !options.faasData)
          item.onFilter = (value: any, row) => {
            if (value === null && isNil(row[item.id])) return true

            return value === row[item.id]
          }
        break
    }
  }

  if (options.dataSource) {
    for (const column of columns) {
      if (column.optionsType === 'auto' && !column.options && !column.filters) {
        const normalizedOptions = uniqBy(options.dataSource, column.id).map(
          (value: Record<string, any>) => ({
            label: value[column.id],
            value: value[column.id],
          }),
        )

        if (!normalizedOptions.length) continue

        column.options = normalizedOptions
        generateFilterDropdown(column, options.search)
      }
    }
  }

  return columns
}
