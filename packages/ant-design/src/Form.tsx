import { faas } from '@faasjs/react'
import { Button, Form as AntdForm, type FormProps as AntdFormProps } from 'antd'
import { type ReactNode, useEffect, useState, useCallback } from 'react'
import { useConfigContext } from './Config'
import { transferValue } from './data'
import type {
  ExtendFormTypeProps,
  ExtendFormItemProps,
  ExtendTypes,
  FormItemProps,
} from './FormItem'
import { FormItem } from './FormItem'

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
    action: string
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
  initialValues?: Values
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
  const config = useConfigContext()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const [form] = AntdForm.useForm<Values>(props.form)
  const [initialValues, setInitialValues] = useState<Values>(
    props.initialValues
  )

  useEffect(() => {
    const propsCopy = {
      ...props,
      form,
    }

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
          if ((propsCopy.submit as FormSubmitProps)?.to?.action) {
            await props.onFinish(values, async values =>
              faas(
                (
                  propsCopy.submit as {
                    to: {
                      action: string
                    }
                  }
                ).to.action,
                (
                  propsCopy.submit as {
                    to: {
                      params?: Record<string, any>
                    }
                  }
                ).to.params
                  ? {
                      ...values,
                      ...(
                        propsCopy.submit as {
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
      propsCopy.submit &&
      (
        propsCopy.submit as {
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
            propsCopy.submit as {
              to: {
                action: string
              }
            }
          ).to.action,
          (
            propsCopy.submit as {
              to: {
                params?: Record<string, any>
              }
            }
          ).to.params
            ? {
                ...values,
                ...(
                  propsCopy.submit as {
                    to: {
                      params?: Record<string, any>
                    }
                  }
                ).to.params,
              }
            : values
        )
          .then(result => {
            if ((propsCopy.submit as FormSubmitProps).to.then)
              (propsCopy.submit as FormSubmitProps).to.then(result)
            return result
          })
          .catch(error => {
            if ((propsCopy.submit as FormSubmitProps).to.catch)
              (propsCopy.submit as FormSubmitProps).to.catch(error)
            return Promise.reject(error)
          })
          .finally(() => {
            if ((propsCopy.submit as FormSubmitProps).to.finally)
              (propsCopy.submit as FormSubmitProps).to.finally()
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

  const onValuesChange = useCallback(
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
      {computedProps.submit !== false && (
        <Button htmlType='submit' type='primary' loading={loading}>
          {computedProps.submit?.text || config.theme.Form.submit.text}
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
