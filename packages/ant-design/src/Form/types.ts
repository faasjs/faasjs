import type { FaasActionPaths, FaasParams } from '@faasjs/types'
import type { FormProps as AntdFormProps, ButtonProps } from 'antd'
import type { JSX, ReactNode } from 'react'

import type { ExtendFormItemProps, ExtendTypes, FormItemProps } from '../FormItem/types'

/**
 * Submit button configuration for the {@link Form} component.
 */
export type FormSubmitProps = {
  /** Submit button label. */
  text?: string
  /** Props forwarded to the Ant Design submit button. */
  buttonProps?: ButtonProps
}

/**
 * Configures FaasJS-backed form submission.
 *
 * @template Values - Form values shape.
 * @template Path - Action path type inferred from the registered FaasJS actions.
 */
export type FormFaasProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
> = {
  /** Fully qualified FaasJS action path. */
  action: Path
  /** Static params or a factory that receives the current form values and returns the params payload. */
  params?: FaasParams<Path> | ((values: Record<string, any>) => FaasParams<Path>)
  /** Transformer applied to form values before the FaasJS request is fired. */
  transformValues?: (values: Values) => Record<string, any> | Promise<Record<string, any>>
  /** Called after a successful FaasJS response. */
  onSuccess?: (result: any, values: Record<string, any>) => void
  /** Called after a failed FaasJS request. */
  onError?: (error: any, values: Record<string, any>) => void
  /** Called after the request settles, regardless of success or failure. */
  onFinally?: () => void
}

/**
 * Shared props used by both Faas-backed and manually-submitted forms.
 *
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormCommonProps<
  Values extends Record<string, any>,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = Omit<AntdFormProps<Values>, 'onFinish' | 'children' | 'initialValues'> & {
  /** Item definitions rendered as form fields. */
  items?: (
    | (ExtendItemProps extends ExtendFormItemProps
        ? ExtendItemProps | FormItemProps
        : FormItemProps)
    | JSX.Element
  )[]
  /** Submit button config, or `false` to hide the built-in submit button. */
  submit?: false | FormSubmitProps
  /** Elements rendered before the form items. */
  beforeItems?: JSX.Element | JSX.Element[]
  /** Elements rendered after the submit button. */
  footer?: JSX.Element | JSX.Element[]
  /** Custom type renderers keyed by item type. */
  extendTypes?: ExtendTypes
  /** Arbitrary children rendered between items and the submit button. */
  children?: ReactNode
  /** Initial field values for the form. */
  initialValues?: Partial<Values>
}

/**
 * Props for the {@link Form} component when NO FaasJS integration is used.
 *
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormWithoutFaasProps<
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  /** Must not be set when using a custom `onFinish` handler. */
  faas?: never
  /** Custom submit handler that replaces the built-in FaasJS flow. */
  onFinish?: (values: Values) => void | Promise<void>
}

/**
 * Props for the {@link Form} component when FaasJS integration IS used.
 *
 * @template Path - Action path type inferred from the registered FaasJS actions.
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormWithFaasProps<
  Path extends FaasActionPaths = any,
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  /** FaasJS integration configuration. */
  faas?: FormFaasProps<Values, Path>
  /** Must not be set when `faas` is provided. */
  onFinish?: never
}

/**
 * Full props union accepted by the {@link Form} component.
 *
 * @template Values - Form values shape.
 * @template Path - Action path type (only relevant when `faas` is provided).
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormWithoutFaasProps<Values, ExtendItemProps> | FormWithFaasProps<Path, Values, ExtendItemProps>
