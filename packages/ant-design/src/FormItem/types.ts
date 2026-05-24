import type {
  FormItemProps as AntdFormItemProps,
  DatePickerProps,
  FormInstance,
  InputNumberProps,
  InputProps,
  RadioProps,
  SelectProps,
  SwitchProps,
} from 'antd'
import type { RuleObject } from 'antd/es/form'

import type {
  BaseExtendTypeProps,
  BaseItemProps,
  FaasItemType,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from '../data/types'

export type ExtendFormTypeProps<T = any> = BaseExtendTypeProps<T>

export type ExtendTypes = {
  [type: string]: ExtendFormTypeProps
}

export type InputTypeMap<T> = {
  string: InputProps | SelectProps<T> | RadioProps
  'string[]': InputProps | SelectProps<T> | RadioProps
  number: InputNumberProps | SelectProps<T> | RadioProps
  'number[]': InputNumberProps | SelectProps<T> | RadioProps
  boolean: SwitchProps
  date: DatePickerProps
  time: DatePickerProps
  object: never
  'object[]': never
}

export interface FormItemProps<T = any>
  extends BaseItemProps, Omit<AntdFormItemProps<T>, 'id' | 'children' | 'render'> {
  type?: FaasItemType
  input?: InputTypeMap<T>[FaasItemType]
  maxCount?: number
  object?: FormItemProps[]
  disabled?: boolean
  required?: boolean
  col?: number
  children?: UnionFaasItemElement<T> | null
  formChildren?: UnionFaasItemElement<T> | null
  render?: UnionFaasItemRender<T> | null
  formRender?: UnionFaasItemRender<T> | null
  rules?: RuleObject[]
  label?: string | false
  extendTypes?: ExtendTypes
  onValueChange?: (value: T, values: any, form: FormInstance) => void
  if?: (values: Record<string, any>) => boolean
}

export interface ExtendFormItemProps extends Omit<FormItemProps, 'type'> {
  type?: string
}
