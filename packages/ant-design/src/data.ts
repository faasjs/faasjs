import { upperFirst } from 'lodash'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean' |
  'date' | 'time' |
  'object' | 'object[]'

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

export type BaseOption = string | number | {
  label: string
  value?: string | number
}

export type BaseItemProps = {
  id: string
  title?: string
  options?: BaseOption[]
}

export type FaasItemProps = BaseItemProps & {
  /**
   * Support string, string[], number, number[], boolean
   * @default 'string'
   */
  type?: FaasItemType
}

export function transferOptions (options: BaseOption[]): {
  label: string
  value?: string | number
}[] {
  if (!options) return []

  return options.map((item: any) => (typeof item === 'object' ? item : {
    label: upperFirst(item.toString()),
    value: item
  }))
}

export function transferValue (type: FaasItemType, value: any): any {
  if (typeof value === 'undefined' || value === null || value === '' || (Array.isArray(value) && !value.length))
    return null

  if (!type) type = 'string'

  if (type.endsWith('[]') && typeof value === 'string') value = value.split(',')

  if (['date', 'time'].includes(type)) {
    if (typeof value === 'number' && value.toString().length === 10)
      value = value * 1000

    if (!dayjs.isDayjs(value))
      value = dayjs(value)
  }

  return value
}
