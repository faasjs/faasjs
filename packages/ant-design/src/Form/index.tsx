import { useEqualCallback, useEqualEffect } from '@faasjs/react'
import type { FaasActionPaths, FaasParams } from '@faasjs/types'
import { Form as AntdForm, type ButtonProps, type FormProps as AntdFormProps, Button } from 'antd'
import { type JSX, type ReactNode, useState } from 'react'

import { useConfigContext } from '../Config'
import { transferValue } from '../data'
import { faas } from '../FaasDataWrapper'
import type {
  ExtendFormItemProps,
  ExtendFormTypeProps,
  ExtendTypes,
  FormItemProps,
} from '../FormItem'
import { FormItem } from '../FormItem'

export type { ExtendFormTypeProps, ExtendFormItemProps }

/**
 * Props for the built-in submit button rendered by {@link Form}.
 */
export type FormSubmitProps = {
  /** Text rendered by the built-in submit button. */
  text?: string
  /** Additional props forwarded to the built-in submit button. */
  buttonProps?: ButtonProps
}

/**
 * Built-in FaasJS submit handler configuration for {@link Form}.
 *
 * @template Values - Form values shape used by submit handlers.
 * @template Path - Action path type.
 */
export type FormFaasProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
> = {
  /** Action name submitted through `faas()`. */
  action: Path
  /** Extra params merged into the submitted payload after `transformValues` runs. */
  params?: FaasParams<Path> | ((values: Record<string, any>) => FaasParams<Path>)
  /** Transform form values before sending the request. */
  transformValues?: (values: Values) => Record<string, any> | Promise<Record<string, any>>
  /** Callback invoked when the request succeeds. */
  onSuccess?: (result: any, values: Record<string, any>) => void
  /** Callback invoked when the request fails. */
  onError?: (error: any, values: Record<string, any>) => void
  /** Callback invoked after the request settles. */
  onFinally?: () => void
}

/**
 * Common props shared between {@link FormWithoutFaasProps} and {@link FormWithFaasProps}.
 *
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
type FormCommonProps<
  Values extends Record<string, any>,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = Omit<AntdFormProps<Values>, 'onFinish' | 'children' | 'initialValues'> & {
  /** Form item definitions or custom JSX blocks rendered inside the form. */
  items?: (
    | (ExtendItemProps extends ExtendFormItemProps
        ? ExtendItemProps | FormItemProps
        : FormItemProps)
    | JSX.Element
  )[]
  /** Built-in submit button config, or `false` to disable the generated submit button. */
  submit?: false | FormSubmitProps
  /** Extra content rendered before generated items. */
  beforeItems?: JSX.Element | JSX.Element[]
  /** Extra content rendered after generated items. */
  footer?: JSX.Element | JSX.Element[]
  /** Custom form item type renderers keyed by type name. */
  extendTypes?: ExtendTypes
  /** Additional custom content rendered inside the form. */
  children?: ReactNode
  /** Initial values applied to the underlying Ant Design form. */
  initialValues?: Partial<Values>
}

/**
 * Props for {@link Form} when used without the built-in FaasJS submit handler.
 *
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 *
 * @example
 * ```tsx
 * import { Form, type FormWithoutFaasProps } from '@faasjs/ant-design'
 *
 * export function ProfileForm() {
 *   return (
 *     <Form
 *       items={[
 *         { id: 'name', required: true },
 *         { id: 'email', required: true },
 *       ]}
 *       onFinish={async (values) => {
 *         console.log(values)
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export type FormWithoutFaasProps<
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  faas?: never
  /** Custom submit handler used instead of the built-in FaasJS submit flow. */
  onFinish?: (values: Values) => void | Promise<void>
}

/**
 * Props for {@link Form} when used with the built-in FaasJS submit handler.
 *
 * @template Path - Action path type for strong typing of `action` and `params`.
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 *
 * @example
 * ```tsx
 * import { Form, type FormWithFaasProps } from '@faasjs/ant-design'
 *
 * export function CreateUserForm() {
 *   return (
 *     <Form
 *       initialValues={{ role: 'user' }}
 *       items={[
 *         { id: 'name', required: true },
 *         { id: 'role', options: ['user', 'admin'] },
 *       ]}
 *       faas={{
 *         action: 'user/create',
 *         params: (values) => ({
 *           role: values.role || 'user',
 *         }),
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export type FormWithFaasProps<
  Path extends FaasActionPaths = any,
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormCommonProps<Values, ExtendItemProps> & {
  /** Built-in FaasJS submit handler, ignored when `onFinish` is provided. */
  faas?: FormFaasProps<Values, Path>
  onFinish?: never
}

