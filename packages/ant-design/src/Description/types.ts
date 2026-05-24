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

export type ExtendDescriptionTypeProps<T = any> = BaseExtendTypeProps<T>

export type ExtendDescriptionItemProps = BaseItemProps

export interface DescriptionItemProps<T = any> extends FaasItemProps {
  children?: UnionFaasItemElement<T> | null
  descriptionChildren?: UnionFaasItemElement<T> | null
  render?: UnionFaasItemRender<T> | null
  descriptionRender?: UnionFaasItemRender<T> | null
  if?: (values: Record<string, any>) => boolean
  object?: DescriptionItemProps<T>[]
}

export interface DescriptionCommonProps<T = any, ExtendItemProps = any> extends Omit<
  DescriptionsProps,
  'items'
> {
  renderTitle?(this: void, values: T): ReactNode
  items: (DescriptionItemProps | ExtendItemProps)[]
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

export interface DescriptionWithoutFaasProps<
  T = any,
  ExtendItemProps = any,
> extends DescriptionCommonProps<T, ExtendItemProps> {
  dataSource?: T
  faasData?: never
}

export interface DescriptionWithFaasProps<
  Path extends FaasActionPaths = any,
  T = any,
  ExtendItemProps = any,
> extends DescriptionCommonProps<T, ExtendItemProps> {
  dataSource?: never
  faasData?: FaasDataWrapperProps<Path>
}

export type DescriptionProps<T = any, ExtendItemProps = any> =
  | DescriptionWithoutFaasProps<T, ExtendItemProps>
  | DescriptionWithFaasProps<any, T, ExtendItemProps>

export interface DescriptionItemContentProps<T = any> {
  item: DescriptionItemProps
  value: T
  values?: any
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}
