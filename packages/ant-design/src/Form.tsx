import {
  Button,
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import { FormItem, FormItemProps } from './FormItem'

export type FormProps<T = any> = {
  items?: FormItemProps[]

  /** Default: { text: 'Submit' } */
  submit?: false | {
    /** Default: Submit */
    text?: string
  }
} & AntdFormProps<T>

export function Form<T = any> (props: FormProps<T>) {
  return <AntdForm<T> { ...props }>
    {props.items?.map(item => <FormItem
      key={ item.id }
      { ...item }
    />)}
    {props.children}
    {props.submit !== false && <Button
      htmlType='submit'
      type='primary'>{props.submit?.text || 'Submit'}</Button>}
  </AntdForm>
}

Form.useForm = AntdForm.useForm
