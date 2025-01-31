import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ReactElement } from 'react'
import type { DescriptionItemProps } from './Description'
import type { FormItemProps } from './FormItem'
import type { TableItemProps } from './Table'

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

/** FaasItemType's value type */
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

export type BaseOption =
  | string
  | number
  | {
    label: string
    value?: any
  }

export interface BaseItemProps {
  id: string
  title?: string
  options?: BaseOption[]
}

export interface FaasItemProps extends BaseItemProps {
  /**
   * Support string, string[], number, number[], boolean, date, time, object, object[]
   * @default 'string'
   */
  type?: FaasItemType
}

export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * convert string[] or number[] to { label, value }[]
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
        label: upperFirst(item.toString()),
        value: item,
      }
  )
}

export function transferValue(type: FaasItemType, value: any): any {
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

    value = value.map((item: any) =>
      transferValue(type.replace('[]', '') as FaasItemType, item)
    )
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
      if (typeof value === 'number' && value.toString().length === 10)
        value = value * 1000

      if (!dayjs.isDayjs(value)) value = dayjs(value)
      break
  }

  return value
}

export type UnionScene = 'form' | 'description' | 'table'

export type UnionFaasItemInjection<Value = any, Values = any> = {
  scene?: UnionScene
  value?: Value
  values?: Values
  index?: number
}

/**
 * A type representing a function that renders a React node for a given item in a list.
 *
 * @param value - The value of the current item.
 * @param values - The entire list of values.
 * @param index - The index of the current item in the list.
 * @param scene {@link UnionScene} - The scene in which the rendering is taking place.
 *
 * @example
 * ```tsx
 * import { type UnionFaasItemRender, Form, Description, Table } from '@faasjs/ant-design'
 *
 * const render: UnionFaasItemRender = (value, values, index, scene) => {
 *   switch (scene) {
 *     case 'form':
 *       return <input />
 *     case 'description':
 *     case 'table':
 *       return <span>{value}</span>
 *     default:
 *       return null
 *   }
 * }
 *
 * const items = [
 *   {
 *     id: 'name',
 *     render,
 *   }
 * ]
 *
 * function App() {
 *   return <>
 *     <Form items={items} /> // Will render an input
 *     <Description items={items} dataSource={{ name: 'John' }} /> // Will render a span
 *     <Table items={items} dataSource={[{ name: 'John' }]} /> // Will render a span
 *   </>
 * }
 * ```
 */
export type UnionFaasItemRender<Value = any, Values = any> = (
  value: Value,
  values: Values,
  index: number,
  scene: UnionScene
) => React.ReactNode

export type UnionFaasItemElement<Value = any, Values = any> = ReactElement<
  UnionFaasItemInjection<Value, Values>
> | null

/**
 * Interface representing the properties of a UnionFaas item.
 *
 * The UnionFaas item can be used in a form, description, or table.
 *
 * @example
 * ```tsx
 * import { type UnionFaasItemProps, Form, Table, Description } from '@faasjs/ant-design'
 *
 * const item: UnionFaasItemProps[] = [
 *   {
 *     id: 'id',
 *     formChildren: null, // Don't show in form, only in description and table
 *   },
 *   {
 *     id: 'name',
 *     required: true, // Required in form
 *   },
 *   {
 *     id: 'age',
 *     type: 'number', // Number type in form, description and table
 *     options: ['< 18', '>= 18'], // Options in form and table
 *   }
 * ]
 *
 * const data = {
 *   id: '1',
 *   name: 'John',
 *   age: '>= 18',
 * }
 *
 * function App() {
 *   return <>
 *     <Form items={item} /> // Use in form
 *     <Description items={item} dataSource={data} /> // Use in description
 *     <Table items={item} dataSource={[ data ]} /> // Use in table
 *   </>
 * }
 * ```
 */
export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps,
  DescriptionItemProps,
  TableItemProps {
  children?: UnionFaasItemElement<UnionFaasItemProps<Value, Values>> | null
  render?: UnionFaasItemRender
  object?: UnionFaasItemProps<Value, Values>[]
}
