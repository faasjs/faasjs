import type { Dayjs } from 'dayjs'
import type { FC, ReactElement } from 'react'

import type { DescriptionItemProps } from '../Description/types'
import type { FormItemProps } from '../FormItem/types'
import type { TableItemProps } from '../Table/types'

/**
 * Supported item types used across {@link Form}, {@link Description}, and {@link Table}.
 *
 * Each type maps to a built-in Ant Design control or a nested renderer for `object` and `object[]`.
 */
export type FaasItemType =
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'boolean'
  | 'date'
  | 'time'
  | 'object'
  | 'object[]'

/**
 * Map from {@link FaasItemType} to the expected JavaScript value type.
 */
export type FaasItemTypeValue = {
  string: string
  'string[]': string[]
  number: number
  'number[]': number[]
  boolean: boolean
  date: Dayjs
  time: Dayjs
  object: any
  'object[]': any[]
}

/**
 * Accepted form of a select/dropdown option before normalization.
 */
export type BaseOption =
  | string
  | number
  | {
      label: string
      value?: any
    }

/**
 * Minimal common shape shared by all item definition types.
 */
export interface BaseItemProps {
  id: string | number
  title?: string
  options?: BaseOption[]
}

/**
 * Minimal FaasJS-aware item definition that includes an optional type.
 */
export interface FaasItemProps extends BaseItemProps {
  type?: FaasItemType
}

/**
 * Rendering surface that determines the available per-type defaults.
 */
export type UnionScene = 'form' | 'description' | 'table'

/**
 * Props injected into a {@link UnionFaasItemElement} by the rendering host.
 */
export type UnionFaasItemInjection<Value = any, Values = any> = {
  scene?: UnionScene
  value?: Value
  values?: Values
  index?: number
}

/**
 * Render callback shared by form items, description items, and table columns.
 *
 * @param value - Normalized value for the field or column.
 * @param values - Full record for the current row or form.
 * @param index - Position of the item inside a list (always 0 for single items).
 * @param scene - Rendering surface that triggered the callback.
 */
export type UnionFaasItemRender<Value = any, Values = any> = (
  value: Value,
  values: Values,
  index: number,
  scene: UnionScene,
) => React.ReactNode

/**
 * Shared element type accepted by `children` and `render` props across all surfaces.
 */
export type UnionFaasItemElement<Value = any, Values = any> =
  | ReactElement<UnionFaasItemInjection<Value, Values>>
  | FC<UnionFaasItemInjection<Value, Values>>

/**
 * Combined item props that spans form, description, and table definitions.
 */
export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps, DescriptionItemProps, TableItemProps {
  children?: UnionFaasItemElement<Value, Values> | null
  render?: UnionFaasItemRender<Value, Values> | null
  object?: UnionFaasItemProps<Value, Values>[]
}

/**
 * Base shape for custom item type definitions accepted by `extendTypes`.
 *
 * @template T - Value type rendered or edited by the custom type.
 */
export type BaseExtendTypeProps<T = any> = {
  children?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
}
