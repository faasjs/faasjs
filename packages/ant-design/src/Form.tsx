import { faas, useEqualCallback } from '@faasjs/react'
import type { FaasAction } from '@faasjs/types'
import { Form as AntdForm, type FormProps as AntdFormProps, Button } from 'antd'
import { type JSX, type ReactNode, useEffect, useState } from 'react'
import { useConfigContext } from './Config'
import type {
  ExtendFormItemProps,
  ExtendFormTypeProps,
  ExtendTypes,
  FormItemProps,
} from './FormItem'
import { FormItem } from './FormItem'
import { transferValue } from './data'

export type { ExtendFormTypeProps, ExtendFormItemProps }

export type FormSubmitProps = {
  /** Default: Submit */
  text?: string
  /**
   * Submit to FaasJS server.
   *
   * If use onFinish, you should call submit manually.
   * ```ts
   * {
   *   submit: {
   *     to: {
   *       action: 'action_name'
   *     }
   *   },
   *   onFinish: (values, submit) => {
   *     // do something before submit
   *
   *     // submit
   *     await submit({
   *      ...values,
   *      extraProps: 'some extra props'
   *     })
   *
   *     // do something after submit
   *   }
   * }
   * ```
   */
  to?: {
    action: FaasAction | string
    /** params will overwrite form values before submit */
    params?: Record<string, any>
    then?: (result: any) => void
    catch?: (error: any) => void
    finally?: () => void
  }
}

export interface FormProps<
  Values extends Record<string, any> = any,
  ExtendItemProps extends ExtendFormItemProps = ExtendFormItemProps,
> extends Omit<
  AntdFormProps<Values>,
  'onFinish' | 'children' | 'initialValues'
> {
  items?: (
    | (ExtendItemProps extends ExtendFormItemProps
      ? ExtendItemProps | FormItemProps
      : FormItemProps)
    | JSX.Element
  )[]
  /** Default: { text: 'Submit' }, set false to disable it */
  submit?: false | FormSubmitProps
  onFinish?: (
    values: Values,
    submit?: (values: any) => Promise<any>
  ) => Promise<any>
  beforeItems?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
  extendTypes?: ExtendTypes
  children?: ReactNode
  initialValues?: Partial<Values>
}

function isFormItemProps(item: any): item is FormItemProps {
  return item.id !== undefined
}

/**
 * Form component with Ant Design & FaasJS
 *
 * - Based on [Ant Design Form](https://ant.design/components/form/).
 */
export function Form<Values = any>(props: FormProps<Values>) {
  const [loading, setLoading] = useState(false)
  const [computedProps, setComputedProps] = useState<FormProps<Values>>()
  const [submit, setSubmit] = useState<FormSubmitProps | false>()
  const config = useConfigContext()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const [form] = AntdForm.useForm<Values>(props.form)
  const [initialValues, setInitialValues] = useState<Partial<Values>>(
    props.initialValues
  )

  useEffect(() => {
    const { submit, ...propsCopy } = {
      ...props,
      form,
    }

    if (typeof submit !== 'undefined') setSubmit(submit)

    if (propsCopy.initialValues && propsCopy.items?.length) {
      for (const key in propsCopy.initialValues) {
        propsCopy.initialValues[key] = transferValue(
          propsCopy.items.find(item => isFormItemProps(item) && item.id === key)
            ?.type,
          propsCopy.initialValues[key]
        )
        const item = propsCopy.items.find(
          item => isFormItemProps(item) && item.id === key
        ) as FormItemProps
        if (item?.if) item.hidden = !item.if(propsCopy.initialValues)
      }
      for (const item of propsCopy.items) {
        if (isFormItemProps(item) && item.if)
          item.hidden = !item.if(propsCopy.initialValues)
      }
      setInitialValues(propsCopy.initialValues)
      delete propsCopy.initialValues
    }

    if (propsCopy.onFinish) {
      propsCopy.onFinish = async values => {
        setLoading(true)

        try {
          if ((submit as FormSubmitProps)?.to?.action) {
            await props.onFinish(values, async values =>
              faas(
                (
                  submit as {
                    to: {
                      action: string
                    }
                  }
                ).to.action,
                (
                  submit as {
                    to: {
                      params?: Record<string, any>
                    }
                  }
                ).to.params
                  ? {
                    ...values,
                    ...(
                      submit as {
                        to: {
                          params?: Record<string, any>
                        }
                      }
                    ).to.params,
                  }
                  : values
              )
            )
          } else await props.onFinish(values)
        } catch (error) {
          console.error(error)
        }

        setLoading(false)
      }
    } else if (
      submit &&
      (
        submit as {
          to?: {
            action: string
          }
        }
      ).to?.action
    ) {
      propsCopy.onFinish = async values => {
        setLoading(true)
        return faas(
          (
            submit as {
              to: {
                action: string
              }
            }
          ).to.action,
          (
            submit as {
              to: {
                params?: Record<string, any>
              }
            }
          ).to.params
            ? {
              ...values,
              ...(
                submit as {
                  to: {
                    params?: Record<string, any>
                  }
                }
              ).to.params,
            }
            : values
        )
          .then(result => {
            if ((submit as FormSubmitProps).to.then)
              (submit as FormSubmitProps).to.then(result)
            return result
          })
          .catch(error => {
            if ((submit as FormSubmitProps).to.catch)
              (submit as FormSubmitProps).to.catch(error)
            return Promise.reject(error)
          })
          .finally(() => {
            if ((submit as FormSubmitProps).to.finally)
              (submit as FormSubmitProps).to.finally()
            setLoading(false)
          })
      }
    }

    if (propsCopy.extendTypes) {
      setExtendTypes(propsCopy.extendTypes)
      delete propsCopy.extendTypes
    }

    setComputedProps(propsCopy)
  }, [props])

  const onValuesChange = useEqualCallback(
    (changedValues: Record<string, any>, allValues: Values) => {
      console.debug('Form:onValuesChange', changedValues, allValues)

      if (props.onValuesChange) {
        props.onValuesChange(changedValues, allValues)
      }

      if (!props.items) return

      for (const key in changedValues) {
        const item = computedProps.items.find(
          i => isFormItemProps(i) && i.id === key
        ) as FormItemProps

        if (item?.onValueChange)
          item.onValueChange(changedValues[key], allValues, form)
      }
    },
    [computedProps]
  )

  useEffect(() => {
    if (!initialValues) return

    console.debug('Form:initialValues', initialValues)

    form.setFieldsValue(initialValues as any)
    setInitialValues(null)
  }, [computedProps])

  if (!computedProps) return null

  return (
    <AntdForm {...computedProps} onValuesChange={onValuesChange}>
      {computedProps.beforeItems}
      {computedProps.items?.map(item => {
        if (isFormItemProps(item))
          return <FormItem key={item.id} {...item} extendTypes={extendTypes} />
        return item as JSX.Element
      })}
      {computedProps.children}
      {typeof submit !== 'boolean' && (
        <Button htmlType='submit' type='primary' loading={loading}>
          {submit?.text || config.theme.Form.submit.text}
        </Button>
      )}
      {computedProps.footer}
    </AntdForm>
  )
}

Form.whyDidYouRender = true

Form.useForm = AntdForm.useForm
Form.useFormInstance = AntdForm.useFormInstance
Form.useWatch = AntdForm.useWatch

Form.Item = FormItem
Form.List = AntdForm.List
Form.ErrorList = AntdForm.ErrorList
Form.Provider = AntdForm.Provider
