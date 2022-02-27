import { upperFirst } from 'lodash'
import { Dayjs } from 'dayjs'

export type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean' | 'date' | 'time' |
  'object' | 'object[]'

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
