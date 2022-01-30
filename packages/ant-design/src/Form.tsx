import {
  Button,
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import { useEffect, useState } from 'react'
import { useFaasState } from './Config'
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
  }

  extendTypes?: {
    [type: string]: ExtendFormTypeProps
  }
} & AntdFormProps<Values>

export function Form<Values = any> (props: FormProps<Values>) {
  const [loading, setLoading] = useState(false)
  const [computedProps, setComputedProps] = useState<FormProps<Values>>()
  const [config] = useFaasState()

  useEffect(() => {
    const propsCopy = { ...props }

    if (propsCopy.onFinish) {
      propsCopy.onFinish = async values => {
        setLoading(true)

        try {
          await propsCopy.onFinish(values)
        } catch (error) {
          console.error(error)
        }

        setLoading(false)
      }
    }
    setComputedProps(props)
  }, [])

  if (!computedProps) return null

  return <AntdForm<Values> { ...computedProps }>
    {props.items?.map((item: FormItemProps) => <FormItem
      key={ item.id }
      { ...item }
      extendTypes={ props.extendTypes }
    />)}
    {props.children}
    {props.submit !== false && <Button
      htmlType='submit'
      type='primary'
      loading={ loading }
    >{props.submit?.text || config.Form.submit.text}</Button>}
  </AntdForm>
}

Form.useForm = AntdForm.useForm
Form.Item = FormItem
