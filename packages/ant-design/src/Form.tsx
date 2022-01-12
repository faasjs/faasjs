import {
  Button,
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
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
  return <AntdForm<Values> { ...props }>
    {props.items?.map((item: FormItemProps) => <FormItem
      key={ item.id }
      { ...item }
      extendTypes={ props.extendTypes }
    />)}
    {props.children}
    {props.submit !== false && <Button
      htmlType='submit'
      type='primary'>{props.submit?.text || 'Submit'}</Button>}
  </AntdForm>
}

Form.useForm = AntdForm.useForm
Form.Item = FormItem
