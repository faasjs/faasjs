import type {
  TableColumnProps as AntdTableColumnProps,
  TableProps as AntdTableProps,
  TablePaginationConfig,
} from 'antd'
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'

import type {
  BaseExtendTypeProps,
  BaseItemProps,
  FaasItemProps,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from '../data/types'
import type { FaasDataWrapperProps } from '../FaasDataWrapper'

/**
 * Column definition used by the FaasJS Ant Design {@link Table} component.
 *
 * @template T - Row record type rendered by the table.
 */
export interface TableItemProps<T = any>
  extends FaasItemProps, Omit<AntdTableColumnProps<T>, 'title' | 'children' | 'render'> {
  /** Use built-in option inference for filters when supported. */
  optionsType?: 'auto'
  /** Generic custom element rendered when no table-specific child overrides it. */
  children?: UnionFaasItemElement<T> | null
  /** Table-specific custom element. */
  tableChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Table-specific custom render callback. */
  tableRender?: UnionFaasItemRender<T> | null
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: TableItemProps<T>[]
}

/**
 * Type-level extension payload for custom table column types.
 *
 * @template T - Row record type rendered by the table.
 */
export type ExtendTableTypeProps<T = any> = BaseExtendTypeProps<T>

/**
 * Shared fields for extending table item unions.
 *
 * @template T - Row record type rendered by the table.
 */
export type ExtendTableItemProps<T = any> = BaseItemProps &
  Omit<AntdTableColumnProps<T>, 'children'>

/**
 * Props for the FaasJS Ant Design {@link Table} component.
 *
 * @template T - Row record type rendered by the table.
 * @template ExtendTypes - Additional item prop shape accepted by `items`.
 */
export type TableProps<T = any, ExtendTypes = any> = {
  /** Column definitions rendered by the table. */
  items: (TableItemProps | (ExtendTypes & ExtendTableItemProps))[]
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendTableTypeProps
  }
  /**
   * Request config used to fetch table data before rendering.
   *
   * A plain array response is rendered directly. A paginated list response should
   * follow {@link TableFaasDataResponse}; that shape enables remote pagination,
   * filter, and sorter reloads.
   */
  faasData?: FaasDataWrapperProps<any>
  /**
   * Change handler that can return rewritten pagination, filter, and sorter state.
   *
   * When `faasData` uses a paginated list response, the returned state is sent
   * to `reload()`. Without this handler, the raw Ant Design table state is sent.
   */
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => {
    pagination: TablePaginationConfig
    filters: Record<string, FilterValue | null>
    sorter: SorterResult<T> | SorterResult<T>[]
    extra: TableCurrentDataSource<T>
  }
} & AntdTableProps<T>

/**
 * Query params shape expected by table-backed FaasJS list endpoints.
 *
 * The table sends these fields when remote pagination, filters, or sorters
 * change. Endpoint-specific params may be included alongside this shape by
 * setting `faasData.params`.
 */
export type TableFaasDataParams = {
  /** Active filter values keyed by column field. */
  filters?: Record<string, any[]>
  /** Pagination state sent to the endpoint. */
  pagination?: {
    /** Current page number. */
    current?: number
    /** Requested page size. */
    pageSize?: number
  }
  /** Sorter state sent to the endpoint. */
  sorter?:
    | {
        /** Column field being sorted. */
        field: string
        /** Sort direction. */
        order: 'ascend' | 'descend'
      }
    | {
        /** Column field being sorted. */
        field: string
        /** Sort direction when active. */
        order?: 'ascend' | 'descend'
      }[]
}

/**
 * Paginated list response shape expected by {@link Table} when using `faasData`.
 *
 * Return this object shape when the table should own remote pagination, filters,
 * and sorters. Returning a plain array is supported for simple row rendering,
 * but it does not attach the remote pagination/onChange reload contract.
 *
 * @template T - Row record type contained in `rows`.
 */
export type TableFaasDataResponse<T = any> = {
  /** Rows rendered by the table. */
  rows: T[]
  /** Pagination state returned by the endpoint. */
  pagination: {
    /** Current page number. */
    current: number
    /** Page size used for the result set. */
    pageSize: number
    /** Total number of available rows. */
    total: number
  }
}
