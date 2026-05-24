import type { FaasActionPaths, FaasParams } from '@faasjs/types'
import type { FormProps as AntdFormProps, ButtonProps } from 'antd'
import type { JSX, ReactNode } from 'react'

import type { ExtendFormItemProps, ExtendTypes, FormItemProps } from '../FormItem/types'

export type FormSubmitProps = {
  text?: string
  buttonProps?: ButtonProps
}

export type FormFaasProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
> = {
  action: Path
  params?: FaasParams<Path> | ((values: Record<string, any>) => FaasParams<Path>)
  transformValues?: (values: Values) => Record<string, any> | Promise<Record<string, any>>
  onSuccess?: (result: any, values: Record<string, any>) => void
  onError?: (error: any, values: Record<string, any>) => void
  onFinally?: () => void
}

export type FormCommonProps<
  Values extends Record<string, any>,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = Omit<AntdFormProps<Values>, 'onFinish' | 'children' | 'initialValues'> & {
  items?: (
    | (ExtendItemProps extends ExtendFormItemProps
        ? ExtendItemProps | FormItemProps
        : FormItemProps)
    | JSX.Element
  )[]
  submit?: false | FormSubmitProps
  beforeItems?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
  extendTypes?: ExtendTypes
  children?: ReactNode
  initialValues?: Partial<Values>
}

export type FormWithoutFaasProps<
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  faas?: never
  onFinish?: (values: Values) => void | Promise<void>
}

export type FormWithFaasProps<
  Path extends FaasActionPaths = any,
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  faas?: FormFaasProps<Values, Path>
  onFinish?: never
}

export type FormProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormWithoutFaasProps<Values, ExtendItemProps> | FormWithFaasProps<Path, Values, ExtendItemProps>
