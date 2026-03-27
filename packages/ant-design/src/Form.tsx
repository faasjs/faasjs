import { useEqualCallback, useEqualEffect } from '@faasjs/react'
import type { FaasAction } from '@faasjs/types'
import { Form as AntdForm, type ButtonProps, type FormProps as AntdFormProps, Button } from 'antd'
import { type JSX, type ReactNode, useState } from 'react'

import { useConfigContext } from './Config'
import { transferValue } from './data'
import { faas } from './FaasDataWrapper'
import type {
  ExtendFormItemProps,
  ExtendFormTypeProps,
  ExtendTypes,
  FormItemProps,
} from './FormItem'
import { FormItem } from './FormItem'

export type { ExtendFormTypeProps, ExtendFormItemProps }

/**
 * Props for the built-in submit button rendered by {@link Form}.
 */
export type FormSubmitProps = {
  /** Default: Submit */
  text?: string
  /** Props for the built-in submit button */
  buttonProps?: ButtonProps
}

/**
 * Built-in FaasJS submit handler for Form.
 *
 * @template Values - Form values shape used by submit handlers.
 *
 * @example
 * ```ts
 * {
 *   action: 'user/create',
 *   params: (values) => ({
 *     ...values,
 *     role: values.role || 'user',
 *   }),
 *   onSuccess: (result) => {
 *     console.log(result)
 *   },
 * }
 * ```
 */
export type FormFaasProps<Values extends Record<string, any> = any> = {
  /** Action name to submit to */
  action: FaasAction
  /** params will overwrite form values before submit */
  params?: Record<string, any> | ((values: Record<string, any>) => Record<string, any>)
  /** Transform form values before sending the request */
  transformValues?: (values: Values) => Record<string, any> | Promise<Record<string, any>>
  /** Called when the request succeeds */
  onSuccess?: (result: any, values: Record<string, any>) => void
  /** Called when the request fails */
  onError?: (error: any, values: Record<string, any>) => void
  /** Called after the request settles */
  onFinally?: () => void
}

/**
 * Props for the FaasJS Ant Design {@link Form} component.
 *
 * @template Values - Form values shape.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export type FormProps<
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> = Omit<AntdFormProps<Values>, 'onFinish' | 'children' | 'initialValues'> & {
  items?: (
    | (ExtendItemProps extends ExtendFormItemProps
        ? ExtendItemProps | FormItemProps
        : FormItemProps)
    | JSX.Element
  )[]
  /** Default: { text: 'Submit' }, set false to disable it */
  submit?: false | FormSubmitProps
  beforeItems?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
  extendTypes?: ExtendTypes
  children?: ReactNode
  initialValues?: Partial<Values>
} & (
    | {
        /** Built-in FaasJS submit handler, ignored when onFinish is provided */
        faas?: FormFaasProps<Values>
        onFinish?: never
      }
    | {
        faas?: never
        /** Custom submit handler, takes precedence over faas when both are provided */
        onFinish?: (values: Values) => void | Promise<void>
      }
  )

function isFormItemProps(item: any): item is FormItemProps {
  return item.id !== undefined
}

/**
 * Form component with Ant Design & FaasJS
 *
 * - Based on [Ant Design Form](https://ant.design/components/form/).
 * - Use `onFinish` for custom submit logic.
 * - Use `faas` for the built-in FaasJS submit flow.
 *
 * @template Values - Form values shape.
 * @param props - Form props including items, submit behavior, and FaasJS integration.
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
export function Form<Values extends Record<string, any> = any>(props: FormProps<Values>) {
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

        let submitValues = values as Record<string, any>

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

          const result = await faas(props.faas.action, submitValues)

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

    // Remove props that are not valid for Ant Design Form
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
      console.debug('Form:onValuesChange', changedValues, allValues)

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

    console.debug('Form:initialValues', initialValues)

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