/**
 * Props for the FaasJS Ant Design {@link Form} component.
 *
 * Union of {@link FormWithoutFaasProps} and {@link FormWithFaasProps} for backward compatibility.
 *
 * @template Values - Form values shape.
 * @template Path - Action path type.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormProps<
  Values extends Record<string, any> = any,
  Path extends FaasActionPaths = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = FormWithoutFaasProps<Values, ExtendItemProps> | FormWithFaasProps<Path, Values, ExtendItemProps>

function isFormItemProps(item: any): item is FormItemProps {
  return item.id !== undefined
}

/**
 * Render a data-aware Ant Design form without the built-in FaasJS submit handler.
 *
 * The component normalizes `initialValues` with {@link transferValue}, renders item definitions
 * through {@link FormItem}, and delegates submission to the custom `onFinish` handler.
 *
 * @template Values - Form values shape.
 * @param {FormWithoutFaasProps<Values>} props - Form props including items, submit behavior, and a custom `onFinish` handler.
 *
 * @example
 * ```tsx
 * import { Form } from '@faasjs/ant-design'
 *
 * export function ProfileForm() {
 *   return (
 *     <Form
 *       items={[
 *         { id: 'name', required: true },
 *         { id: 'email', required: true },
 *       ]}
 *       onFinish={async (values) => {
 *         console.log(values)
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function Form<Values extends Record<string, any> = any>(
  props: FormWithoutFaasProps<Values>,
): JSX.Element

/**
 * Render a data-aware Ant Design form with the built-in FaasJS submit handler.
 *
 * The component normalizes `initialValues` with {@link transferValue}, renders item definitions
 * through {@link FormItem}, and submits via the built-in FaasJS request flow configured by `faas`.
 *
 * When `Path` is provided, the `action` and `params` in `faas` are strongly typed from the
 * {@link FaasActions} type augmentation.
 *
 * @template Path - Action path type inferred from `faas.action` for strong typing.
 * @template Values - Form values shape.
 * @param {FormWithFaasProps<Path, Values>} props - Form props including items, submit behavior, and FaasJS integration.
 *
 * @example
 * ```tsx
 * import { Form } from '@faasjs/ant-design'
 *
 * export function CreateUserForm() {
 *   return (
 *     <Form
 *       initialValues={{ role: 'user' }}
 *       items={[
 *         { id: 'name', required: true },
 *         { id: 'role', options: ['user', 'admin'] },
 *       ]}
 *       faas={{
 *         action: 'user/create',
 *         params: (values) => ({
 *           role: values.role || 'user',
 *         }),
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function Form<Path extends FaasActionPaths, Values extends Record<string, any> = any>(
  props: FormWithFaasProps<Path, Values>,
): JSX.Element

/**
 * Render a data-aware Ant Design form (catch-all overload for backward compatibility).
 */
export function Form<Values extends Record<string, any> = any, Path extends FaasActionPaths = any>(
  props: FormProps<Values, Path>,
): JSX.Element

