import { faas } from '@faasjs/react'
import { Button, Form as AntdForm, FormProps as AntdFormProps } from 'antd'
import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  isValidElement,
} from 'react'
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
  ExtendItemProps = any
> extends Omit<
    AntdFormProps<Values>,
    'onFinish' | 'children' | 'initialValues'
  > {
  items?: (FormItemProps | ExtendItemProps | JSX.Element)[]
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

/**
 * Form component with Ant Design & FaasJS
 *
 * @ref https://ant.design/components/form/
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const propsCopy = {
      ...props,
      form,
    }

    if (propsCopy.initialValues && propsCopy.items?.length) {
      for (const key in propsCopy.initialValues) {
        propsCopy.initialValues[key] = transferValue(
          propsCopy.items.find(item => item.id === key)?.type,
          propsCopy.initialValues[key]
        )
        const item = propsCopy.items.find(item => item.id === key)
        if (item?.if) item.hidden = !item.if(propsCopy.initialValues)
      }
      for (const item of propsCopy.items) {
        if (item.if) item.hidden = !item.if(propsCopy.initialValues)
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onValuesChange = useCallback(
    (changedValues: Record<string, any>, allValues: Values) => {
      console.debug('Form:onValuesChange', changedValues, allValues)

      if (props.onValuesChange) {
        props.onValuesChange(changedValues, allValues)
      }

      if (!props.items) return

      for (const key in changedValues) {
        const item = computedProps.items.find(i => i.id === key)

        if (item?.onValueChange)
          item.onValueChange(changedValues[key], allValues, form)
      }
    },
    [computedProps]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
      {computedProps.items?.map((item: FormItemProps | JSX.Element) =>
        isValidElement(item) ? (
          item
        ) : (
          <FormItem
            key={(item as FormItemProps).id}
            {...(item as FormItemProps)}
            extendTypes={extendTypes}
          />
        )
      )}
      {computedProps.children}
      {computedProps.submit !== false && (
        <Button htmlType='submit' type='primary' loading={loading}>
          {computedProps.submit?.text || config.Form.submit.text}
        </Button>
      )}
      {computedProps.footer}
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
