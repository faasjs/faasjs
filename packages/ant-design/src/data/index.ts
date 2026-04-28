import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { cloneElement, createElement, type FC, isValidElement, type ReactElement } from 'react'

import type { DescriptionItemProps } from '../Description'
import type { FormItemProps } from '../FormItem'
import type { TableItemProps } from '../Table'

/**
 * Supported built-in field types shared by form, table, and description components.
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
 * Runtime value mapping for each built-in {@link FaasItemType}.
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
 * Option item accepted by built-in choice inputs.
 */
export type BaseOption =
  | string
  | number
  | {
      /** Display label rendered by Ant Design controls. */
      label: string
      /** Raw option value submitted or matched by components. */
      value?: any
    }

/**
 * Common metadata shared by form, table, and description items.
 */
export interface BaseItemProps {
  /** Stable field identifier used as the default name and title source. */
  id: string | number
  /** Human-readable title used for labels and table headers. */
  title?: string
  /** Shared choice options used by select-like renderers. */
  options?: BaseOption[]
}

/**
 * Base item props plus the shared built-in value type selector.
 */
export interface FaasItemProps extends BaseItemProps {
  /**
   * Built-in FaasJS field type used to normalize and render values.
   *
   * @default 'string'
   */
  type?: FaasItemType
}

/**
 * Convert a snake_case, kebab-case, or spaced identifier into a title-style label.
 *
 * @param {string | number} id - Identifier to convert.
 * @returns Generated label string.
 *
 * @example
 * ```ts
 * idToTitle('example_id') // 'Example Id'
 * ```
 */
