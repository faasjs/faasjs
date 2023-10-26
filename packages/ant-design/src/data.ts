import { upperFirst } from 'lodash-es'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ReactElement } from 'react'
import type { FormItemProps } from './FormItem'
import type { DescriptionItemProps } from './Description'
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
  if (
    typeof value === 'undefined' ||
    value === null ||
    value === '' ||
    value === 'null' ||
    value === 'undefined'
  )
    return null

  if (!type) type = 'string'

  if (type.endsWith('[]') && typeof value === 'string')
    value = value.split(',').filter(Boolean)

  if (['date', 'time'].includes(type)) {
    if (typeof value === 'number' && value.toString().length === 10)
      value = value * 1000

    if (!dayjs.isDayjs(value)) value = dayjs(value)
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

export type UnionFaasItemRender<Value = any, Values = any> = (
  value: Value,
  values: Values,
  index: number,
  scene: UnionScene
) => React.ReactNode

export type UnionFaasItemElement<Value = any, Values = any> = ReactElement<
  UnionFaasItemInjection<Value, Values>
> | null

export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps,
    DescriptionItemProps,
    TableItemProps {
  children?: UnionFaasItemElement<UnionFaasItemProps<Value, Values>> | null
  render?: UnionFaasItemRender
  object?: UnionFaasItemProps<Value, Values>[]
}
