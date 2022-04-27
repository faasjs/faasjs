import { faas } from '@faasjs/react'
import {
  Button,
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import {
  ReactNode, useEffect, useState
} from 'react'
import { useConfigContext } from './Config'
import {
  ExtendFormTypeProps, ExtendFormItemProps,
  FormItem, FormItemProps
} from './FormItem'

export { ExtendFormTypeProps, ExtendFormItemProps }

export type FormProps<Values = any, ExtendItemProps = any> = {
  items?: (FormItemProps | ExtendItemProps)[]
  /** Default: { text: 'Submit' }, set false to disable it */
  submit?: false | {
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
    }
  }

  onFinish?: (values: Values, submit?: (values: any) => Promise<any>) => Promise<any>
  beforeItems?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
  extendTypes?: {
    [type: string]: ExtendFormTypeProps
  }
  children?: ReactNode
} & Omit<AntdFormProps<Values>, 'onFinish' | 'children'>

export function Form<Values = any> (props: FormProps<Values>) {
  const [loading, setLoading] = useState(false)
  const [computedProps, setComputedProps] = useState<FormProps<Values>>()
  const config = useConfigContext()

  useEffect(() => {
    const propsCopy = { ...props }

    if (propsCopy.onFinish) {
      propsCopy.onFinish = async values => {
        setLoading(true)

        try {
          if (propsCopy.submit && propsCopy.submit.to?.action) {
            await props.onFinish(values, async values => faas((propsCopy.submit as {
              to: {
                action: string
              }
            }).to.action, (propsCopy.submit as {
              to: {
                params?: Record<string, any>
              }
            }).to.params ? {
                ...values,
                ...(propsCopy.submit as {
                  to: {
                    params?: Record<string, any>
                  }
                }).to.params
              } : values))
          } else
            await props.onFinish(values)
        } catch (error) {
          console.error(error)
        }

        setLoading(false)
      }
    } else if (propsCopy.submit && (propsCopy.submit as {
      to?: {
        action: string
      }
    }).to?.action) {
      propsCopy.onFinish = async values => {
        return await faas((propsCopy.submit as {
          to: {
            action: string
          }
        }).to.action, (propsCopy.submit as {
          to: {
            params?: Record<string, any>
          }
        }).to.params ? {
            ...values,
            ...(propsCopy.submit as {
              to: {
                params?: Record<string, any>
              }
            }).to.params
          } : values)
      }
    }

    setComputedProps(propsCopy)
  }, [])

  if (!computedProps) return null

  return <AntdForm<Values> { ...computedProps }>
    {computedProps.beforeItems}
    {computedProps.items?.map((item: FormItemProps) => <FormItem
      key={ item.id }
      { ...item }
      extendTypes={ computedProps.extendTypes }
    />)}
    {computedProps.children}
    {computedProps.submit !== false && <Button
      htmlType='submit'
      type='primary'
      loading={ loading }
    >{computedProps.submit?.text || config.Form.submit.text}</Button>}
    {computedProps.footer}
  </AntdForm>
}

Form.useForm = AntdForm.useForm
Form.Item = FormItem