export function idToTitle(id: string | number): string {
  if (typeof id === 'number') return id.toString()

  const splitted = id
    .split(/(\s|_|-)/)
    .filter((word) => !/(\s|_|-)/.test(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return splitted.charAt(0).toUpperCase() + splitted.slice(1)
}

/**
 * Normalize primitive options into explicit `{ label, value }` objects.
 *
 * String and number options are converted with {@link idToTitle}, while pre-shaped option objects
 * are returned as-is.
 *
 * @param {BaseOption[]} options - Raw option list to normalize.
 * @returns Normalized option list.
 *
 * @example
 * ```ts
 * import { transferOptions } from '@faasjs/ant-design'
 *
 * transferOptions(['draft', { label: 'Published', value: 'published' }])
 * // [
 * //   { label: 'Draft', value: 'draft' },
 * //   { label: 'Published', value: 'published' },
 * // ]
 * ```
 */
export function transferOptions(options: BaseOption[]): {
  label: string
  value?: string | number
}[] {
  if (!options) return []

  return options.map((item: any) =>
    typeof item === 'object'
      ? item
      : {
          label: idToTitle(item.toString()),
          value: item,
        },
  )
}

/**
 * Normalize raw values into the runtime shape expected by FaasJS Ant Design components.
 *
 * Primitive strings such as `'null'` and `'undefined'` become `null`, comma-delimited array
 * strings are split into arrays, and date or time values are converted to `dayjs` objects.
 *
 * @param {FaasItemType | null | undefined} type - Target field type.
 * @param {any} value - Raw value to normalize.
 * @returns Normalized value for rendering or form initialization.
 *
 * @example
 * ```ts
 * import { transferValue } from '@faasjs/ant-design'
 *
 * transferValue('number', '42') // 42
 * transferValue('boolean', 'true') // true
 * transferValue('string[]', 'a,b') // ['a', 'b']
 * ```
 */
export function transferValue(type: FaasItemType | null | undefined, value: any): any {
  if (!type) type = 'string'

  if (
    !type.endsWith('[]') &&
    (typeof value === 'undefined' ||
      value === null ||
      value === '' ||
      value === 'null' ||
      value === 'undefined')
  )
    return null

  if (type.endsWith('[]')) {
    if (!value) value = []

    if (typeof value === 'string') value = value.split(',').filter(Boolean)

    if (!Array.isArray(value)) value = [value]

    value = value.map((item: any) => transferValue(type.replace('[]', '') as FaasItemType, item))
  }

  switch (type) {
    case 'boolean':
      if (typeof value === 'string') value = value === 'true'
      break
    case 'number':
      if (typeof value === 'string') value = Number(value)
      break
    case 'date':
    case 'time':
      if (typeof value === 'number' && value.toString().length === 10) value = value * 1000

      if (!dayjs.isDayjs(value)) value = dayjs(value)
      break
  }

  return value
}

/**
 * Rendering surfaces supported by union item helpers.
 */
export type UnionScene = 'form' | 'description' | 'table'

/**
 * Props injected into custom union item components.
 *
 * @template Value - Current item value type.
 * @template Values - Whole record or row type that contains the value.
 */
export type UnionFaasItemInjection<Value = any, Values = any> = {
  /** Rendering surface requesting the injected element. */
  scene?: UnionScene
  /** Current field, cell, or item value. */
  value?: Value
  /** Full record or row containing the current value. */
  values?: Values
  /** Current row or list index when available. */
  index?: number
}

/**
 * Render callback signature shared by form, description, and table item definitions.
 *
 * @template Value - Current item value type.
 * @template Values - Whole record or row type that contains the value.
 *
 * @param {Value} value - Current item value.
 * @param {Values} values - Whole record or row containing the value.
 * @param {number} index - Current row or list index.
 * @param {UnionScene} scene - Rendering surface requesting the output.
 */
export type UnionFaasItemRender<Value = any, Values = any> = (
  value: Value,
  values: Values,
  index: number,
  scene: UnionScene,
) => React.ReactNode

/**
 * Custom React component or element accepted by union item definitions.
 *
 * @template Value - Current item value type.
 * @template Values - Whole record or row type that contains the value.
 */
export type UnionFaasItemElement<Value = any, Values = any> =
  | ReactElement<UnionFaasItemInjection<Value, Values>>
  | FC<UnionFaasItemInjection<Value, Values>>

/**
 * Shared union item contract that can be reused across `Form`, `Description`, and `Table`.
 *
 * ### Render Priority Order
 *
 * 1. Component-specific null renderers hide the item for that surface.
 * 2. Component-specific children override generic `children`.
 * 3. Component-specific render callbacks override generic `render`.
 * 4. Registered extended types handle unmatched items.
 * 5. Built-in type renderers handle primitive and object values.
 *
 * @template Value - Current item value type.
 * @template Values - Whole record or row type that contains the value.
 */
export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps, DescriptionItemProps, TableItemProps {
  /** Shared custom element rendered when no surface-specific child overrides it. */
  children?: UnionFaasItemElement<Value, Values> | null
  /** Shared render callback used when no surface-specific render overrides it. */
  render?: UnionFaasItemRender<Value, Values> | null
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: UnionFaasItemProps<Value, Values>[]
}

/**
 * Clone a {@link UnionFaasItemElement} with FaasJS injection props.
 *
 * React elements are cloned directly, while component references are first wrapped with
 * `createElement`.
 *
 * @param {UnionFaasItemElement} element - Element or component to clone.
 * @param {any} props - Injection props such as `scene`, `value`, `values`, and `index`.
 * @returns Cloned React element ready for rendering.
 *
 * @example
 * ```tsx
 * import { cloneUnionFaasItemElement, type UnionFaasItemElement } from '@faasjs/ant-design'
 *
 * const Cell: UnionFaasItemElement<string> = ({ value }) => <span>{value}</span>
 *
 * const element = cloneUnionFaasItemElement(Cell, {
 *   scene: 'table',
 *   value: 'Hello',
 *   index: 0,
 * })
 * ```
 */
export function cloneUnionFaasItemElement(element: UnionFaasItemElement, props: any) {
  return cloneElement(isValidElement(element) ? element : createElement(element), props)
}
