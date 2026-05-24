import type { Dayjs } from 'dayjs'
import type { FC, ReactElement } from 'react'

import type { DescriptionItemProps } from '../Description/types'
import type { FormItemProps } from '../FormItem/types'
import type { TableItemProps } from '../Table/types'

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
  id: string | number
  title?: string
  options?: BaseOption[]
}

export interface FaasItemProps extends BaseItemProps {
  type?: FaasItemType
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
  scene: UnionScene,
) => React.ReactNode

export type UnionFaasItemElement<Value = any, Values = any> =
  | ReactElement<UnionFaasItemInjection<Value, Values>>
  | FC<UnionFaasItemInjection<Value, Values>>

export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps, DescriptionItemProps, TableItemProps {
  children?: UnionFaasItemElement<Value, Values> | null
  render?: UnionFaasItemRender<Value, Values> | null
  object?: UnionFaasItemProps<Value, Values>[]
}

export type BaseExtendTypeProps<T = any> = {
  children?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
}