export function Form<Values extends Record<string, any> = any, Path extends FaasActionPaths = any>(
  props: FormProps<Values, Path>,
) {
  const [loading, setLoading] = useState(false)
  const [antdProps, setAntdProps] = useState<FormProps<Values>>()
  const [submit, setSubmit] = useState<FormSubmitProps | false>(props.submit === false ? false : {})
  const [items, setItems] = useState<Required<FormProps<Values>>['items']>([])
  const config = useConfigContext()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const [form] = AntdForm.useForm<Values>(props.form)
  const [initialValues, setInitialValues] = useState<Partial<Values> | null>(
    props.initialValues || Object.create(null),
  )
  const [onFinish, setOnFinish] = useState<AntdFormProps<Values>['onFinish']>()

  useEqualEffect(() => {
    if (props.onFinish) {
      setOnFinish(() => async (values: Values) => {
        if (!props.onFinish) return

        setLoading(true)

        try {
          return await props.onFinish(values)
        } finally {
          setLoading(false)
        }
      })

      return
    }

    if (props.faas?.action) {
      setOnFinish(() => async (values: Values) => {
        if (!props.faas?.action) return

        setLoading(true)

        let submitValues: Record<string, any> = values

        try {
          if (props.faas?.transformValues) {
            submitValues = await props.faas.transformValues(values)
          }

          const extraParams =
            typeof props.faas?.params === 'function'
              ? props.faas.params(submitValues)
              : props.faas.params

          if (extraParams) {
            submitValues = {
              ...submitValues,
              ...extraParams,
            }
          }

          const result = await faas(props.faas.action, submitValues as FaasParams<Path>)

          props.faas.onSuccess?.(result, submitValues)

          return result
        } catch (error) {
          props.faas.onError?.(error, submitValues)
          throw error
        } finally {
          props.faas.onFinally?.()
          setLoading(false)
        }
      })

      return
    }

    setOnFinish(undefined)
  }, [props.onFinish, props.faas])

  useEqualEffect(() => {
    setExtendTypes(props.extendTypes)
  }, [props.extendTypes])

  useEqualEffect(() => {
    setSubmit(props.submit === false ? false : props.submit || {})
  }, [props.submit])

  useEqualEffect(() => {
    const nextInitialValues = props.initialValues
      ? (JSON.parse(JSON.stringify(props.initialValues)) as Partial<Values>)
      : (Object.create(null) as Partial<Values>)

    for (const key in nextInitialValues) {
      nextInitialValues[key] = transferValue(
        props.items?.find((item) => isFormItemProps(item) && item.id === key)?.type,
        nextInitialValues[key],
      )
    }

    if (props.items?.length) {
      setItems(
        props.items.map((item) => {
          if (!isFormItemProps(item) || !item.if) return item

          return {
            ...item,
            hidden: !item.if(nextInitialValues),
          }
        }),
      )
    } else {
      setItems([])
    }

    if (props.initialValues) {
      setInitialValues(nextInitialValues)
      return
    }

    setInitialValues(null)
  }, [props.initialValues, props.items])

  useEqualEffect(() => {
    const propsCopy = {
      ...props,
    }

    // Strip FaasJS-only props before forwarding the rest to Ant Design Form.
    delete propsCopy.onFinish
    delete propsCopy.faas
    delete propsCopy.extendTypes
    delete propsCopy.submit
    delete propsCopy.items
    delete propsCopy.initialValues

    setAntdProps(propsCopy)
  }, [props])

  const onValuesChange = useEqualCallback(
    (changedValues: Partial<Values>, allValues: Values) => {
      if (props.onValuesChange) {
        props.onValuesChange(changedValues, allValues)
      }

      if (!items.length) return

      for (const key in changedValues) {
        const item = items.find((i) => isFormItemProps(i) && i.id === key) as FormItemProps

        if (item?.onValueChange) item.onValueChange(changedValues[key], allValues, form)
      }
    },
    [items, props.onValuesChange, form],
  )

  useEqualEffect(() => {
    if (!initialValues) return

    form.setFieldsValue(initialValues as any)
    setInitialValues(null)
  }, [form, initialValues, items])

  if (!antdProps) return null

  const submitButtonProps = typeof submit === 'object' ? submit.buttonProps : undefined
  const submitButtonLoading: ButtonProps['loading'] = loading
    ? true
    : (submitButtonProps?.loading ?? false)

  return (
    <AntdForm {...antdProps} form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
      {props.beforeItems}
      {items.map((item) => {
        if (isFormItemProps(item))
          return <FormItem key={item.id} {...item} {...(extendTypes ? { extendTypes } : {})} />
        return item as JSX.Element
      })}
      {props.children}
      {typeof submit !== 'boolean' && (
        <Button
          {...submitButtonProps}
          htmlType="submit"
          type={submitButtonProps?.type || 'primary'}
          loading={submitButtonLoading}
        >
          {submit?.text || config.theme.Form.submit.text}
        </Button>
      )}
      {props.footer}
    </AntdForm>
  )
}

Form.useForm = AntdForm.useForm
Form.useFormInstance = AntdForm.useFormInstance
Form.useWatch = AntdForm.useWatch

Form.Item = FormItem
Form.List = AntdForm.List
Form.ErrorList = AntdForm.ErrorList
Form.Provider = AntdForm.Provider
