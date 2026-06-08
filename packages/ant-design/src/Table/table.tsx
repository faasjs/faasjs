import { useEqualMemo } from '@faasjs/react'
import type { FaasDataInjection } from '@faasjs/react'
import { Table as AntdTable, type TablePaginationConfig } from 'antd'
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'

import { useConfigContext } from '../Config'
import { FaasDataWrapper } from '../FaasDataWrapper'
import { createTableColumns } from './column-builder'
import type { TableItemProps, TableProps, ExtendTableTypeProps } from './types'
import { applyFaasDataColumnOptions } from './utils'

/**
 * Render an Ant Design table from FaasJS item metadata.
 *
 * The component can render local `dataSource` rows or resolve remote rows through `faasData`. It
 * also generates default filters and sorters for built-in item types unless you disable them with
 * the corresponding Ant Design column props. Remote list endpoints should return
 * `{ rows, pagination }` when the table should send pagination, filters, and sorters
 * back through `reload()`; a plain array response is rendered as rows without that
 * remote list contract.
 *
 * @template T - Row record type rendered by the table.
 * @template ExtendTypes - Additional item prop shape accepted by `items`.
 * @param {TableProps<T, ExtendTypes>} props - Table props including columns, data source, and optional Faas data config.
 * @throws {Error} When an entry in `extendTypes` omits both `children` and `render`.
 *
 * @example
 * ```tsx
 * import { Table } from '@faasjs/ant-design'
 * import type { TableFaasDataParams, TableFaasDataResponse } from '@faasjs/ant-design'
 *
 * const rows = [
 *   { id: 1, name: 'Alice', active: true },
 *   { id: 2, name: 'Bob', active: false },
 * ]
 *
 * export function UserTable() {
 *   return (
 *     <Table
 *       rowKey="id"
 *       dataSource={rows}
 *       items={[
 *         { id: 'name', title: 'Name' },
 *         { id: 'active', type: 'boolean', title: 'Active' },
 *       ]}
 *     />
 *   )
 * }
 *
 * declare module '@faasjs/types' {
 *   interface FaasActions {
 *     'users/list': {
 *       Params: TableFaasDataParams & { status?: string }
 *       Data: TableFaasDataResponse<{ id: number; name: string; active: boolean }>
 *     }
 *   }
 * }
 *
 * export function RemoteUserTable() {
 *   return (
 *     <Table<{ id: number; name: string; active: boolean }>
 *       rowKey="id"
 *       faasData={{
 *         action: 'users/list',
 *         params: { pagination: { current: 1, pageSize: 20 } },
 *       }}
 *       items={[
 *         { id: 'name', title: 'Name' },
 *         { id: 'active', type: 'boolean', title: 'Active' },
 *       ]}
 *     />
 *   )
 * }
 * ```
 */
export function Table<T extends Record<string, any>, ExtendTypes = any>(
  props: TableProps<T, ExtendTypes>,
) {
  const { theme } = useConfigContext()
  const { all, blank, search } = theme.common
  const columns = useEqualMemo(
    () =>
      createTableColumns(props.items as TableItemProps[], {
        all,
        blank,
        search,
        ...(props.extendTypes
          ? {
              extendTypes: props.extendTypes as Record<string, ExtendTableTypeProps>,
            }
          : {}),
        ...(props.faasData
          ? {
              faasData: props.faasData,
            }
          : {}),
        ...(props.dataSource
          ? {
              dataSource: props.dataSource as Record<string, any>[],
            }
          : {}),
      }),
    [all, blank, props.dataSource, props.extendTypes, props.faasData, props.items, search],
  )

  if (props.dataSource)
    return (
      <AntdTable
        {...props}
        rowKey={props.rowKey || 'id'}
        columns={columns as any[]}
        dataSource={props.dataSource}
      />
    )

  if (!props.faasData) return <FaasDataTable props={props} columns={columns} />

  return (
    <FaasDataWrapper<any> {...props.faasData}>
      <FaasDataTable props={props} columns={columns} />
    </FaasDataWrapper>
  )
}

/**
 * Internal table renderer that binds FaasJS data injection props to an Ant Design table.
 *
 * @param props - Combined FaasJS data injection and table props.
 *
 * @internal
 */
export function FaasDataTable({
  props,
  columns,
  data,
  params,
  reload,
  loading,
}: Partial<FaasDataInjection<any>> & {
  props: TableProps
  columns: TableItemProps[]
}) {
  const currentColumns = useEqualMemo(
    () =>
      !data || Array.isArray(data)
        ? columns
        : applyFaasDataColumnOptions(columns, data as Record<string, any>),
    [columns, data],
  )

  const tableDataSource = !data ? [] : Array.isArray(data) ? (data as any) : (data as any).rows

  return (
    <AntdTable
      {...props}
      {...(typeof loading === 'undefined' ? {} : { loading })}
      {...(!data || Array.isArray(data)
        ? {}
        : {
            pagination:
              props.pagination === false
                ? false
                : {
                    ...(props.pagination || Object.create(null)),
                    ...((data as any).pagination || Object.create(null)),
                  },
            onChange: (
              pagination: TablePaginationConfig,
              filters: Record<string, FilterValue | null>,
              sorter: SorterResult<any> | SorterResult<any>[],
              extra: TableCurrentDataSource<any>,
            ) => {
              if (!reload) return

              if (props.onChange) {
                const processed = props.onChange(pagination, filters, sorter, extra)
                void reload({
                  ...(params || Object.create(null)),
                  pagination: processed.pagination,
                  filters: processed.filters,
                  sorter: processed.sorter,
                  extra: processed.extra,
                })
                return
              }

              void reload({
                ...(params || Object.create(null)),
                pagination,
                filters,
                sorter,
              })
            },
          })}
      rowKey={props.rowKey || 'id'}
      columns={currentColumns as any[]}
      dataSource={tableDataSource}
    />
  )
}
