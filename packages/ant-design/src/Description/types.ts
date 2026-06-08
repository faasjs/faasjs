import type { FaasActionPaths } from '@faasjs/types'
import type { DescriptionsProps } from 'antd'
import type { ReactNode } from 'react'

import type {
  BaseExtendTypeProps,
  BaseItemProps,
  FaasItemProps,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from '../data/types'
import type { FaasDataWrapperProps } from '../FaasDataWrapper'

/**
 * Type-level extension payload for custom description item types.
 *
 * @template T - Data record shape rendered by the description list.
 */
export type ExtendDescriptionTypeProps<T = any> = BaseExtendTypeProps<T>

/**
 * Extensible description item props that accept any item shape.
 */
export type ExtendDescriptionItemProps = BaseItemProps

/**
 * Description item meta-object consumed by the {@link Description} component.
 *
 * @template T - Data record shape rendered by the description list.
 */
export interface DescriptionItemProps<T = any> extends FaasItemProps {
  /** Generic custom element rendered when no description-specific child overrides it. */
  children?: UnionFaasItemElement<T> | null
  /** Description-specific custom element. */
  descriptionChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Description-specific custom render callback. */
  descriptionRender?: UnionFaasItemRender<T> | null
  /** Conditional visibility predicate. When `false`, the item is hidden from the description list. */
  if?: (values: Record<string, any>) => boolean
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: DescriptionItemProps<T>[]
}

/**
 * Shared props used by both local-data and Faas-data description lists.
 *
 * @template T - Data record shape rendered by the description list.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export interface DescriptionCommonProps<T = any, ExtendItemProps = any> extends Omit<
  DescriptionsProps,
  'items'
> {
  /** Callback that returns a custom React node for the title. */
  renderTitle?(this: void, values: T): ReactNode
  /** Item metadata definitions rendered as description entries. */
  items: (DescriptionItemProps | ExtendItemProps)[]
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

/**
 * Props for the {@link Description} component when rendering a local data source.
 *
 * @template T - Data record shape rendered by the description list.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export interface DescriptionWithoutFaasProps<
  T = any,
  ExtendItemProps = any,
> extends DescriptionCommonProps<T, ExtendItemProps> {
  /** Local data source rendered by the description list. */
  dataSource?: T
  /** Must not be set when using a local `dataSource`. */
  faasData?: never
}

/**
 * Props for the {@link Description} component when fetching data via FaasJS.
 *
 * @template Path - Action path type inferred from `faasData.action`.
 * @template T - Data record shape rendered by the description list.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export interface DescriptionWithFaasProps<
  Path extends FaasActionPaths = any,
  T = any,
  ExtendItemProps = any,
> extends DescriptionCommonProps<T, ExtendItemProps> {
  /** Must not be set when using `faasData`. */
  dataSource?: never
  /** FaasJS data wrapper configuration that fetches the data source. */
  faasData?: FaasDataWrapperProps<Path>
}

/**
 * Full props union accepted by the {@link Description} component.
 *
 * @template T - Data record shape rendered by the description list.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type DescriptionProps<T = any, ExtendItemProps = any> =
  | DescriptionWithoutFaasProps<T, ExtendItemProps>
  | DescriptionWithFaasProps<any, T, ExtendItemProps>

/**
 * Props passed to the internal description item renderer.
 *
 * @template T - Data record shape rendered by the description list.
 */
export interface DescriptionItemContentProps<T = any> {
  /** The item definition being rendered. */
  item: DescriptionItemProps
  /** Raw value read from the data source for this item's `id`. */
  value: T
  /** Entire data source record (optional). */
  values?: any
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}
