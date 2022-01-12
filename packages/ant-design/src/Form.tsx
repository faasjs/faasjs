import {
  Button,
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import {
  ExtendFormItemProps, FormItem, FormItemProps 
} from './FormItem'

export type FormProps<Values = any, ExtendItemProps = any> = {
  items?: (FormItemProps | ExtendItemProps)[]

  /** Default: { text: 'Submit' }, set false to disable it */
  submit?: false | {
    /** Default: Submit */
    text?: string
  }

  extendTypes?: ExtendFormItemProps
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
